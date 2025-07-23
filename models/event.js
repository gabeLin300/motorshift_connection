const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//available categories
const categories = ['Road Course', 'Drift', 'Car Show', 'Dirt Oval', 'Karting', 'Asphalt Oval', 'Other'];

const eventSchema = new Schema({
        name: {type: String, required: [true, 'Name is required'], min: [10,'Must be atleast 10 chars'], max:[80, 'Must be atmost 80 chars']},
        host: {type: String, required: [true, 'Host is required'], min: [10,'Must be atleast 10 chars'], max: [80,'Must be atleast 10 chars']},
        start: {type: Date, required: [true, 'Start date/time is required'], min: [Date.now(), 'The start date must be current']},
        end: {type: Date, required: [true, 'End date/time is required'], min: [Date.now(), 'The end date must be current']},
        location: {type: String, required: [true, 'Location is required'], min: [10, 'The address length must be atleast 10']},
        details: {type:String, required: [true, 'Details are required'], min: [50, 'Event details must be atleast 50 chars']},
        category: {type: String, enum: {values: categories, message: '{VALUE} is not supported'}},
        eventImg: {type: String, required: [true, 'An uploaded image path is required']},
        views: {type: Number, min: 0, default: 0}},
        {timestamps: true}
);

const Event = mongoose.model('Event', eventSchema);

module.exports = {Event, categories};