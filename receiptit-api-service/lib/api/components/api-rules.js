const appRoot = require('app-root-path');
let userAPI = require(appRoot + '/lib/api/user-api');
let receiptAPI = require(appRoot + '/lib/api/receipt-api');
let productAPI = require(appRoot + '/lib/api/product-api');
let reportAPI = require(appRoot + '/lib/api/report-api');
let authAPI = require(appRoot + '/lib/api/auth-api');

module.exports = [
    /** User API **/
    {
        method: 'post',
        endpoint: '/user',
        description: 'create a new user',
        function: userAPI.createUser,
        requireAuth: false
    },
    {
        method: 'get',
        endpoint: '/user/:userID',
        description: 'Retrieve information of a user given their ID.',
        function: userAPI.retrieveUser,
        requireAuth: true
    },
    {
        method: 'put',
        endpoint: '/user/:userID',
        description: 'Update user information given their id.',
        function: userAPI.updateUser,
        requireAuth: true
    },
    /** Receipt API **/
    {
        method: 'post',
        endpoint: '/receipt',
        description: 'create a new receipt',
        function: receiptAPI.createReceipt,
        requireAuth: true
    },
    {
        method: 'get',
        endpoint: '/receipt',
        description: 'Retrieve all receipts of a particular user.',
        function: receiptAPI.retrieveAllReceipt,
        requireAuth: true
    },
    {
        method: 'get',
        endpoint: '/receipt/expense',
        description: 'Retrieve all receipts of a particular user.',
        function: receiptAPI.retrieveTotalExpense,
        requireAuth: true
    },
    {
        method: 'delete',
        endpoint: '/receipt/:receiptID',
        description: 'Delete a receipt given receipt id.',
        function: receiptAPI.deleteReceipt,
        requireAuth: true
    },
    {
        method: 'get',
        endpoint: '/receipt/:receiptID',
        description: 'Retrieve details of a particular receipt.',
        function: receiptAPI.retrieveReceipt,
        requireAuth: true
    },
    {
        method: 'put',
        endpoint: '/receipt/:receiptID',
        description: 'Update product information within a particular receipt.',
        function: receiptAPI.updateReceipt,
        requireAuth: true
    },
    {
        method: 'post',
        endpoint: '/receipt/:receiptID/image',
        description: 'Upload a receipt image',
        function: receiptAPI.uploadReceiptImage
    },
    {
        method: 'get',
        endpoint: '/receipt/:receiptID/image',
        description: 'Get a receipt image',
        function: receiptAPI.getReceiptImage
    },
    {
        method: 'delete',
        endpoint: '/receipt/:receiptID/image',
        description: 'Delete a receipt image',
        function: receiptAPI.deleteReceiptImage
    },
    /** Product API **/
    {
        method: 'get',
        endpoint: '/product',
        description: 'Retrieve all products of a particular receipt.',
        function: productAPI.retrieveAllProducts,
        requireAuth: true
    },
    {
        method: 'get',
        endpoint: '/product/:productID',
        description: 'Retrieve one product given its product id',
        function: productAPI.retrieveProduct,
        requireAuth: true
    },
    {
        method: 'post',
        endpoint: '/product',
        description: 'Create a new product given information',
        function: productAPI.createProduct,
        requireAuth: true
    },
    {
        method: 'post',
        endpoint: '/product/batch',
        description: 'Create products in batch',
        function: productAPI.createProductBatch,
        requireAuth: true
    },
    {
        method: 'put',
        endpoint: '/product',
        description: 'Update an existing product given its product it and receipt id',
        function: productAPI.updateProduct,
        requireAuth: true
    },
    {
        method: 'delete',
        endpoint: '/product/:productID',
        description: 'Delete a product given its id',
        function: productAPI.deleteProduct,
        requireAuth: true
    },
    /** Auth API **/
    {
        method: 'post',
        endpoint: '/auth/login',
        description: 'User logging in',
        function: authAPI.login,
        requireAuth: false
    },
    {
        method: 'get',
        endpoint: '/auth/logout',
        description: 'User logging out',
        function: authAPI.logout,
        requireAuth: false
    },
    /** Report API **/
    {
        method: 'get',
        endpoint: '/report/product',
        description: 'Generate report for all products given its user id within an arbitrary period',
        function: reportAPI.getProductReport,
        requireAuth: true
    },
];