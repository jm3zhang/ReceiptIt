const appRoot = require('app-root-path');
let InternalError = require(appRoot + '/lib/error/InternalError');
let logger = require(appRoot + '/lib/plugins/Logger');

let apiHelper = {

    /**
     * Helper function to valid API request parameters
     * @param {Object} req - request object
     * @param {Object} body - specifications of body parameters
     * @param {Object} query - specifications of query parameters
     */
    preProcess: function(req, body, query){

        if(body && body.mandatory && !req.hasOwnProperty("body")){
            throw new InternalError('Missing request body', InternalError.Types.UserError);
        }

        if(query && query.mandatory && !req.hasOwnProperty("query")){
            throw new InternalError('Missing request query', InternalError.Types.UserError);
        }

        if(body && body.mandatory){
            for(let key of body.mandatory){
                if(!req.body.hasOwnProperty(key)){
                    throw new InternalError(`Missing mandatory field in request body: ${key}`, InternalError.Types.UserError);
                }
            }
        }

        if(body && body.optional){
            for(let key in req.body){
                if(!body.mandatory.includes(key) && !body.optional.includes(key)){
                    throw new InternalError(`Unrecognized field in request body: ${key}`, InternalError.Types.UserError);
                }
            }
        }

        if(query && query.mandatory){
            for(let key of query.mandatory){
                if(!req.query.hasOwnProperty(key)){
                    throw new InternalError(`Missing mandatory field in request query: ${key}`, InternalError.Types.UserError);
                }
            }
        }

        if(query && query.optional){
            for(let key in req.query){
                if(!query.mandatory.includes(key) && !query.optional.includes(key)){
                    throw new InternalError(`Unrecognized field in request query: ${key}`, InternalError.Types.UserError);
                }
            }
        }
    },

    /**
     * Helper function to send out API response on success
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @param {Object} data - Resulting data returned by APIs
     */
    sendAPISuccess: function(req, res, data){
        logger.info(`API request succeeded - URL: ${req.originalUrl}`);
        res.status(200).json(data);
    },

    /**
     * Helper function to send out API response on failure
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @param {Object} e - Error returned by APIs
     */
    sendAPIFailure: function(req, res, e){

        logger.error(`API request failed - ${e.message}`);
        logger.error(`details: ${e}`);

        let msg, httpStatusCode;
        if(e.type === InternalError.Types.UserError){
            msg = e.message;
            httpStatusCode = 400;
        }else{
            msg = 'Unexpected internal InternalError occurred';
            httpStatusCode = 500;
        }

        res.status(httpStatusCode).json({
            result: 'failure',
            message: `${msg}`
        });
    }
};

module.exports = apiHelper;