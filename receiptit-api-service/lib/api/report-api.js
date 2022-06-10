const appRoot = require('app-root-path');
const apiHelper = require(appRoot + '/lib/api/components/api-helper');
const InternalError = require(appRoot + '/lib/error/InternalError');
const logger = require(appRoot + '/lib/plugins/Logger');
const receiptService = require(appRoot + "/lib/service/receipt-service");
const userService = require(appRoot + "/lib/service/user-service");
const productService = require(appRoot + "/lib/service/product-service");
const moment = require("moment-timezone");

const reportAPI = {
    getProductReport: async (req, res) => {
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

            logger.debug(`Get all products by user ${userId}, from ${startDate} to ${endDate}.`);
            const result = await productService.retrieveAllProductsByUserId(userId, startDate, endDate);
            const formattedResult = {
                startDate,
                endDate,
                userId,
                products: result
            }

            apiHelper.sendAPISuccess(req, res, formattedResult);
        } catch (error) {
            apiHelper.sendAPIFailure(req, res, error);
        }
    }
};

module.exports = reportAPI;