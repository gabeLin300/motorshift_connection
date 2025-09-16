const {User, accTypes} = require('../models/user');
const {Event, RSVP} = require('../models/event');

//GET form to add a new user
exports.new = (req,res) => {
    return res.render('user/new')
}

//POST a new user
exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.email = user.email.toLowerCase();
    user.save()
    .then(()=> {
        req.flash('success', 'Your account has been created');
        res.redirect('users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect(req.get('Referer'));
        }
        if(err.code === 11000) {
            req.flash('error', 'This email has already been registered');
            return res.redirect(req.get('Referer'));
        }
        next(err)
    })
}

//GET login page
exports.login = (req, res) => {
    res.render('user/login');
}

// //POST login a user
exports.newSession = (req,res, next) => {
    let userEmail = req.body.email;
    if (userEmail) {
        userEmail = userEmail.toLowerCase();
    }
    let userPass = req.body.password;
    User.findOne({email: userEmail})
    .then(user=> {
        if(user) {
            user.comparePassword(userPass)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in')
                    res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Incorrect password')
                    res.redirect('/users/login');
                }
            })
        } else {
            req.flash('error', 'Incorrect email')
            res.redirect('/users/login');
        }
    })
    .catch(err=> {
        next(err);
    });
}

//GET user profile
exports.profile = (req,res, next) => {
    let id = req.session.user
    
    Promise.all([User.findById(id), Event.find({host: id}), RSVP.find({responder: id}).populate('event', 'name')])
    .then(results=>{
        if(results) {
            const [user, events, rsvps] = results;
            res.render('user/profile', {user, events, rsvps});
        } else {
            let err = new Error('Please login before accessing your profile');
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

//GET user logout
exports.logout = (req,res,next) => {
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    })
}