from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import cv2
import tempfile
import zipfile
import numpy as np
import os
from cropper import process_image
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

@app.route("/api/crop-multiple", methods=["POST"])
def crop_multiple():
    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files provided"}), 400

    with tempfile.TemporaryDirectory() as tmp_dir:
        input_paths = []

        # Check if only 1 file and it's a zip
        if len(files) == 1 and files[0].filename.endswith('.zip'):
            zip_file = files[0]
            zip_path = os.path.join(tmp_dir, "upload.zip")
            zip_file.save(zip_path)

            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(tmp_dir)

            # Collect all jpgs from extracted zip
            for root, _, filenames in os.walk(tmp_dir):
                for f in filenames:
                    if f.lower().endswith('.jpg'):
                        input_paths.append(os.path.join(root, f))
        else:
            # Handle 1 or more jpg files
            print("Handling individual jpg files", flush=True)
            for i, file in enumerate(files):
                if file.filename.lower().endswith(".jpg"):
                    input_path = os.path.join(tmp_dir, f"input_{i}.jpg")
                    file.save(input_path)
                    input_paths.append(input_path)

        if not input_paths:
            return jsonify({"error": "No JPG files found"}), 400

        pdf_paths = []

        for i, input_path in enumerate(input_paths):
            output_path = os.path.join(tmp_dir, f"output_{i}.jpg")
            pdf_path = os.path.join(tmp_dir, f"output_{i}.pdf")

            if process_image(input_path, output_path):
                try:
                    img = Image.open(output_path).convert("RGB")
                    img.save(pdf_path, "PDF")
                    img.close()
                    pdf_paths.append(pdf_path)
                except Exception as e:
                    print(f"Error converting image to PDF: {e}")
                    return jsonify({"error": "Failed to convert image to PDF"}), 500
        if not pdf_paths:
            return jsonify({"error": "No documents were detected"}), 422

        # Decide if returning single PDF or zipped PDFs
        if len(pdf_paths) == 1:
            with open(pdf_paths[0], 'rb') as f:
                pdf_data = f.read()
            return send_file(
                io.BytesIO(pdf_data),
                mimetype="application/pdf",
                as_attachment=True,
                download_name="cropped_document.pdf"
            )    
        else:
            zip_path = os.path.join(tmp_dir, "documents.zip")
            with zipfile.ZipFile(zip_path, "w") as zipf:
                for pdf in pdf_paths:
                    zipf.write(pdf, os.path.basename(pdf))
            with open(zip_path, 'rb') as f:
                zip_data = f.read()
            return send_file(
                io.BytesIO(zip_data),
                mimetype="application/zip",
                as_attachment=True,
                download_name="cropped_documents.zip"
            )

if __name__ == "__main__":
    app.run(debug=True)
