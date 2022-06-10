# ReceiptIt API Service

API Service

## Build and Run
#### 1. Clone Repository
    git clone https://github.com/ReceiptIt/receiptit-api-service.git
#### 2. Go to service folder
    cd receiptit-api-service
#### 3. Install npm package
    npm install
#### 4. Database migrate
    npm run db:migration
#### 5. Database seed
    npm run db:seeder
#### 6. Run server
    npm start
    
## API Endpoints    
#### Authentication API
- POST https://receipit-rest-api.herokuapp.com/auth/login
```$xslt
Log in using email and password

POST http://receipit-rest-api.herokuapp.com/auth/login

Payload:
{"password":"213131","email":"testhjbawdjkda@test1.com"}

Response:
{
    "result": "success",
    "message": "User is logged in successfully",
    "auth": true,
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RoamJhd2Rqa2RhQHRlc3QxLmNvbSIsImlhdCI6MTU2MzE0NjQ0MCwiZXhwIjoxNTYzMTQ2NTI2fQ.L1mFGGkOUTEupbQSqt_hrGoeB7UPLo1yEo_isN5T76I"
}
```

- GET https://receipit-rest-api.herokuapp.com/auth/logout
```$xslt
Log out

GET http://receipit-rest-api.herokuapp.com/auth/logout

Response:
{
    "result": "success",
    "message": "User is logged out successfully",
    "auth": false,
    "authToken": null
}
```


#### User API

- GET https://receipit-rest-api.herokuapp.com/user/:userID
```$xslt
Retrieve user information given userID: 

GET https://receipit-rest-api.herokuapp.com/user/1

Response:
{
    "result": "success",
    "message": "User info is retrieved successfully",
    "userInfo": {
        "user_id": 1,
        "password": "9ff7b641722c30acdc058f2499d97dd8",
        "email": "test1@test1.com",
        "first_name": "David",
        "last_name": "Zhang",
        "createdAt": "2019-07-14T17:57:04.000Z",
        "updatedAt": "2019-07-14T17:57:04.000Z"
    }
}
```

- POST https://receipit-rest-api.herokuapp.com/user

Mandatory request body field: `password`, `email`, `first_name`, `last_name`
```$xslt
Create user

POST https://receipit-rest-api.herokuapp.com/user

Payload:
{
        "password": "abcdefg",
        "email": "test8@test1.com",
        "first_name": "David",
        "last_name": "Zhang"
}

Response:
{
    "result": "success",
    "message": "User is created successfully",
    "userInfo": {
        "user_id": 12,
        "first_name": "David",
        "last_name": "Zhang",
        "password": "$2b$10$X8PpZz1hnwjf.kJlg5q5ZOR4KlFBYd95d4axDRGRqNZyjjFFHmn9m",
        "email": "test8@test1.com",
        "updatedAt": "2019-07-14T20:09:41.730Z",
        "createdAt": "2019-07-14T20:09:41.730Z"
    },
        "auth": true,
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzIsImlhdCI6MTU2MzE0MzU2NywiZXhwIjoxNTYzMjI5OTY3fQ.XiMYpfuxokUNdluUhF49Liu5pTDaOKk_GgsONnfwDOQ"
}
```

- PUT https://receipit-rest-api.herokuapp.com/user/:userID

Optional request body field: `password`, `email`, `first_name`, `last_name`
```$xslt
Update user

PUT https://receipit-rest-api.herokuapp.com/user/12

Payload:
{
     "last_name": "test"
}

Response:
{
    "result": "success",
    "message": "User info is updated successfully"
}
```

#### Receipt API

- POST https://receipit-rest-api.herokuapp.com/receipt

Mandatory request body field: `user_id`, `purchase_date`, `total_amount`, `merchant`,`postcode`

Optional request body field: `comment`
```
Create a new receipt

POST https://receipit-rest-api.herokuapp.com/receipt

Payload:
{
    "user_id": 2,
    "purchase_date": "2019-07-14T17:58:21+00:00",
    "total_amount": "88.66",
    "merchant": "Walmart",
    "postcode": "N2L 5L4",
    "comment": "yes"
}

Response:
{
    "result": "success",
    "message": "Receipt is created successfully",
    "receiptInfo": {
        "receipt_id": 12,
        "user_id": 2,
        "purchase_date": "2019-07-14T17:58:21.000Z",
        "total_amount": "88.66",
        "merchant": "Walmart",
        "postcode": "N2L 5L4",
        "updatedAt": "2019-07-14T20:17:26.645Z",
        "createdAt": "2019-07-14T20:17:26.645Z"
    }
}
```

