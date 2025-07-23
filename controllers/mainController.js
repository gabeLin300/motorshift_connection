const model = require('../models/event')

//GET home page
exports.index = (req,res) => {
    model.Event.find().sort({views:-1}).lean()
    .then(events=> {
        if(events) {
            top3events = events.slice(0,3);
            res.render('main/index', {top3events});
        }
    })
    .catch(err=>next(err));
}
//GET about page
exports.about = (req, res) => {
    res.render('main/about');
}
//GET contact page
exports.contact = (req, res) => {
    res.render('main/contact');
}