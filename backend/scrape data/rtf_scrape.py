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


def find_rtf_links(driver, base_url):
    """Finds all RTF links on the website."""
    rtf_links = set()
    driver.get(base_url)

    # Wait for the page to load and extract links
    links = driver.find_elements(By.TAG_NAME, "a")
    for link in links:
        href = link.get_attribute("href")
        if href and href.endswith(".docx"):
            rtf_links.add(href)

    return list(rtf_links)


def extract_filename_from_url(url):
    """Extracts the filename from the URL."""
    parsed_url = urlparse(url)
    return os.path.basename(parsed_url.path)


def download_rtfs(rtf_links, download_folder):
    """Downloads all RTF files from the list of links, preserving their original filenames."""
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    for rtf_url in rtf_links:
        try:
            response = requests.get(rtf_url, stream=True)
            response.raise_for_status()
            file_name = extract_filename_from_url(rtf_url)
            file_path = os.path.join(download_folder, file_name)

            with open(file_path, "wb") as rtf_file:
                for chunk in response.iter_content(chunk_size=1024):
                    rtf_file.write(chunk)

            print(f"Downloaded: {file_name}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {rtf_url}: {e}")


def main():
    base_url = "https://aktiwari.com/%e0%a4%aa%e0%a4%b0%e0%a4%be%e0%a4%95%e0%a5%8d%e0%a4%b0%e0%a4%ae%e0%a5%8d%e0%a4%af-%e0%a4%b2%e0%a4%bf%e0%a4%96%e0%a4%bf%e0%a4%a4-%e0%a4%85%e0%a4%a7%e0%a4%bf%e0%a4%a8%e0%a4%bf%e0%a4%af%e0%a4%ae-legal/"  # Replace with your target URL
    download_folder = "Hindi legal docs"

    driver = setup_driver()

    try:
        print("Finding RTF links...")
        rtf_links = find_rtf_links(driver, base_url)
        print(f"Found {len(rtf_links)} RTF files.")

        print("Downloading RTF files with original filenames...")
        download_rtfs(rtf_links, download_folder)

    finally:
        driver.quit()


if __name__ == "__main__":
    main()
