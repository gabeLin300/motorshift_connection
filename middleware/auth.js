const {Event} = require('../models/event');

//authorization helper function for checking if user is logged in
exports.isGuest = (req,res,next)=> {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');
    }  
};

//check if the user is authenticated
exports.isAuthenticated = (req,res,next)=> {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are not logged in');
        return res.redirect('/users/login');
    }  
};

//check if the user is the owner specific event
exports.isEventOwner = (req,res,next)=> {
    let eventId = req.params.id;
    Event.findById(eventId)
    .then(event=>{
        if(event) {
            if(event.host == req.session.user) {
                return next();
            } else {
                req.flash('error', 'You are not authorized to perform this action');
                return res.redirect('/');
            }
        } else {
            let err = new Error('Could not find event with id: '+eventId);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err))
};

//check if the user is the owner specific event
exports.isNotEventOwner = (req,res,next)=> {
    let eventId = req.params.id;
    Event.findById(eventId)
    .then(event=>{
        if(event) {
            if(event.host != req.session.user) {
                return next();
            } else {
                let err = new Error('You cannot rsvp to your own events');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Could not find event with id: '+eventId);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err))
};