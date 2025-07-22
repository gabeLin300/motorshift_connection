const { eventNames } = require('node:process');
const model = require('../models/event');
const { v4: uuidv4 } = require('uuid');

//GET all events
exports.index = (req, res, next) => {
    eventMap = model.getMap();
    if (eventMap.size) {
        res.render('event/index', {eventMap});
    } else {
        let err = new Error('Cannot find any events');
        err.status = 404;
        next(err);
    }
}

//GET form to add a new event
exports.new =  (req, res) => {
    res.render('event/new');
}

//POST new event
exports.create = (req,res) => {
    newEvent = req.body;
    eventImg = '/uploads/' + req.file.filename;
    dbEvent = model.createNew(newEvent, eventImg);
    if (dbEvent) {
        res.redirect('/events/'+dbEvent.id);
    }
}
//GET event by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    currEvent = model.findById(id);
    if (currEvent) {
        // simple cookie for incrementing views to an event
        //followed express documentation
        if(!req.cookies[`event${id}`]) {
            currEvent.views += 1;
            cookieTok = uuidv4();
            //cookie expires in 10 seconds for testing
            res.cookie(`event${id}`, cookieTok, {maxAge: 10000, httpOnly: true});
        }
        res.render('event/show', {currEvent});
        
    } else {
        let err = new Error('Cannot find the event with id: '+id);
        err.status = 404;
        next(err);
    }
}
//GET edit form for specific event
exports.edit = (req, res, next) => {
    let id = req.params.id;
    currEvent = model.findById(id);
    eventCategories = model.getEventCategories();
    if (currEvent) {
        res.render('event/edit', {currEvent, eventCategories});
    } else {
        let err = new Error('Cannot find the event with id: '+id);
        err.status = 404;
        next(err);
    }
}
//PUT update an event by id
exports.update = (req, res, next) => {
    id = req.params.id
    newEvent = req.body;
    if(req.file.filename)
        newEvent.eventImg = '/uploads/' + req.file.filename;
    if (model.updateById(id, newEvent)) {
        res.redirect('/events/'+id);
    } else {
        let err = new Error('Cannot find the event with id: '+id);
        err.status = 404;
        next(err);
    }
}
//DELETE event by id
exports.delete = (req, res, next) => {
    id = req.params.id
    if (model.deleteById(id)) {
        res.redirect('/events');
    } else {
        let err = new Error('Cannot find the event with id: '+id);
        err.status = 404;
        next(err);
    }
}