- GET https://receipit-rest-api.herokuapp.com/receipt?userId=:userID&startDate=:startDate&endDate=:endDate
```$xslt
Get all receipts belonging to one user

GET https://receipit-rest-api.herokuapp.com/receipt?userId=2

Response:
{
    "receipts": [
        {
            "receipt_id": 2,
            "user_id": 2,
            "purchase_date": "2019-07-14T17:58:21+00:00",
            "total_amount": "66.66",
            "merchant": "Walmart",
            "postcode": "N2J 2J9",
            "comment": "test2",
            "createdAt": "2019-07-14T17:57:04.000Z",
            "updatedAt": "2019-07-14T17:57:04.000Z"
        },
        {
            "receipt_id": 12,
            "user_id": 2,
            "purchase_date": "2019-07-14T17:58:21+00:00",
            "total_amount": "88.66",
            "merchant": "Walmart",
            "postcode": "N2L 5L4",
            "comment": null,
            "createdAt": "2019-07-14T20:17:26.000Z",
            "updatedAt": "2019-07-14T20:17:26.000Z"
        }
    ]
}
```

- GET https://receipit-rest-api.herokuapp.com/receipt/expense?userId=1&startDate=:startDate&endDate:endDate
```$xslt
Retrieve total expense during a given period. 
startDate and endDate supports the following format:
YYYY, YYYY-MM, YYYY-MM-DD

GET https://receipit-rest-api.herokuapp.com/receipt/expense?userId=1&startDate=2019-06&endDate=2019-08

Response:

{
    "startDate": "2019-06-01T04:00:00Z",
    "endDate": "2019-08-01T04:00:00Z",
    "userId": 1,
    "totalExpense": 8965.82
}
```

- DELETE https://receipit-rest-api.herokuapp.com/receipt/:receiptID
```$xslt
Delete a receipt and all products under it

DELETE https://receipit-rest-api.herokuapp.com/receipt/12

Response:
{
    "result": "success",
    "message": "Receipt and associated products are deleted successfully"
}
```

- GET https://receipit-rest-api.herokuapp.com/receipt/:receiptID
```$xslt
Get a particular receipt and its products given ID

GET https://receipit-rest-api.herokuapp.com/receipt/2

Response:
{
    "receipt_id": 2,
    "user_id": 2,
    "purchase_date": "2019-07-14T17:58:21+00:00",
    "total_amount": "66.66",
    "merchant": "Walmart",
    "postcode": "N2J 2J9",
    "comment": "test2",
    "createdAt": "2019-07-14T17:57:04.000Z",
    "updatedAt": "2019-07-14T17:57:04.000Z",
    "products": [
        {
            "product_id": 2,
            "receipt_id": 2,
            "name": "Peach",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "10.20",
            "createdAt": "2019-07-14T17:57:04.000Z",
            "updatedAt": "2019-07-14T17:57:04.000Z"
        }
    ]
}
```

- PUT https://receipit-rest-api.herokuapp.com/receipt/:receiptID

Optional request body field: `purchase_date`, `total_amount`, `merchant`,`postcode`, `comment`

```$xslt
Update an existing receipt

PUT https://receipit-rest-api.herokuapp.com/receipt/2

Payload:
{
	"total_amount": "123"
}

Response:
{
    "result": "success",
    "message": "Receipt info is updated successfully"
}
```

#### Receipt Image API

- POST https://receipit-rest-api.herokuapp.com/receipt/:receiptID/image

Mandatory request body field: `image`
```
Upload a new receipt image

POST https://receipit-rest-api.herokuapp.com/receipt/2/image

Payload:
{
    "image": "A binary file, base64 data, or a URL for an image. (up to 10MB)"
}

Response:
{
    "result": "success",
    "message": "Receipt image is uploaded successfully",
    "imageInfo": {
        "name": "receipt-2.jpeg",
        "url": "https://receiptit-image.s3.ca-central-1.amazonaws.com/receipt-2.jpeg"
    }
}
```

- GET https://receipit-rest-api.herokuapp.com/receipt/:receiptID/image
```$xslt
Get the receipt image url given the receipt ID

GET https://receipit-rest-api.herokuapp.com/receipt/2/image

Response:
{
    "receipt_id": 2,
    "image_name": "receipt-2.jpeg",
    "image_url": "https://receiptit-image.s3.ca-central-1.amazonaws.com/receipt-2.jpeg"
}
```

- Delete https://receipit-rest-api.herokuapp.com/receipt/:receiptID/image
```$xslt
Delete a receipt image by receipt ID

DELETE https://receipit-rest-api.herokuapp.com/receipt/2/image

Response:
{
    "result": "success",
    "message": "Receipt image is deleted successfully"
}
```

#### Product API
- GET https://receipit-rest-api.herokuapp.com/product/:productID

