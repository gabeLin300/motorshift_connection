const { eventNames } = require('node:process');
const model = require('../models/event');
const { v4: uuidv4 } = require('uuid');

//GET all events
exports.index = (req, res, next) => {
    model.find()
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
    newEvent = req.body;
    eventImg = '/uploads/' + req.file.filename;
    newEvent.eventImg = eventImg;
    newEvent.views = 0;
    model.createNew(newEvent)
    .then(result=> {
        res.redirect('/events/'+result.insertedId.toString());
    })
    .catch(err=>next(err));
}
//GET event by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    let currEvent;
    model.findById(id)
    .then(dbEvent => {
        if (dbEvent) {
            currEvent = dbEvent
            //simple cookies for tracking views on an event
            if(!req.cookies[`event${id}`]) {
                cookieTok = uuidv4();
                //cookie expires in 10 seconds for testing
                res.cookie(`event${id}`, cookieTok, {maxAge: 10000, httpOnly: true});
                return model.incrementViewsById(id);
            } 
            return Promise.resolve();
        } else {
            let err = new Error('Cannot find the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .then(result => {
        res.render('event/show', {currEvent});
    })
    .catch(err => next(err));
}
//GET edit form for specific event
exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(currEvent => {
        eventCategories = model.getEventCategories();
        if (currEvent) {
            res.render('event/edit', {currEvent, eventCategories});
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
    model.updateById(id, newEvent)
    .then(result=> {
        if(result.modifiedCount === 1) {
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
    id = req.params.id
    model.deleteById(id)
    .then(result=> {
        if (result.deletedCount === 1) {
            res.redirect('/events');
        } else {
            let err = new Error('Could not delete the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}