let jwt = require('jsonwebtoken');

let authenticateRequest = (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        return next();
    }

    let authToken = req.headers['x-access-token'] || req.headers['authorization'];
    // Remove Bearer from string
    if (authToken && authToken.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (authToken) {
        jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    success: false,
                    message: 'Auth token is invalid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = {
    authenticateRequest: authenticateRequest
};