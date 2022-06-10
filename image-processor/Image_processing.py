import cv2 as cv
import urllib.request
import numpy as np
from matplotlib import pyplot as plt
# import train_ocr_lib_zip

def convert_to_square(new_img, expect_shape):
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

def predict(processed_img_list, expect_shape):
    ocr = train_ocr_lib_zip.train_ocr_lib()
    result_word = ''

    for line in processed_img_list:
        for word in line:
            if len(word) <= 0:
                continue
            curr_shape = np.shape(word)
            # print(word)
            input_list = np.reshape(word, (curr_shape[0], curr_shape[1], curr_shape[2], 1))
            _, _, processed_list, _, input_shape = ocr.process(input_list, None,
                                                               input_list, None, 128,
                                                               expect_shape[0], expect_shape[1])
            result = ocr.test(processed_list, "../model_ascii.h5", input_shape, 128)
            for c in result:
                result_word += chr(c)
    print(result_word)

def get_lines(gray):
    ret, thresh1 = cv.threshold(gray, 0, 255, cv.THRESH_OTSU | cv.THRESH_BINARY_INV)

    rect_kernel = cv.getStructuringElement(cv.MORPH_RECT, (20, 3))
    dilation = cv.dilate(thresh1, rect_kernel, iterations=1)
    # cv.imshow('dilation', dilation)
    contours, hierarchy = cv.findContours(dilation, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE)

    '''
    im2 = gray.copy()
    for cnt in contours:
        x, y, w, h = cv.boundingRect(cnt)
        cv.rectangle(im2, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv.imshow('final', im2)
    cv.waitKey(0)
    '''
    return contours

# METHOD #1: OpenCV, NumPy, and urllib
def url_to_image(url):
	# download the image, convert it to a NumPy array, and then read
	# it into OpenCV format
	resp = urllib.request.urlopen(url)
	image = np.asarray(bytearray(resp.read()), dtype="uint8")
	image = cv.imdecode(image, cv.IMREAD_COLOR)
 
	# return the image
	return image

def process_region(cnt, bw, img):
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
    else:
        rects = []
    # rects = sorted(rects, key=lambda x: x[1]+x[3])
    return rects, bw_region, img_region, r_h

def get_json():
    info_dict = {}
    info_dict['total_amount'] = 100.0
    info_dict['merchant'] = 'Jimmy Restaurant'
    info_dict['postcode'] = '43553'
    if image_url.endswith('/'):
        image_url = image_url[:-1]
    info_dict['image_name'] = image_url.split('/')[-1]
    info_dict['image_url'] = image_url
    products = []
    for product in products_list:
        product_info = {}
        product_info['name'] = '123'
        product_info['description'] = '123'
        product_info['quantity'] = 1
        product_info['currency_code'] = 'CAD'
        product_info['price'] = '6.00'
        products.append(product_info)
    info_dict['products'] = products
    return info_dict
    pass

def process_img(img_url):
    expect_shape = (28, 28)
    #input image url
    img = url_to_image(img_url)
    (h, w) = img.shape[:2]
    image_size = h*w

    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY) #Converting to GrayScale
    # _, bw = cv.threshold(gray, 160.0, 255.0, cv.THRETH_BINARY | cv.THRESH_OTSU)
    _, bw = cv.threshold(gray, 210, 255, cv.THRESH_BINARY)

    contours = get_lines(gray)

    contours_single, hierarchy_single = cv.findContours(bw, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    cv.drawContours(bw, contours_single, -1, (0,255,0), 1)

    # sorted_ctrs = sorted(contours, key=lambda ctr: cv.boundingRect(ctr)[1])
    sorted_ctrs = sorted(contours, key=lambda ctr: cv.boundingRect(ctr)[0] + cv.boundingRect(ctr)[1] * bw.shape[1])

    for cnt in sorted_ctrs:
        rects, bw_region, img_region, r_h = process_region(cnt, bw, img)
        if len(rects) <= 0:
            continue

        temp_list = []
        row_rects = []
        word_list = []
        row_word = []
        single_word = []
        single_word_img_list = []
        row_img_list = []
        processed_img_list = []
        previous_height = rects[0][1] + rects[0][3]

        for x, y, w, h in rects:
            if (y + h) > previous_height + 3 or (y + h) < previous_height - 3:
                row_rects.append(temp_list.copy())
                temp_list = []
            temp_list.append([x, y, w, h])
            previous_height = y + h

        if len(temp_list) != 0:
            row_rects.append(temp_list)

        for row_list in row_rects:
            row_list = sorted(row_list, key=lambda x: x[0])
            previous_width = row_list[0][0]
            for (x, y, w, h) in row_list:
                if x > previous_width + 25:
                    row_word.append(single_word.copy())
                    single_word = []
                single_word.append([x, y, w, h])
                previous_width = x + w
            row_word.append(single_word.copy())
            word_list.append(row_word.copy())
            row_word = []
            single_word = []

        # With the rects you can e.g. crop the letters
        for row_word in word_list:
            for single_word in row_word:
                for (x, y, w, h) in single_word:
                    new_img = bw_region[y:y+h+1, x:x+w+1].copy()
                    check_img = new_img[len(new_img)-1].copy()
                    # cv.imshow('123', check_img)
                    # cv.waitKey(0)
                    # ret, new_img_bw = cv.threshold(new_img,160,255,cv.THRESH_BINARY)
                    new_img_bw_np = np.array(new_img)
                    new_img_bw_np = np.ndarray.flatten(new_img_bw_np)
                    new_img_bw_flt = list(new_img_bw_np)
                    check_img_in = list(np.ndarray.flatten(np.array(check_img)))
                    if 0 in new_img_bw_flt:
                        if not all(i <= 200 for i in check_img_in):
                            target = convert_to_square(new_img, expect_shape)
                            single_word_img_list.append(target)
                            rect = cv.rectangle(img_region, (x, y), (x+w, y+h), color=(255, 0, 255), thickness=1)
                row_img_list.append(single_word_img_list.copy())
                single_word_img_list = []
            processed_img_list.append(row_img_list.copy())
            row_img_list = []

        # predict(processed_img_list, expect_shape)

        titles = []
        images = []

        images.append(rect)

        for row_img in processed_img_list:
            for single_img in row_img:
                for word_img in single_img:
                    images.append(word_img)

        titles.append('Original Image')

        for x in range(len(images)):
            titles.append(str(x))
        # plot

        '''
        for i in range(len(images)):
            plt.subplot(5,10,i+1),plt.imshow(images[i],'gray')
            plt.title(titles[i])
            plt.xticks([]),plt.yticks([])
        plt.show()
        '''

        cv.imshow('123', img_region)
        cv.waitKey(0)

if __name__ == '__main__':
    process_img("https://receiptit-image.s3.ca-central-1.amazonaws.com/receipt-1652.png")