```$xslt
Get an existing product by ID

GET https://receipit-rest-api.herokuapp.com/product/2

Response:
{
    "product_id": 2,
    "receipt_id": 2,
    "name": "Peach",
    "description": "Test_Description",
    "quantity": 5,
    "currency_code": "USD",
    "price": "10.20",
    "createdAt": "2019-07-14T17:57:04.000Z",
    "updatedAt": "2019-07-14T17:57:04.000Z"
}
```
- GET https://receipit-rest-api.herokuapp.com/product?receiptId=:receiptID

```$xslt
Get all products within one receipt

GET https://receipit-rest-api.herokuapp.com/product?receiptId=1

Response:
{
    "products": [
        {
            "product_id": 1,
            "receipt_id": 1,
            "name": "Apple",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "10.03",
            "createdAt": "2019-07-14T17:57:04.000Z",
            "updatedAt": "2019-07-14T17:57:04.000Z"
        }
    ]
}
```

- POST https://receipit-rest-api.herokuapp.com/product


Mandatory request body field: `receipt_id`, `name`, `quantity`, `price`

Optional request body field: `description`, `currency_code`

```$xslt
Create a new product.

POST https://receipit-rest-api.herokuapp.com/product

Payload:
{
            "receipt_id": 2,
            "name": "test fake product",
            "description": "Test_Description",
            "quantity": 1,
            "currency_code": "AUD",
            "price": "18"
}

Response:
{
    "result": "success",
    "message": "Product is created successfully",
    "productInfo": {
        "product_id": 12,
        "receipt_id": 2,
        "name": "test fake product",
        "price": 18,
        "quantity": 1,
        "currency_code": "AUD",
        "description": "Test_Description",
        "updatedAt": "2019-07-14T20:36:49.648Z",
        "createdAt": "2019-07-14T20:36:49.648Z"
    }
}
```

- POST https://receipit-rest-api.herokuapp.com/product/batch

```$xslt
POST http://localhost:3050/product/batch

Payload:
{
	"productList": [
		{
            "receipt_id": 2,
            "name": "test1",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "10.20"
        },
        {
            "receipt_id": 2,
            "name": "test2",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "100.20"
        },
        {
            "receipt_id": 2,
            "name": "test3",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "100.20"
        }
	]
}

Response:
{
    "result": "success",
    "message": "Products are created successfully",
    "productInfo": [
        {
            "product_id": 1042,
            "receipt_id": 2,
            "name": "test1",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "10.20",
            "createdAt": "2019-07-24T00:51:38.397Z",
            "updatedAt": "2019-07-24T00:51:38.397Z"
        },
        {
            "product_id": 1043,
            "receipt_id": 2,
            "name": "test2",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "100.20",
            "createdAt": "2019-07-24T00:51:38.397Z",
            "updatedAt": "2019-07-24T00:51:38.397Z"
        },
        {
            "product_id": 1044,
            "receipt_id": 2,
            "name": "test3",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "100.20",
            "createdAt": "2019-07-24T00:51:38.397Z",
            "updatedAt": "2019-07-24T00:51:38.397Z"
        }
    ]
}

```

- PUT https://receipit-rest-api.herokuapp.com/product

Mandatory request body field: `receipt_id`, `product_id`

Optional request body field: `description`, `currency_code`, `name`, `quantity`, `price`

```$xslt
Update an existing product

PUT https://receipit-rest-api.herokuapp.com/product

Payload: 
{
            "receipt_id": 2,
            "product_id": 12,
            "name": "new test fake product"
}

Response:
{
    "result": "success",
    "message": "Product is updated successfully"
}
```

- DELETE https://receipit-rest-api.herokuapp.com/product/:productID

```$xslt
Delete an existing product

DELETE https://receipit-rest-api.herokuapp.com/product/2

Response:
{
    "result": "success",
    "message": "Product is deleted successfully"
}
```
#### Report API
- GET https://receipit-rest-api.herokuapp.com/report/product?userId=:userId&startDate=:startDate&endDate:endDate

```$xslt
Get a product report during a given period. 
startDate and endDate supports the following format:
YYYY, YYYY-MM, YYYY-MM-DD

GET https://receipit-rest-api.herokuapp.com/report/product?userId=1&startDate=2019-07-13&endDate=2019-07-13

Response:
{
    "startDate": "2019-07-16T00:00:00Z",
    "endDate": "2019-07-19T00:00:00Z",
    "userId": 1,
    "products": [
        {
            "product_id": 1,
            "receipt_id": 1,
            "name": "Apple",
            "description": "Test_Description",
            "quantity": 5,
            "currency_code": "USD",
            "price": "10.03",
            "createdAt": "2019-07-17T21:16:24.000Z",
            "updatedAt": "2019-07-17T21:16:24.000Z",
            "purchase_date": "2019-07-17T21:17:00.000Z"
        }
    ]
}
```