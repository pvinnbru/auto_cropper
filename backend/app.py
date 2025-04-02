from flask import Flask, request, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
from cropper import process_image

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route("/api/crop", methods=["POST"])
def crop_document():
    if 'file' not in request.files:
        return {"error": "No file provided"}, 400

    file = request.files['file']
    input_path = "temp_input.jpg"
    output_path = "temp_output.jpg"

    file.save(input_path)
    success = process_image(input_path, output_path)

    if success:
        return send_file(output_path, mimetype='image/jpeg')
    else:
        return {"error": "Document not detected"}, 422

if __name__ == "__main__":
    app.run(debug=True)
