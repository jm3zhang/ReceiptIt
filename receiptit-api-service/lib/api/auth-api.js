const appRoot = require('app-root-path');
let apiHelper = require(appRoot + '/lib/api/components/api-helper');
let InternalError = require(appRoot + '/lib/error/InternalError');
let logger = require(appRoot + '/lib/plugins/Logger');
let jwt = require('jsonwebtoken');
let authService = require(appRoot + "/lib/service/auth-service");

let authAPI = {
    login: async function(req, res){
        try{
            apiHelper.preProcess(req, {mandatory: ['email', 'password']}, null);
            let email = req.body.email;
            let password = req.body.password;
            let result = await authService.check(email, password);
            if(result.result){
                // create JWT authentication token upon successful login
                let authToken = await authService.generateJwtToken(email);

                let data = {
                    result: 'success',
                    message: 'User is logged in successfully',
                    auth: true,
                    authToken: authToken,
                    userInfo: result.user
                };
                apiHelper.sendAPISuccess(req, res, data);
            }else{
                throw new InternalError('Invalid user email or password', InternalError.Types.UserError);
            }

        }catch(e){
            console.log(e);
            apiHelper.sendAPIFailure(req, res, e);
        }
    },
    logout: async function(req, res){
        try{
            // cant really deactivate a token, its all client's responsibility to delete the token on their end
            let data = {
                result: 'success',
                message: 'User is logged out successfully',
                auth: false,
                authToken: null
            };
            apiHelper.sendAPISuccess(req, res, data);
        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }
    }
};

module.exports = authAPI;