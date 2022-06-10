const appRoot = require('app-root-path');
let user = require(appRoot + '/lib/db/models/index').User;
let InternalError = require(appRoot + '/lib/error/InternalError');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

let authService = {
    check: async function(emailInput, passwordInput){
        let u = await user.findOne({ where: {email: emailInput} });
        if(!u){
            throw new InternalError(`User with email ${emailInput} is not found`, InternalError.Types.UserError);
        }
        let result = await bcrypt.compare(passwordInput, u.password);

        return {
            result: result,
            user: u
        };
    },
    generateJwtToken: async function(email){
        let authToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRESIN});

        return authToken;
    }
};

module.exports = authService;