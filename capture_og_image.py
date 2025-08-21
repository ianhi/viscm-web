#!/usr/bin/env python3
"""
Generate Open Graph preview image showing the viridis colormap visualization.
"""
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def capture_og_preview():
    """Capture a screenshot of the visualization for Open Graph."""
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--window-size=1200,630')
    options.add_argument('--device-scale-factor=2')  # For high DPI
    
    driver = webdriver.Chrome(options=options)
    
    try:
        # Navigate to the local development server
        driver.get('http://localhost:5173')
        
        # Wait for the page to load completely
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "visualization-grid"))
        )
        
        # Wait a bit more for all visualizations to render
        time.sleep(3)
        
        # Take screenshot
        driver.save_screenshot('public/og-preview.png')
        print("Open Graph preview image saved to public/og-preview.png")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_og_preview()