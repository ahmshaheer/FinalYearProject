from flask import Flask, jsonify, request
from PIL import Image
import requests
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route("/image-crop", methods=["POST"])
def image_crop():
    # Get the image URL and cropping coordinates from the request payload
    request_data = request.get_json()
    imgHash = request_data["imgHash"]
    bb = request_data["bb"]

    # Download the image from the URL and open it using PIL
    response = requests.get(imgHash)
    image = Image.open(io.BytesIO(response.content))

    # Extract the numeric values from the coordinates dictionary for each set of coordinates
    numeric_coordinates_list = [
        [int(c["x"]), int(c["y"]), int(c["width"]), int(c["height"])] for c in bb
    ]

    # Crop the image for each set of numeric coordinates and save the cropped image
    cropped_images = []
    for coordinates in numeric_coordinates_list:
        x, y, width, height = coordinates
        cropped_image = image.crop((x, y, x + width, y + height))
        cropped_images.append(cropped_image)

    # Save the list of cropped images
    for i, cropped_image in enumerate(cropped_images):
        cropped_image.save(f"cropped_image_{i}.jpg")

    # Return a success message as a JSON response
    return jsonify({"message": "Images cropped and saved successfully"})


if __name__ == "_main_":
    app.run(debug=True, port=3001)
