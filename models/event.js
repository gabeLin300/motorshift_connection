const { v4: uuidv4 } = require('uuid');
const {Datetime} = require('luxon');
const {ObjectId} = require('mongodb');


let events;
exports.getCollection = db => {
        events = db.collection('events');
}

let eventCategories = ['Road Course', 'Drift', 'Car Show', 'Dirt Oval', 'Karting', 'Asphalt Oval', 'Other'];

//returns a slice of the top 3 events in the database sorted by views
exports.getTop3 = () => events.sort((eventA, eventB) => eventB.views - eventA.views).slice(0,3);
exports.findSorted = () => events.find().sort({views: -1}).toArray();

//return all the possible categories
exports.getEventCategories = () => eventCategories;

//Get all events
exports.find = () => events.find().toArray();

//Get an event by its id
exports.findById = (id) => events.findOne({_id: ObjectId.createFromHexString(id)});

//Update an event by its id
exports.updateById = (id, newEvent) => events.updateOne(
        {_id: ObjectId.createFromHexString(id)},
        {$set:
        {
                name: newEvent.name,
                host: newEvent.host,
                start: newEvent.start,
                end: newEvent.end,
                location: newEvent.location,
                details: newEvent.details,
                category: newEvent.category,
                eventImg: newEvent.eventImg,
        }});

exports.incrementViewsById = (id) => events.updateOne(
        {_id: ObjectId.createFromHexString(id)},
        {$inc:{views:1}});

//Delete an event by its id
exports.deleteById = (id) => events.deleteOne({_id: ObjectId.createFromHexString(id)});

//Create a new event
exports.createNew = (newEvent) => events.insertOne(newEvent)