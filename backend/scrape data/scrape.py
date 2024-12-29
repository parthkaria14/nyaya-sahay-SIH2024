import os
import json
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

# Set up logging
logging.basicConfig(level=logging.INFO)

class SCNJDGScraper:
    def __init__(self, driver_path: str):
        self.driver_path = driver_path
        self.driver = webdriver.Chrome(service=Service(self.driver_path))
        self.wait = WebDriverWait(self.driver, 20)
        self.url = "https://scdg.sci.gov.in/scnjdg/"

    def navigate(self):
        self.driver.get(self.url)
        logging.info("Navigated to the website.")

    def scrape_data(self):
        try:
            # Wait for the main content to be loaded
            main_content = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'div.main-content'))
            )
            logging.info("Main content loaded successfully.")
            
            # Example: Scraping specific data
            # Adjust the following lines based on the actual structure of the page
            data = {}
            data['title'] = self.driver.title
            # Add more scraping logic here as needed

            return data

        except TimeoutException:
            logging.error("Timeout while waiting for the main content to load.")
            # Optionally, take a screenshot for debugging
            self.driver.save_screenshot('timeout_error.png')
            return None

        except Exception as e:
            logging.error(f"An error occurred: {e}")
            return None

    def save_results(self, data, filename='sci_data.json'):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        logging.info(f"Data saved to {filename}")

    def close(self):
        self.driver.quit()
        logging.info("WebDriver closed successfully.")

def main():
    scraper = SCNJDGScraper(driver_path='C:\\Program Files (x86)\\chromedriver.exe')  # Update with your path
    scraper.navigate()
    data = scraper.scrape_data()
    if data:
        scraper.save_results(data)
    scraper.close()

if __name__ == "__main__":
    main()