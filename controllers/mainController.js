const model = require('../models/event')

//GET home page
exports.index = (req,res) => {
    top3 = model.getTop3();
    res.render('main/index', {top3});
}
//GET about page
exports.about = (req, res) => {
    res.render('main/about');
}
//GET contact page
exports.contact = (req, res) => {
    res.render('main/contact');
}