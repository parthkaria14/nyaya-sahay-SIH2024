import os
import requests
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager


def setup_driver():
    """Sets up the Selenium WebDriver."""
    options = Options()
    options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


def find_pdf_links(driver, base_url):
    """Finds all PDF links on the website."""
    pdf_links = set()
    driver.get(base_url)

    # Wait for the page to load and extract links
    links = driver.find_elements(By.TAG_NAME, "a")
    for link in links:
        href = link.get_attribute("href")
        if href and href.endswith(".pdf"):
            pdf_links.add(href)

    return list(pdf_links)


def extract_filename_from_url(url):
    """Extracts the filename from the URL."""
    parsed_url = urlparse(url)
    return os.path.basename(parsed_url.path)


def download_pdfs(pdf_links, download_folder):
    """Downloads all PDFs from the list of links, preserving their original filenames."""
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    for pdf_url in pdf_links:
        try:
            response = requests.get(pdf_url, stream=True)
            response.raise_for_status()
            file_name = extract_filename_from_url(pdf_url)
            file_path = os.path.join(download_folder, file_name)

            with open(file_path, "wb") as pdf_file:
                for chunk in response.iter_content(chunk_size=1024):
                    pdf_file.write(chunk)

            print(f"Downloaded: {file_name}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {pdf_url}: {e}")


def main():
    base_url = "https://aktiwari.com/matrimonial-cases-legal-drafts-formats/"
    download_folder = "doj_pdfs"

    driver = setup_driver()

    try:
        print("Finding PDF links...")
        pdf_links = find_pdf_links(driver, base_url)
        print(f"Found {len(pdf_links)} PDFs.")

        print("Downloading PDFs with original filenames...")
        download_pdfs(pdf_links, download_folder)

    finally:
        driver.quit()


if __name__ == "__main__":
    main()
