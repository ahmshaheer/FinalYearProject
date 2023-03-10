from flask import Flask, jsonify, request
from PIL import Image
import requests
import io
import pytesseract

app = Flask(__name__)

@app.route('/image-crop', methods=['POST'])
def image_crop():
    # Get the image URL from the request payload
    request_data = request.get_json()
    image_url = request_data['image_url']

    # Download the image from the URL and open it using PIL
    response = requests.get(image_url)
    image = Image.open(io.BytesIO(response.content))

    # Get the cropping coordinates from the request payload
    coordinates_list = request_data['coordinates']

    cropped_images = []
    # Crop the image for each set of coordinates and save the cropped image
    for coordinates in coordinates_list:
        x, y, width, height = [int(c) for c in coordinates]
        cropped_image = image.crop((x, y, x + width, y + height))
        cropped_images.append(cropped_image)

    # Save the list of cropped images
    for i, cropped_image in enumerate(cropped_images):
        cropped_image.save(f'cropped_image_{i}.jpg')

    # Return a success message as a JSON response
    return jsonify({'message': 'Images cropped and saved successfully'})


if __name__ == '__main__':
    app.run(debug=True, port=6000)








