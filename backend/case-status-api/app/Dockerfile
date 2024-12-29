# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    CHROMEDRIVER_BIN=/usr/local/bin/chromedriver \
    CHROME_BIN=/usr/bin/google-chrome

# Install necessary packages
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    unzip \
    chromium \
    chromium-driver \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy ChromeDriver into the container
COPY chromedriver.exe /usr/local/bin/chromedriver

# Set permissions for ChromeDriver
RUN chmod +x /usr/local/bin/chromedriver

# Set the working directory
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the FastAPI port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
