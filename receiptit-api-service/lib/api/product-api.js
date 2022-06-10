const appRoot = require('app-root-path');
let apiHelper = require(appRoot + '/lib/api/components/api-helper');
let InternalError = require(appRoot + '/lib/error/InternalError');
let logger = require(appRoot + '/lib/plugins/Logger');
let receiptService = require(appRoot + "/lib/service/receipt-service");
let userService = require(appRoot + "/lib/service/user-service");
let productService = require(appRoot + "/lib/service/product-service");

let productAPI = {
    retrieveProduct: async function(req, res){
        try {
            const productId = parseInt(req.params.productID);
            if (isNaN(productId)) {
                throw new InternalError("Invalid product id. Product id should be an integer.", InternalError.Types.UserError);
            }

            logger.debug(`Get product by product id: ${productId}`);
            const result = await productService.retrieveProduct(productId);

            apiHelper.sendAPISuccess(req, res, result || {});
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    },
    retrieveAllProducts: async function(req, res){
        try {
            apiHelper.preProcess(req, {}, {mandatory: ["receiptId"]});

            const receiptId = parseInt(req.query.receiptId);
            // Validate recepitId
            if (isNaN(receiptId)) {
                throw new InternalError("Invalid receipt id. Receipt id should be an integer.", InternalError.Types.UserError);
            }
            const foundReceipt = await receiptService.retrieveReceipt(receiptId);
            if (!foundReceipt) {
                throw new InternalError("Receipt does not exist!", InternalError.Types.UserError);
            }

            logger.debug(`Get all products by receipt id ${receiptId}`);
            const result = await productService.retrieveAllProducts(receiptId);

            apiHelper.sendAPISuccess(req, res, {products: result});
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    },
    createProductBatch: async function(req, res){
        try{
            for(let idx = 0; idx < req.body.productList.length; idx++){
                let product = req.body.productList[idx];
                if(!product.receipt_id){
                    throw new InternalError("Missing receipt_id", InternalError.Types.UserError);
                }
                if(!product.name){
                    throw new InternalError("Missing name", InternalError.Types.UserError);
                }
                if(!product.price){
                    throw new InternalError("Missing price", InternalError.Types.UserError);
                }
                let receiptID = product.receipt_id;
                let productName = product.name;
                let productPrice = parseFloat(product.price);

                //throw error if receiptID is nonexistent
                let receipt = await receiptService.retrieveReceipt(receiptID);
                if(!receipt){
                    throw new InternalError("Cannot attach new product to an nonexistent receipt", InternalError.Types.UserError);
                }
                // throw error if product name is empty or price is non-positive
                // if((!productName) || productPrice < 0){
                //     throw new InternalError("Invalid product data", InternalError.Types.UserError);
                // }
            }

            logger.debug(`Prepare to create product batch , detail: ${JSON.stringify(req.body.productList)}`);
            let result = await productService.createProductBatch(req.body.productList);

            let data = {
                result: 'success',
                message: 'Products are created successfully',
                productInfo: result
            };
            apiHelper.sendAPISuccess(req, res, data);

        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    createProduct: async function(req, res){
        try{
            apiHelper.preProcess(req,
                { mandatory: ['receipt_id', 'name', 'price', 'quantity'], optional: ['description', 'currency_code'] },null);

            let receiptID = req.body.receipt_id;
            let productName = req.body.name;
            let productPrice = parseFloat(req.body.price);
            let productQuantity = req.body.quantity || 1;
            let productCurrencyCode = req.body.currency_code || 'CAD';
            let productDescription = req.body.description || '';

            //throw error if receiptID is nonexistent
            let receipt = await receiptService.retrieveReceipt(receiptID);
            if(!receipt){
                throw new InternalError("Cannot attach new product to an nonexistent receipt", InternalError.Types.UserError);
            }
            // throw error if product name is empty or price is non-positive
            if((!productName) || productPrice < 0){
                throw new InternalError("Invalid product data", InternalError.Types.UserError);
            }

            logger.debug(`Prepare to create new product for receipt ${receiptID}, product detail: ${JSON.stringify(req.body)}`);
            let result = await productService.createProduct(receiptID, productName,
                productPrice, productQuantity, productCurrencyCode, productDescription);

            let data = {
                result: 'success',
                message: 'Product is created successfully',
                productInfo: result
            };
            apiHelper.sendAPISuccess(req, res, data);
        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    updateProduct: async function(req, res){
        try{
            apiHelper.preProcess(req,
                { mandatory: ['receipt_id', 'product_id'], optional: ['name', 'price', 'quantity','description', 'currency_code'] },null);
            let receiptID = req.body.receipt_id;
            let productID = req.body.product_id;

            //throw error if receiptID is nonexistent
            let product = await productService.retrieveProduct(productID);
            if(!product){
                throw new InternalError(`Nonexistent product with id ${productID}`, InternalError.Types.UserError);
            }
            if(product.receipt_id != receiptID){
                throw new InternalError(`Mismatching receipt with product, receipt id ${receiptID} product id ${productID}`, InternalError.Types.UserError);
            }

            logger.debug(`Prepare to update product with productID ${productID} receiptID ${receiptID},
             new detail: ${JSON.stringify(req.body)}`);
            let result = await productService.updateProduct(receiptID, productID, req.body);
            if(result){
                let data = {
                    result: 'success',
                    message: 'Product is updated successfully'
                };
                apiHelper.sendAPISuccess(req, res, data);
            }else{
                throw new InternalError("Failed to update product", InternalError.Types.ServiceError);
            }
        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    deleteProduct: async function(req, res){
        try {
            const productId = parseInt(req.params.productID);
            if (isNaN(productId)) {
                throw new InternalError("Invalid product id. Product id should be an integer.", InternalError.Types.UserError);
            }

            logger.debug(`Delete product by product id: ${productId}`);
            const result = await productService.deleteProduct(productId);
            
            if(result){
                const data = {
                    result: 'success',
                    message: 'Product is deleted successfully'
                };

                apiHelper.sendAPISuccess(req, res, data);
            }else{
                throw new InternalError(`Nonexistent product with ID ${productId} cannot be deleted`, InternalError.Types.UserError);
            }
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    }
}

module.exports = productAPI;
