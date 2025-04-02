import cv2
import numpy as np
import argparse


def process_image(input_path, output_path):
    image = cv2.imread(input_path)
    if image is None:
        return False

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use thresholding to isolate white areas
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)

    # Find all white pixels
    coords = cv2.findNonZero(thresh)
    if coords is None:
        return False

    # Get bounding box of white area
    x, y, w, h = cv2.boundingRect(coords)

    # Crop to bounding box
    cropped = image[y:y+h, x:x+w]

    # Save result
    cv2.imwrite(output_path, cropped)
    return True
