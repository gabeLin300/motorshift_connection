const {DateTime} = require('luxon');
const {Event, RSVP, recurringEvent, daysOfWeek} = require('../models/event');
const { v4: uuidv4 } = require('uuid');

//GET all events
exports.index = (req, res, next) => {
    Event.find().lean()
    .then(events => {
        if (events) {
            const eventMap = Map.groupBy(events, event => event.category);
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
    event.host = req.session.user;
    if(req.file)
        event.eventImg = '/uploads/' + req.file.filename;

    if(req.body.recurring) {
        let newEvent = new recurringEvent(event)
    } else {
        let newEvent = new Event(event);
    }
    newEvent.save()
    .then(()=> {
        res.redirect('/events');
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error',err.message);
            return res.redirect(req.get('Referer'));
        }
        next(err)
    });
}
//GET event by id
exports.show = (req, res, next) => {
    let id = req.params.id;

    //function to check if views need to be incremented
    const incrementViewsPromise = () => {
        //simple cookies for tracking views on an event
        if(!req.cookies[`event${id}`]) {
            const cookieToken = uuidv4();
            //cookie expires in 10 seconds for testing
            res.cookie(`event${id}`, cookieToken, {maxAge: 10000, httpOnly: true});
            return Event.findByIdAndUpdate(id, {$inc:{views:1}}).populate('host', 'firstName lastName companyName').lean();
        }
        return Event.findById(id).populate('host', 'firstName lastName companyName').lean();
    }

    Promise.all([incrementViewsPromise(), RSVP.countDocuments({event: id, status: 'YES'})])
    .then(results => {
        const [currEvent, count] = results;
        if (currEvent) {
            //date formatting using luxon
            currEvent.start = DateTime.fromJSDate(currEvent.start).toLocaleString(DateTime.DATETIME_MED)
            currEvent.end = DateTime.fromJSDate(currEvent.end).toLocaleString(DateTime.DATETIME_MED)
            res.render('event/show', {currEvent, count});
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

    Event.findById(id).lean()
    .then(currEvent => {
        if (currEvent) {
            currEvent.start = DateTime.fromJSDate(currEvent.start).toISO({includeOffset: false})
            currEvent.end = DateTime.fromJSDate(currEvent.end).toISO({includeOffset: false})
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
    let id = req.params.id
    let newEvent = req.body;
    if(req.file) 
        newEvent.eventImg = '/uploads/' + req.file.filename;

    Event.findByIdAndUpdate(id, newEvent, {runValidators:true}).lean()
    .then(dbEvent=> {
        if(dbEvent) {
            req.redirect('/events/'+id);
        } else {
            let err = new Error('Could not update the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error',err.message);
            return res.redirect(req.get('Referer'));
        }
        next(err)
    });
}
//DELETE event by id
exports.delete = (req, res, next) => {
    let id = req.params.id;

    Promise.all([Event.findByIdAndDelete(id).lean(), RSVP.deleteMany({event: id})])
    .then(results=> {
        if (results) {
            req.flash('success', 'Event deleted successfully')
            res.redirect('/events');
        } else {
            let err = new Error('Could not delete the event with id: '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}
//POST a new rsvp to a specific event
exports.rsvp = (req,res,next) => {
    let rsvp = req.body;
    let eventId = req.params.id;
    let userId = req.session.user;

    RSVP.findOneAndUpdate({responder: userId, event: eventId}, rsvp, {upsert:true, runValidators:true, new:true})
    .then(dbRSVP => {
        req.flash('success', 'You have successfully RSVPd to this event')
        res.redirect('/events/'+req.params.id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error',err.message);
            return res.redirect('/users/profile');
        }
        next(err)
    });
}