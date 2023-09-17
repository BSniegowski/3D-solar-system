from flask import Flask, Response, request
from selenium import webdriver
from selenium.webdriver.common.by import By
from flask_cors import CORS, cross_origin
import requests
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
app = Flask(__name__)
cors = CORS(app)


@app.route('/get-map-url')
@cross_origin()
def get_map_url():
    driver = webdriver.Chrome(options=chrome_options)

    driver.get("https://topps.diku.dk/torbenm/maps.msp")

    button = driver.find_element(by=By.CSS_SELECTOR, value='[value="Random"]')
    button.click()
    image = driver.find_element(by=By.TAG_NAME, value="img")
    image_url = image.get_attribute('src')

    # Fetch the image from the provided URL
    response = requests.get(image_url)

    driver.quit()
    # Check if the request to fetch the image was successful
    if response.status_code == 200:
        return Response(response.content, content_type=response.headers['content-type'])
    else:
        return "Failed to fetch image", 400


if __name__ == '__main__':
    app.run(debug=True)
