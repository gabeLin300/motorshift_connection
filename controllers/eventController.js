const { eventNames } = require('node:process');
const model = require('../models/event');
const { v4: uuidv4 } = require('uuid');

//GET all events
exports.index = (req, res, next) => {
    model.Event.find()
    .then(events => {
        if (events) {
            eventMap = Map.groupBy(events, event => event.category);
            res.render('event/index', {eventMap});
        } else {
            let err = new Error('Cannot find any events');
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

//GET form to add a new event
exports.new =  (req, res) => {
    res.render('event/new');
}

//POST new event
exports.create = (req,res, next) => {
    let event = req.body;
    event.eventImg = '/uploads/' + req.file.filename;
    newEvent = new model.Event(event);
    newEvent.save()
    .then(result=> {
        res.redirect('/events');
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)
    });
}
//GET event by id
exports.show = (req, res, next) => {
    let id = req.params.id;

    //simple cookies for tracking views on an event
    // if(!req.cookies[`event${id}`]) {
    //     cookieTok = uuidv4();
    //     //cookie expires in 10 seconds for testing
    //     res.cookie(`event${id}`, cookieTok, {maxAge: 10000, httpOnly: true});
    //     return model.incrementViewsById(id);
    // } 

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        next(err);
    }
    model.Event.findById(id)
    .then(currEvent => {
        if (currEvent) {
            res.render('event/show', {currEvent});
        } else {
            let err = new Error('Cannot find the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}
//GET edit form for specific event
exports.edit = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        next(err);
    }
    model.Event.findById(id)
    .then(currEvent => {
        if (currEvent) {
            res.render('event/edit', {currEvent, eventCategories: model.categories});
        } else {
            let err = new Error('Cannot find the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}
//PUT update an event by id
exports.update = (req, res, next) => {
    id = req.params.id
    newEvent = req.body;
    if(req.file.filename)
        newEvent.eventImg = '/uploads/' + req.file.filename;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        next(err);
    }
    model.Event.findByIdAndUpdate(id, newEvent)
    .then(dbEvent=> {
        if(dbEvent) {
            res.redirect('/events/'+id);
        } else {
            let err = new Error('Could not update the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}
//DELETE event by id
exports.delete = (req, res, next) => {
    id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        next(err);
    }
    model.Event.findByIdAndDelete(id)
    .then(dbEvent=> {
        if (dbEvent) {
            res.redirect('/events');
        } else {
            let err = new Error('Could not delete the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}