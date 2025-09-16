const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//available categories
const categories = ['Road Course', 'Drift', 'Car Show', 'Dirt Oval', 'Karting', 'Asphalt Oval', 'Other'];

//arr for new feature
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const eventSchema = new Schema({
        name: {type: String, required: [true, 'Name is required'], min: [10,'Must be atleast 10 chars'], max:[80, 'Must be atmost 80 chars']},
        host: {type: Schema.Types.ObjectId, ref: 'User'},
        start: {type: Date, required: [true, 'Start date/time is required'], min: [Date.now(), 'The start date must be current']},
        end: {type: Date, 
              required: [true, 'End date/time is required'], 
              min: [Date.now(), 'The end date must be current'],
              validate: {
                        validator: function(newEndValue) {return newEndValue > this.get('start')},
                        message: 'End date must be greater than Start date.'
                }},
        location: {type: String, required: [true, 'Location is required'], min: [10, 'The address length must be atleast 10']},
        details: {type:String, required: [true, 'Details are required'], min: [50, 'Event details must be atleast 50 chars']},
        category: {type: String, enum: {values: categories, message: '{VALUE} is not a supported category'}},
        eventImg: {type: String, required: [true, 'An uploaded image path is required']},
        views: {type: Number, min: 0, default: 0, required: [true]},},
        {timestamps: true}
);

const Event = mongoose.model('Event', eventSchema);

// recurring events schema
const recurringSchema = new Schema({
        isRecurring: {type: Boolean, required: [true], default: false},
        recurringDays: [{type: String, 
                        enum: {values: daysOfWeek, message: '{VALUE} is not a supported day'},
                        required: [true, 'If event is recurring, atleast one recurring day must be marked']}]
        }
);

recurringSchema.pre('save', function(next) {
        let event = this;
        let startTime = event.start.split(':');
        let startTimeInt = startTime.map((str)=> parseInt(str));
        let endTime = event.end.split(':');
        let endTimeInt = endTime.map((str)=> parseInt(str))
        const newStart = new Date();
        const newEnd = new Date();

        newStart.setHours(startTimeInt[0], startTimeInt[1], 0, 0);
        newEnd.setHours(endTimeInt[0], endTimeInt[1], 0, 0);

        if(event.recurringDays[0] === daysOfWeek[newStart.getDay()]) {
                newStart.setDate(newStart.getDate() + 7);
        } else {
                newStart.setDate(newStart.getDate() + ((newStart.getDay() - daysOfWeek.indexOf(event.recurringDays[0]) + 7) % 7));
        }
});

const recurringEvent = Event.discriminator('isRecurring', recurringSchema);

//RSVPs schema
const rsvpSchema = mongoose.Schema({
        event: {type: Schema.Types.ObjectId, ref: 'Event'},
        status: {type: String, 
                 enum: {values: ['YES', 'NO', 'MAYBE'], message: '{VALUE} is not a supported RSVP status'}, 
                 required: [true, 'RSVP status is required']},
        responder: {type: Schema.Types.ObjectId, ref: 'User'}
});

const RSVP = mongoose.model('RSVP', rsvpSchema);

module.exports = {Event, RSVP, categories, daysOfWeek, recurringEvent};