const appRoot = require('app-root-path');
let receipt = require(appRoot + '/lib/db/models/index').Receipt;
let product = require(appRoot + '/lib/db/models/index').Product;
let moment = require("moment-timezone");
let _ = require("lodash");
const { Op } = require('sequelize');


let receiptService = {
    createReceipt: async function(userID, purchaseDate, totalAmount, merchant, postcode, comment){
        let result = await receipt.create({
            user_id: userID,
            purchase_date: purchaseDate,
            total_amount: totalAmount,
            merchant: merchant,
            postcode: postcode,
            comment, comment
        });

        return result;
    },
    retrieveAllReceipt: async function(userId, startDate, endDate){
        // Construct where condition
        const whereCondition = {user_id : userId};

        if (startDate && endDate) {
            whereCondition.purchase_date = {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }

        // Get all receipts based on user id, start date, end date
        const result = await receipt.findAll({ where: whereCondition });

        // Convert purchase date from UTC to EDT
        const formattedResult = _.forEach(result, (receiptItem) => {
            receiptItem.dataValues.purchase_date = moment(receiptItem.dataValues.purchase_date).tz("EDT").format();
            return receipt;
        });

        return formattedResult;
    },
    retrieveTotalExpense: async function(userID, startDate, endDate){
        // Construct where condition
        const whereCondition = {
            user_id : userID,
            purchase_date: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        };

        // Get all receipts based on user id, start date, end date
        const result = await receipt.findAll({ where: whereCondition });
        let total = 0;
        _.forEach(result, (receiptItem) => {
            total += parseFloat(receiptItem.dataValues.total_amount);
        });

        return total;
    },
    retrieveReceipt: async function(receiptId){
        const result = await receipt.findOne({
            include: [
                {
                    model: product
                }
            ],
            where: {
                receipt_id: receiptId
            }
        })

        // Convert purchase date from UTC to EDT
        if (result) {
            result.dataValues.purchase_date = moment(result.dataValues.purchase_date).tz("EDT").format();
        }

        return result;
    },
    deleteReceiptWithAssociatedProducts: async function(receiptID){
        let result = await receipt.destroy({
            where: {
                receipt_id: receiptID
            }
        });

        return result;
    },
    updateReceipt: async function(receiptID, values){
        let result = await receipt.update(values, { where: {receipt_id: receiptID} });

        return result;
    },
    saveReceiptImageInfo: async function (receiptId, imageName, imageUrl) {
        return await receipt.update(
            { 
                image_name: imageName,
                image_url: imageUrl
            },
            {
                where: {
                    receipt_id: receiptId
                }
            }
        );
    },
    getReceiptImageInfo: async function (receiptId) {
        const result = await receipt.findOne(
            {
                attributes: [
                    'image_name',
                    'image_url'
                ],
                where: {
                    receipt_id: receiptId
                }
            }
        );
        
        return result;
    },
    deleteReceiptImageInfo: async function (receiptId) {
        return await receipt.update(
            {  
                image_name: null,
                image_url: null 
            },
            {
                where: {
                    receipt_id: receiptId
                }
            }
        );
    }
};

module.exports = receiptService;