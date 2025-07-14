# Use official Python image with system dependencies
FROM mcr.microsoft.com/playwright/python:v1.53.0-jammy

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port if running a web server (optional)
# EXPOSE 8000

# Command to run your script
CMD ["python", "main.py"]
