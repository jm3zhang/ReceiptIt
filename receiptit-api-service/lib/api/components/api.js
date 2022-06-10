const appRoot = require('app-root-path');
let apiRules = require(appRoot + '/lib/api/components/api-rules');
let logger = require(appRoot + '/lib/plugins/Logger');
let authenticationMiddleware = require(appRoot + '/lib/middleware/authentication-middleware');

function _register(app){

    for(let api of apiRules){

        if(api.method === 'post'){
            if(api.requireAuth){
                app.post(api.endpoint, authenticationMiddleware.authenticateRequest, api.function);
            }else{
                app.post(api.endpoint, api.function);
            }
            logger.info(`API: ${api.method} ${api.endpoint} is registered`);
        }

        if(api.method === 'get'){
            if(api.requireAuth){
                app.get(api.endpoint, authenticationMiddleware.authenticateRequest, api.function);
            }else{
                app.get(api.endpoint, api.function);
            }
            logger.info(`API: ${api.method} ${api.endpoint} is registered`);
        }

        if(api.method === 'put'){
            if(api.requireAuth){
                app.put(api.endpoint, authenticationMiddleware.authenticateRequest, api.function);
            }else{
                app.put(api.endpoint, api.function);
            }
            logger.info(`API: ${api.method} ${api.endpoint} is registered`);
        }

        if(api.method === 'delete'){
            if(api.requireAuth){
                app.delete(api.endpoint, authenticationMiddleware.authenticateRequest, api.function);
            }else{
                app.delete(api.endpoint, api.function);
            }
            logger.info(`API: ${api.method} ${api.endpoint} is registered`);
        }
    }
}

module.exports = {
    _register: _register
};