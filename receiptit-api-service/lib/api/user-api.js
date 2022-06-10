const appRoot = require('app-root-path');
let apiHelper = require(appRoot + '/lib/api/components/api-helper');
let InternalError = require(appRoot + '/lib/error/InternalError');
let logger = require(appRoot + '/lib/plugins/Logger');
let userService = require(appRoot + "/lib/service/user-service");
let authService = require(appRoot + "/lib/service/auth-service");
let bcrypt = require('bcrypt');


let userAPI = {

    createUser: async function(req, res){
        try{
            apiHelper.preProcess(req, {mandatory: ['email', 'first_name', 'last_name', 'password']});

            let email = req.body.email;
            let firstName = req.body.first_name;
            let lastName = req.body.last_name;
            let password = req.body.password;
            let hashedPassword = await bcrypt.hash(password, 10);

            if(!email.includes("@")){
                throw new InternalError("Invalid email format", InternalError.Types.UserError)
            }

            logger.debug(`Prepare to create a new user - email:${email}, firstName:${firstName}, lastName: ${lastName}`);

            let result = await userService.createUser(firstName, lastName, email, hashedPassword);

            // create JWT authentication token upon successful user registration
            let authToken = await authService.generateJwtToken(result.email);

            let data = {
                result: 'success',
                message: 'User is created successfully',
                userInfo: result,
                auth: true,
                authToken: authToken
            };
            apiHelper.sendAPISuccess(req, res, data);
        }catch(e){
            if(e.name == "SequelizeUniqueConstraintError"){
                let errorMessage = e.errors[0].message;
                let error = new InternalError(errorMessage, InternalError.Types.UserError);
                apiHelper.sendAPIFailure(req, res, error);
            }else {
                apiHelper.sendAPIFailure(req, res, e);
            }
        }
    },
    retrieveUser: async function(req, res){
        try{
            apiHelper.preProcess(req, null, null);

            let userID = req.params.userID;
            logger.debug(`Prepare to find user - userID:${userID}`);

            let result = await userService.retrieveUser(userID);
            if(result){
                let data = {
                    result: 'success',
                    message: 'User info is retrieved successfully',
                    userInfo: result
                };
                apiHelper.sendAPISuccess(req, res, data);
            }else{
                throw new InternalError(`User with id ${userID} does not exists`, InternalError.Types.UserError);
            }
        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    updateUser: async function(req, res){
        try{
            apiHelper.preProcess(req, {
                mandatory:[],
                optional: ['email', 'first_name', 'last_name', 'password']}, null);

            let userID = req.params.userID;
            logger.debug(`Prepare to update user - userID:${userID}, request: ${JSON.stringify(req.body)}`);

            let result = await userService.updateUser(userID, req.body);
            if(result == 1){
                let data = {
                    result: 'success',
                    message: 'User info is updated successfully'
                };
                apiHelper.sendAPISuccess(req, res, data);
            }else{
                throw new InternalError("Failed to update user info", InternalError.Types.ServiceError);
            }

        }catch(e){
            if(e.name == "SequelizeUniqueConstraintError"){
                let errorMessage = e.errors[0].message;
                let error = new InternalError(errorMessage, InternalError.Types.UserError);
                apiHelper.sendAPIFailure(req, res, error);
            }else {
                apiHelper.sendAPIFailure(req, res, e);
            }
        }
    },

};

module.exports = userAPI;
