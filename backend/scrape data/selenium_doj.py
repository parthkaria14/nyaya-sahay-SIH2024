from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import json

# Set up Chrome options
options = Options()
options.add_argument("--headless")  # Run Chrome in headless mode (no GUI)
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

# Initialize the driver using webdriver-manager
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # URL to scrape
    url = "https://njdg.ecourts.gov.in/scnjdg/?p=home/index&app_token=a72b77e610e53b50a7b833a7cf4544f27ba3108b5dd8db9ca0a248e64e32fde3"
    driver.get(url)

    # Extract title
    title = driver.title

    # Extract meta description
    description = driver.find_element(By.XPATH, '//meta[@name="description"]')
    description_content = description.get_attribute("content") if description else "No description available"

    # Extract paragraphs
    paragraphs = driver.find_elements(By.TAG_NAME, "li")
    paragraph_texts = [p.text for p in paragraphs]

    # Extract links
    links = driver.find_elements(By.TAG_NAME, "a")
    links_data = [{"text": link.text, "url": link.get_attribute("href")} for link in links if link.get_attribute("href")]

    # Combine data into a dictionary
    data = {
        "title": title,
        "description": description_content,
        "paragraphs": paragraph_texts,
        "links": links_data,
    }

    # Save to JSON
    with open("selenium_scraped_data.json", "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

    # Print the JSON data
    print(json.dumps(data, ensure_ascii=False, indent=4))

except Exception as e:
    print(f"Error occurred: {e}")

finally:
    # Quit the driver
    driver.quit()
