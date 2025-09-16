const {validationResult, body, check} = require('express-validator');
const {accTypes} = require('../models/user');
const {categories, daysOfWeek} = require('../models/event');


//check if the url parameter is a valid id
exports.isValidId = (req,res,next) =>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    return next();
}

//login validator
exports.logInValidator = [
    body('email', 'The email must be a valid email').isEmail().trim().escape().normalizeEmail(),
    body('password', 'The password must be atleast 8 chars and atmost 64 chars').isLength({ min: 8, max: 64})
]

//signup validator
exports.signUpValidator = [
    body('accType', 'Account type is required').notEmpty().isIn(accTypes).withMessage('Invalid Account type'),
    body('companyName').if((companyName, {req}) => {return req.body.accType === 'Business'}).notEmpty().withMessage('Company name is required').trim().escape(),
    body('companyName').if((companyName, {req}) => {return req.body.accType !== 'Business'}).isEmpty().withMessage('Personal accounts cannot have a company name'),
    body('firstName').if((firstName, {req}) => {return req.body.accType === 'Personal'}).notEmpty().withMessage('First name is required').trim().escape(),
    body('lastName').if((lastName, {req}) => {return req.body.accType === 'Personal'}).notEmpty().withMessage('Last name is required').trim().escape(),
    body('email', 'The email must be a valid email').isEmail().trim().escape().normalizeEmail(),
    body('password', 'The password must be atleast 8 chars and atmost 64 chars').isLength({ min: 8, max: 64})
]

exports.eventValidator = [
    body('category', 'Category is required').notEmpty().isIn(categories).withMessage('Category can only be one of the following: '+categories),
    body('name', 'Event name is required').notEmpty().trim().escape(),
    body('details', 'Event details is required').notEmpty().trim().escape(),
    body('location', 'Event location is required').notEmpty().trim().escape(),
    body('recurringDays').if((recurring, {req}) => {return req.body.recurring === 'true'}).isArray()
        .isIn(daysOfWeek).withMessage('Recurring days can only be the following: '+daysOfWeek).trim().escape(),
    body('start', 'Event start date is required').if((recurring, {req}) => {return req.body.recurring !== 'true'}).notEmpty().isISO8601().withMessage('The format of start date must be: YYYY-MM-DDThh:mm:ssTZD')
        .isAfter(new Date().toISOString()).withMessage('Start must be after today').trim().escape(),
    body('end', 'Event end date is required').if((recurring, {req}) => {return req.body.recurring !== 'true'}).notEmpty().isISO8601().withMessage('The format of end date must be: YYYY-MM-DDThh:mm:ssTZD')
        .custom((end, {req})=>{
                    if(req.body.start >= end) {
                        throw new Error('End must be after Start');
                    }
                    return true;
                }).trim().escape(),
    check('file-upload').custom((file, {req})=>{ if(req.file) {return true} return false}).withMessage('Event Image is required').trim().escape()
]

exports.rsvpValidator = [
    body('status','Rsvp status is required').notEmpty().isIn(['YES', 'NO', 'MAYBE']).withMessage('RSVP can only be YES, NO or MAYBE').trim().escape()
]

//send validation results
exports.validationResults = (req,res,next) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        })
        return res.redirect(req.get('Referer'));
    } else {
        return next();
    }
}