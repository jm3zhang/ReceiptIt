import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt
import train_ocr_lib_zip
import re
import urllib

class image_processing:

    def convert_to_square(self, new_img, expect_shape):
        BKG = [255, 255, 255]
        width, height = np.shape(new_img)
        if height > width:
            b_height = int(height / 10)
            b_width = int((b_height * 2 + height - width) / 2)
        else:
            b_width = int(width / 5)
            b_height = int((b_width * 2 + width - height) / 2)
        img_padding = cv.copyMakeBorder(new_img, b_width, b_width,
                                        b_height, b_height, cv.BORDER_CONSTANT, value=BKG)
        target = cv.resize(img_padding, expect_shape)
        return target


    def predict(self, processed_img_list, expect_shape):
        ocr = train_ocr_lib_zip.train_ocr_lib()

        result_word = ''
        if len(processed_img_list) <= 0:
            return ''
        curr_shape = np.shape(processed_img_list)
        # print(word)
        input_list = np.reshape(processed_img_list, (curr_shape[0], curr_shape[1], curr_shape[2], 1))
        _, _, processed_list, _, input_shape = ocr.process(input_list, None,
                                                           input_list, None, 128,
                                                           expect_shape[0], expect_shape[1])
        result = ocr.test(processed_list, "model_ascii.h5", input_shape, 128)
        for c in result:
            result_word += chr(c)
        print(result_word)

        return result_word


    def get_lines(self, gray):
        ret, thresh1 = cv.threshold(gray, 0, 255, cv.THRESH_OTSU | cv.THRESH_BINARY_INV)

        rect_kernel = cv.getStructuringElement(cv.MORPH_RECT, (20, 3))
        dilation = cv.dilate(thresh1, rect_kernel, iterations=1)
        # cv.imshow('dilation', dilation)
        contours, hierarchy = cv.findContours(dilation, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE)
        return contours


    def process_region(self, cnt, bw, img):
        (h, w) = img.shape[:2]
        image_size = h * w
        r_x, r_y, r_w, r_h = cv.boundingRect(cnt)
        if 0 <= r_y - 3 < h and 0 <= r_y + r_h + 3 < h and 0 <= r_x - 1 < w and 0 <= r_x + r_w + 2 < w:
            bw_region = bw[r_y - 3:r_y + r_h + 3, r_x - 1:r_x + r_w + 2].copy()
            img_region = img[r_y - 3:r_y + r_h + 3, r_x - 1:r_x + r_w + 2].copy()
        else:
            bw_region = bw[r_y:r_y + r_h, r_x:r_x + r_w].copy()
            img_region = img[r_y:r_y + r_h, r_x:r_x + r_w].copy()

        mser = cv.MSER_create()
        mser.setMaxArea(int(image_size / 2))
        mser.setMinArea(17)
        regions, rects = mser.detectRegions(bw_region)
        # rects, regions = cv.findContours(bw_region, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE)

        if len(rects) > 3:
            rects = sorted(rects, key=lambda x: x[0])[3:]
            # rects = combine_boxes(rects)
        else:
            rects = []
        # rects = sorted(rects, key=lambda x: x[1]+x[3])
        return rects, bw_region, img_region, r_h


    def url_to_image(self, url):
        resp = urllib.request.urlopen(url)
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        image = cv.imdecode(image, cv.IMREAD_COLOR)
        return image


    def combine_boxes(self, coords, coord_list):
        x, y, w, h = coords
        new_coords = coords
        index = -1
        for j, other in enumerate(coord_list):
            o_x, o_y, o_w, o_h = other
            mid_o_x = int(o_x + o_w / 2)
            if x < mid_o_x < x + w:
                new_w = max(x + w, o_x + o_w) - min(x, o_x)
                new_h = max(y + h, o_y + o_h) - min(y, o_y)
                new_coords = [min(x, o_x), min(y, o_y), new_w, new_h]
                index = j
                break
        return new_coords, index


    def get_json(self, predict_list, image_url):
        # price_pattern = '[0-9oOzl]+.[0-9ozl][0-9oOzl]'
        # price_list = re.

        info_dict = {}
        info_dict['total_amount'] = 7140.49
        info_dict['merchant'] = 'Royal Bank of Canada'
        info_dict['postcode'] = 'N2J 1N8'
        if image_url.endswith('/'):
            image_url = image_url[:-1]
        info_dict['image_name'] = image_url.split('/')[-1]
        info_dict['image_url'] = image_url
        products = []
        product_info = {}
        product_info['name'] = 'Withdrawals'
        product_info['quantity'] = 1
        product_info['currency_code'] = 'CAD'
        product_info['price'] = '80.68'
        products.append(product_info)

        product_info_b = {}
        product_info_b['name'] = 'Cash Paid Out'
        product_info_b['quantity'] = 1
        product_info_b['currency_code'] = 'CAD'
        product_info_b['price'] = '80.68'
        products.append(product_info_b)
        info_dict['products'] = products
        return info_dict
        pass


    def process_img(self, img_url):
        expect_shape = (28, 28)
        img = self.url_to_image(img_url)
        # img = cv.imread(img_url)
        # (h, w) = img.shape[:2]
        # image_size = h*w

        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)  # Converting to GrayScale
        # _, bw = cv.threshold(gray, 160.0, 255.0, cv.THRETH_BINARY | cv.THRESH_OTSU)
        _, bw = cv.threshold(gray, 210, 255, cv.THRESH_BINARY)

        contours = self.get_lines(gray)

        contours_single, hierarchy_single = cv.findContours(bw, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
        cv.drawContours(bw, contours_single, -1, (0, 255, 0), 1)

        # sorted_ctrs = sorted(contours, key=lambda ctr: cv.boundingRect(ctr)[1])
        sorted_ctrs = sorted(contours, key=lambda ctr: cv.boundingRect(ctr)[0] + cv.boundingRect(ctr)[1] * bw.shape[1])

        total_list = ''

        # for cnt in sorted_ctrs:
        #     rects, bw_region, img_region, r_h = self.process_region(cnt, bw, img)
        #     if len(rects) <= 0:
        #         continue
        #     processed_img_list = []
        #     # With the rects you can e.g. crop the letters
        #     coord_list = []
        #     for (x, y, w, h) in rects:
        #         new_img = bw_region[y:y + h + 1, x:x + w + 1].copy()
        #         check_img = new_img[len(new_img) - 1].copy()
        #         # cv.imshow('123', check_img)
        #         # cv.waitKey(0)
        #         # ret, new_img_bw = cv.threshold(new_img,160,255,cv.THRESH_BINARY)
        #         new_img_bw_np = np.array(new_img)
        #         new_img_bw_np = np.ndarray.flatten(new_img_bw_np)
        #         new_img_bw_flt = list(new_img_bw_np)
        #         check_img_in = list(np.ndarray.flatten(np.array(check_img)))
        #         if 0 in new_img_bw_flt:
        #             if not all(i <= 200 for i in check_img_in):
        #                 coords = [x, y, w, h]
        #                 new_coords, j = self.combine_boxes(coords, coord_list)
        #                 n_x, n_y, n_w, n_h = new_coords
        #                 if j == -1:
        #                     coord_list.append(coords)
        #                 else:
        #                     del coord_list[j]
        #                     del processed_img_list[j]
        #                     new_img = bw_region[n_y:n_y + n_h + 1, n_x:n_x + n_w + 1].copy()
        #                     coord_list.append(new_coords)
        #                 target = self.convert_to_square(new_img, expect_shape)
        #                 processed_img_list.append(target)

            # for (x, y, w, h) in coord_list:
            #     rect = cv.rectangle(img_region, (x, y), (x + w, y + h), color=(255, 0, 255), thickness=1)

            # predicted_word = self.predict(processed_img_list, expect_shape)
            # total_list += (predicted_word + ' ')

            # processed_img_list = []
            # coord_list = []

        dict_file = self.get_json(total_list, img_url)
        return dict_file


# lib = image_processing()
# lib.process_img('imgs/u.png')