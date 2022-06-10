import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D
from keras import backend as k
import matplotlib.pyplot as plt
import numpy as np
from scipy.io import loadmat
import os
from math import sqrt
import cv2
from zipfile import *

class train_ocr_lib:

    def get_model(self, input_shape, num_category):
        model = Sequential()
        model.add(Conv2D(32, kernel_size=(3, 3),
                         activation='relu',
                         input_shape=input_shape))
        model.add(Conv2D(64, (3, 3), activation='relu'))
        model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Conv2D(128, (3, 3), activation='relu'))
        # model.add(MaxPooling2D(pool_size=(2, 2)))
        # model.add(Conv2D(256, (3, 3), activation='relu'))
        # model.add(MaxPooling2D(pool_size=(2, 2)))
        model.add(Dropout(0.25))
        model.add(Flatten())
        model.add(Dense(512, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(num_category, activation='softmax'))
        model.compile(loss=keras.losses.categorical_crossentropy,
                      optimizer=keras.optimizers.SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True),
                      metrics=['accuracy'])
        return model

    def train(self, x_train, y_train, x_test, y_test, input_shape, num_category, num_epoch):
        model = self.get_model(input_shape, num_category)
        batch_size = 128
        model_log = model.fit(x_train, y_train,
                  batch_size=batch_size,
                  epochs=num_epoch,
                  verbose=1,
                  validation_data=(x_test, y_test))

        model_digit_json = model.to_json()
        with open("model_ascii.json", "w") as json_file:
            json_file.write(model_digit_json)
        model.save_weights("model_ascii.h5")
        print('Finished')

    def evaluate(self, x_test, y_test, input_shape, num_category):
        model = self.get_model(input_shape, num_category)
        model.load_weights("../model_digit_letter.h5")
        score = model.evaluate(x_test, y_test, verbose=0)
        results = model.predict_classes(x_test, 25)
        for c in results:
            print(chr(c))
        print('Classes:', results)
        print('Test loss:', score[0])
        print('Test accuracy:', score[1])

    def test(self, imgs, model_addr, input_shape, num_category):
        model = self.get_model(input_shape, num_category)
        model.load_weights(model_addr)
        result = model.predict_classes(imgs)
        return result

    def process(self, x_train, y_train, x_test, y_test, num_category, img_rows, img_cols):
        if k.image_data_format() == 'channels_first':
            x_train = x_train.reshape(x_train.shape[0], 1, img_rows, img_cols)
            x_test = x_test.reshape(x_test.shape[0], 1, img_rows, img_cols)
            input_shape = (1, img_rows, img_cols)
        else:
            x_train = x_train.reshape(x_train.shape[0], img_rows, img_cols, 1)
            x_test = x_test.reshape(x_test.shape[0], img_rows, img_cols, 1)
            input_shape = (img_rows, img_cols, 1)
        x_train = x_train.astype('float32')
        x_test = x_test.astype('float32')
        x_train /= 255
        x_test /= 255

        if y_train is not None and y_test is not None:
            y_train = keras.utils.to_categorical(y_train, num_category)
            y_test = keras.utils.to_categorical(y_test, num_category)
        return x_train, y_train, x_test, y_test, input_shape

    def process_img(self, img_name, img_rows, img_cols, archive):
        label = int(img_name[-13:-10])
        if 1 <= label <= 10:
            label += 47
        elif 11 <= label <= 36:
            label += 54
        else:
            label += 60
        data = archive.read(img_name)
        img_orig = cv2.imdecode(np.frombuffer(data, np.uint8), 1)
        img_rgb = cv2.resize(img_orig, (img_cols, img_rows))
        img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)  # Converting to GrayScale
        _, img_bw = cv2.threshold(img_gray, 0.0, 255.0, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        return img_bw, label

    def split_dataset(self, prefix, img_rows, img_cols):
        x_train = []
        y_train = []
        x_test = []
        y_test = []
        num_category = 128
        archive = ZipFile(os.path.join(prefix, 'EnglishFnt.zip'), 'r')
        img_files = [name for name in archive.namelist() if name.endswith('.png')]
        np.random.shuffle(img_files)
        train_size = int(len(img_files) * 0.9)
        train_files = img_files[:train_size]
        test_files = img_files[train_size:]
        for img_name in train_files:
            img_bw, label = self.process_img(img_name, img_rows, img_cols, archive)
            x_train.append(img_bw)
            y_train.append([label])
        for img_name in test_files:
            img_bw, label = self.process_img(img_name, img_rows, img_cols, archive)
            x_test.append(img_bw)
            y_test.append([label])
        x_train_reshaped = np.reshape(x_train, (len(x_train), img_cols, img_rows, 1))
        x_test_reshaped = np.reshape(x_test, (len(x_test), img_cols, img_rows, 1))
        return x_train_reshaped, y_train, x_test_reshaped, y_test, num_category
