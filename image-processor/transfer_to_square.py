
import cv2
import numpy as np
from matplotlib import pyplot as plt
from glob import glob
import os

input_path = '/Users/jinmingzhang/Desktop/FYDP/image-processor/training_set/'
output_path = '/Users/jinmingzhang/Desktop/FYDP/image-processor/training_set_square/'
input_path += '**/*.png'
file_list = [f for f in glob(input_path, recursive=True)]
for f in file_list:
    image = cv2.imread(f)
    if image is None:
        continue
    img_name = f.split('/')[-1]
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Converting to GrayScale
    _, bw = cv2.threshold(gray, 0.0, 255.0, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    BKG = [255, 255, 255]
    width, height = np.shape(bw)
    if height > width:
        b_height = int(height / 10)
        b_width = int((b_height * 2 + height - width) / 2)
    else:
        b_width = int(width / 10)
        b_height = int((b_width * 2 + width - height) / 2)
    img_padding = cv2.copyMakeBorder(bw, b_width, b_width,
                                    b_height, b_height, cv2.BORDER_CONSTANT, value=BKG)
    target_path = os.path.join(output_path, img_name)
    print(target_path)
    cv2.imwrite(target_path, img_padding)