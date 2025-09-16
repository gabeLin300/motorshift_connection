const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    handler: (req,res,next) => {
        let err = new Error('Too many login attempts, please try again later.');
        err.status = 429;
        next(err);
    }
});