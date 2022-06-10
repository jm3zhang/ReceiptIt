const appRoot = require('app-root-path');
const apiHelper = require(appRoot + '/lib/api/components/api-helper');
const InternalError = require(appRoot + '/lib/error/InternalError');
const logger = require(appRoot + '/lib/plugins/Logger');
const receiptService = require(appRoot + "/lib/service/receipt-service");
const userService = require(appRoot + "/lib/service/user-service");
const moment = require("moment-timezone");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});
const s3 = new aws.S3();

let receiptAPI = {
    createReceipt: async function (req, res) {
        try {
            apiHelper.preProcess(req,
                {
                    mandatory: ['user_id', 'purchase_date', 'total_amount', 'merchant', 'postcode'],
                    optional: ['comment']
                }, null);

            let userID = req.body.user_id;
            let purchaseDate = req.body.purchase_date;
            let totalAmount = req.body.total_amount;
            let merchant = req.body.merchant;
            let postcode = req.body.postcode;
            let comment = req.body.comment;

            let userInfo = await userService.retrieveUser(userID);
            if (!userInfo) {
                throw new InternalError(`Nonexistent user ID ${userID}`, InternalError.Types.UserError);
            }

            let now = moment().format("YYYY-MM-DD");
            if (moment(purchaseDate).format("YYYY-MM-DD") > now) {
                throw new InternalError(`Invalid purchase time ${purchaseDate}, larger than than current timestamp`, InternalError.Types.UserError);
            }

            if (parseInt(totalAmount) <= 0) {
                throw new InternalError(`Non-positive total amount`, InternalError.Types.UserError);
            }

            logger.debug(`Prepare to create new receipt for user ${userID}, receipt detail: ${JSON.stringify(req.body)}`);

            let result = await receiptService.createReceipt(userID, purchaseDate, totalAmount, merchant, postcode, comment);
            let data = {
                result: 'success',
                message: 'Receipt is created successfully',
                receiptInfo: result
            };
            apiHelper.sendAPISuccess(req, res, data);
        } catch (e) {
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    retrieveAllReceipt: async function (req, res) {
        try {
            apiHelper.preProcess(req, {}, { mandatory: ["userId"] });

            const userId = parseInt(req.query.userId);
            // Validate user id
            const user = await userService.retrieveUser(userId);
            if (!user) {
                throw new InternalError("User does not exist!", InternalError.Types.UserError);
            }

            const startDate = req.query.startDate && moment(req.query.startDate).utc().format();
            const endDate = req.query.endDate && moment(req.query.endDate).utc().format();
            // Validate start date and end date
            if (startDate === "Invalid date") {
                throw new InternalError("Invalid Start Date", InternalError.Types.UserError);
            }
            if (endDate === "Invalid date") {
                throw new InternalError("Invalid End Date", InternalError.Types.UserError);
            }
            if (startDate && endDate && startDate > endDate) {
                throw new InternalError("Invalid input. Start date must be smaller than end date", InternalError.Types.UserError);
            }

            logger.debug(`Get all receipts by user ${userId}, from ${startDate} to ${endDate}.`);
            const result = await receiptService.retrieveAllReceipt(userId, startDate, endDate);

            apiHelper.sendAPISuccess(req, res, { receipts: result });
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }

    },
    retrieveTotalExpense: async function(req, res){
        try{
            apiHelper.preProcess(req, {}, { mandatory: ["userId", "startDate", "endDate"] });

            const userId = parseInt(req.query.userId);
            // Validate user id
            const user = await userService.retrieveUser(userId);
            if (!user) {
                throw new InternalError("User does not exist!", InternalError.Types.UserError);
            }

            const startDate = req.query.startDate && moment(req.query.startDate).utc().format();
            const endDate = req.query.endDate && moment(req.query.endDate).utc().format();
            // Validate start date and end date
            if (startDate === "Invalid date") {
                throw new InternalError("Invalid Start Date", InternalError.Types.UserError);
            }
            if (endDate === "Invalid date") {
                throw new InternalError("Invalid End Date", InternalError.Types.UserError);
            }
            if (startDate && endDate && startDate > endDate) {
                throw new InternalError("Invalid input. Start date must be smaller than end date", InternalError.Types.UserError);
            }

            logger.debug(`Get total expenses by user ${userId}, from ${startDate} to ${endDate}.`);
            const result = await receiptService.retrieveTotalExpense(userId, startDate, endDate);
            let data = {
                startDate: startDate,
                endDate: endDate,
                userId: userId,
                totalExpense: result
            };

            apiHelper.sendAPISuccess(req, res, data);
        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    retrieveReceipt: async function (req, res) {
        try {
            const receiptId = parseInt(req.params.receiptID);
            logger.debug(`Get receipt information by receipt id ${receiptId}.`);
            const result = await receiptService.retrieveReceipt(receiptId);

            apiHelper.sendAPISuccess(req, res, result || {});
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    },
    deleteReceipt: async function (req, res) {
        try {
            apiHelper.preProcess(req, null, null);

            let receiptID = req.params.receiptID;
            let result = await receiptService.deleteReceiptWithAssociatedProducts(receiptID);
            logger.debug(`Prepare to delete receipt with ID ${receiptID}`);

            if (result) {
                let data = {
                    result: 'success',
                    message: 'Receipt and associated products are deleted successfully'
                };
                apiHelper.sendAPISuccess(req, res, data);
            } else {
                throw new InternalError(`Nonexitent receipt with ID ${receiptID} cannot be deleted`, InternalError.Types.UserError);
            }
        } catch (e) {
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    updateReceipt: async function (req, res) {
        try {
            apiHelper.preProcess(req, {
                mandatory: [], optional: ['comment', 'purchase_date', 'total_amount', 'merchant', 'postcode']
            }, null);

            let receiptID = req.params.receiptID;
            logger.debug(`Prepare to update receipt with ID:${receiptID}, request: ${JSON.stringify(req.body)}`);

            let result = await receiptService.updateReceipt(receiptID, req.body);
            if (result == 1) {
                let data = {
                    result: 'success',
                    message: 'Receipt info is updated successfully'
                };
                apiHelper.sendAPISuccess(req, res, data);
            } else {
                throw new InternalError("Failed to update receipt info", InternalError.Types.ServiceError);
            }
        } catch (e) {
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    uploadReceiptImage: async function (req, res) {
        try {
            const receiptId = parseInt(req.params.receiptID);
            // Validate recepitId
            if (isNaN(receiptId)) {
                throw new InternalError("Invalid receipt id. Receipt id should be an integer.", InternalError.Types.UserError);
            }
            const foundReceipt = await receiptService.retrieveReceipt(receiptId);
            if (!foundReceipt) {
                throw new InternalError("Receipt does not exist!", InternalError.Types.UserError);
            }

            // Set up S3 storage
            const storage = multerS3({
                s3: s3,
                bucket: process.env.AWS_S3_BUCKET,
                acl: 'public-read',
                key: (req, file, callback) => {
                    let fileType = 'png';

                    if (file.mimetype === 'image/gif') {
                        fileType = 'gif';
                    }
                    if (file.mimetype === 'image/png') {
                        fileType = 'png';
                    }
                    if (file.mimetype === 'image/jpeg') {
                        fileType = 'jpeg';
                    }
                    if (file.mimetype === 'image/jpg') {
                        fileType = 'jpg';
                    }

                    const imageName = `receipt-${receiptId}.${fileType}`;
                    callback(null, imageName);
                }
            });

            // Upload image to storage
            logger.debug(`Upload image for receipt ${receiptId}.`);
            const upload = multer({ storage: storage }).single("image");

            upload(req, res, async (err) => {
                try {
                    if (err) {
                        throw new InternalError(`Upload image for receipt ${receiptId} failed.`, InternalError.Types.ServiceError);
                    }

                    if (!req.file) {
                        throw new InternalError(`Please send a receipt image.`, InternalError.Types.UserError);
                    }

                    // Save image info to database
                    const result = await receiptService.saveReceiptImageInfo(receiptId, req.file.key, req.file.location);
                    if (!result[0]) {
                        throw new InternalError(`Save image path for receipt ${receiptId} failed.`, InternalError.Types.ServiceError);
                    }

                    const data = {
                        result: 'success',
                        message: 'Receipt image is uploaded successfully',
                        imageInfo: {
                            name: req.file.key,
                            url: req.file.location
                        }
                    };
    
                    apiHelper.sendAPISuccess(req, res, data);
                } catch (error) {
                    apiHelper.sendAPIFailure(req, res, error);
                }
            });
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    },
    getReceiptImage: async function(req, res) {
        try {
            const receiptId = parseInt(req.params.receiptID);
            // Validate recepitId
            if (isNaN(receiptId)) {
                throw new InternalError("Invalid receipt id. Receipt id should be an integer.", InternalError.Types.UserError);
            }
            const foundReceipt = await receiptService.retrieveReceipt(receiptId);
            if (!foundReceipt) {
                throw new InternalError("Receipt does not exist!", InternalError.Types.UserError);
            }

            const {image_name, image_url} = await receiptService.getReceiptImageInfo(receiptId);

            const data = {
                receipt_id: receiptId,
                image_name: image_name,
                image_url: image_url
            }

            apiHelper.sendAPISuccess(req, res, data);
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    },
    deleteReceiptImage: async function(req, res) {
        try {
            const receiptId = parseInt(req.params.receiptID);
            // Validate recepitId
            if (isNaN(receiptId)) {
                throw new InternalError("Invalid receipt id. Receipt id should be an integer.", InternalError.Types.UserError);
            }
            const foundReceipt = await receiptService.retrieveReceipt(receiptId);
            if (!foundReceipt) {
                throw new InternalError("Receipt does not exist!", InternalError.Types.UserError);
            }

            const { image_name } = await receiptService.getReceiptImageInfo(receiptId);

            // Delete image from S3
            await s3.deleteObject({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: image_name
            }).promise();

            // Delete image infomation from db
            const result = await receiptService.deleteReceiptImageInfo(receiptId);
            if (result) {
                let data = {
                    result: 'success',
                    message: 'Receipt image is deleted successfully'
                };
                apiHelper.sendAPISuccess(req, res, data);
            } else {
                throw new InternalError(`Nonexitent receipt image with ID ${receiptID} cannot be deleted`, InternalError.Types.UserError);
            }
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    }
}

module.exports = receiptAPI;