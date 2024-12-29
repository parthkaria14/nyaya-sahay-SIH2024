from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from webdriver_manager.chrome import ChromeDriverManager  # Import webdriver-manager
import time
import base64

app = FastAPI()

# Enable CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global driver instance
driver = None

# Initialize the WebDriver
def initialize_driver():
    global driver
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration
    chrome_options.add_argument("--no-sandbox")  # Required for running in some environments
    chrome_options.add_argument("--window-size=1920,1080")  # Set window size for headless mode

    # Use webdriver-manager to automatically download and manage ChromeDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

@app.get("/")
async def fetch_captcha():
    """Fetch the CAPTCHA image from the target website."""
    try:
        initialize_driver()
        # Open the target website
        driver.get("https://services.ecourts.gov.in/ecourtindia_v6/")
        time.sleep(5)  # Allow the page to load

        # Capture the CAPTCHA image
        captcha_element = driver.find_element(By.ID, "captcha_image")
        captcha_image_data = captcha_element.screenshot_as_png  # Capture screenshot as PNG data
        captcha_base64 = base64.b64encode(captcha_image_data).decode("utf-8")  # Convert to base64

        return JSONResponse(content={"captcha_base64": captcha_base64})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/submit")
async def submit(cino: str = Form(...), captcha: str = Form(...)):
    """Automate form filling and retrieve results."""
    global driver
    try:
        if not cino or not captcha:
            raise HTTPException(status_code=400, detail="CNR number or CAPTCHA is missing.")

        # Debug: Print the page source to check if elements are present
        print(driver.page_source)

        # Automate form submission
        cnr_input = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.NAME, "cino"))
        )
        cnr_input.clear()
        cnr_input.send_keys(cino)

        # Wait for the CAPTCHA input field to be present and interactable
        captcha_input = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.ID, "fcaptcha_code"))
        )
        captcha_input.clear()
        captcha_input.send_keys(captcha)

        # Click the search button
        search_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.ID, "searchbtn"))
        )
        search_button.click()

        time.sleep(10)  # Increase sleep time to ensure dynamic content loads

        # Scrape the result
        result_element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "history_cnr"))
        )
        result_text = result_element.text

        return JSONResponse(content={"success": True, "result": result_text})

    except TimeoutException:
        raise HTTPException(status_code=500, detail="Timeout: Element not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("shutdown")
def shutdown_event():
    """Close the WebDriver when the application shuts down."""
    global driver
    if driver:
        driver.quit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)