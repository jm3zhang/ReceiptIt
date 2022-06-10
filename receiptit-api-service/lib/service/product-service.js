const appRoot = require('app-root-path');
let product = require(appRoot + '/lib/db/models/index').Product;
let receipt = require(appRoot + '/lib/db/models/index').Receipt;
const { Op, col} = require('sequelize');

let productService = {
    retrieveProduct: async function(productId){
        return await product.findByPk(productId);
    },
    retrieveAllProducts: async function(receiptId){
        return await product.findAll({
            where: {
                receipt_id: receiptId
            }
        });
    },
    retrieveAllProductsByUserId: async function(userId, startDate, endDate) {
        // Construct where condition
        const whereCondition = {user_id : userId};
        if (startDate && endDate) {
            whereCondition.purchase_date = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }

        const result = product.findAll({
            raw: true,
            attributes: {
                include: [col('purchase_date'), 'receipt.purchase_date']
            },
            include: [{
                attributes: [],
                model: receipt,
                where: whereCondition
            }],
            order: [
                ['price', 'DESC'],
            ]
        });

        return result;
    },
    createProduct: async function(receiptID, productName, productPrice, productQuantity, productCurrencyCode, productDescription){
        let result = await product.create({
            receipt_id: receiptID,
            name: productName,
            price: productPrice,
            quantity: productQuantity,
            currency_code: productCurrencyCode,
            description: productDescription
        });

        return result;
    },
    createProductBatch: async function(payload){
        let result = await product.bulkCreate(payload, {returning: true});

        return result;
    },
    updateProduct: async function(receiptID, productID, values){
        let result = await product.update(values, { where: {receipt_id: receiptID, product_id: productID} });

        return result;
    },
    deleteProduct: async function(productId) {
        return await product.destroy({
            where: {
                product_id: productId
            }
        });
    }
};

module.exports = productService;