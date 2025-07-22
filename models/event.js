const { v4: uuidv4 } = require('uuid');

let events = [{
        id: uuidv4(), 
        name: 'SRO GT World Challenge', 
        host: 'Virginia International Raceway',
        start: '2025-07-17T07:00', 
        end: '2025-07-20T14:00', 
        location: '1245 Pine Tree Rd, Alton, VA 24520',
        details:`GT World Challenge Powered by AWS is an international championship organized by 
                SRO Motorsports Group in which leading manufacturers compete through their 
                continental customer racing programs. The 2025
                season consists of sprint and endurance events in Europe, North
                America, Asia, and Australia, with a group of elite brands battling
                for the top spot`,
        category: 'Road Course',
        eventImg: '/uploads/eventImg-1752691283891-489210283.jpg',
        views: 0},
        {
        id: uuidv4(), 
        name: 'Tri-Acres RC Drift', 
        host: 'Tri-Acres Drift Circuit',
        start: '2025-07-18T20:00', 
        end: '2025-07-18T22:00', 
        location: '6240 Weddington Rd. Concord, NC 28027',
        details:`with 1/10 rc drift cars
                We run RWD, AWD, AND Countersteer cars.
                Tire requirement:
                RWD PRO- MST Gold (101025)
                RWD Standard - MST Green or TDRIFT
                AWD- MST Purple (101029)
                CS- MST Purple (101029)`,
        category: 'Drift',
        eventImg: '/uploads/eventImg-1752698596046-509169510.jpg',
        views: 0},
        {
        id: uuidv4(), 
        name: 'Piedmont Drift', 
        host: 'Piedmont Dragway',
        start: '2025-08-16T15:00', 
        end: '2025-08-16T23:00', 
        location: '6750 Holts Store Road Julian, North Carolina 27283',
        details:`JAN 11TH, FEB 8TH, MAR 8TH, MAR 15,  APRIL 26TH & 27TH,  MAY 24TH & 25TH, JUNE 14TH, JULY 12TH, AUG 16TH,
                SEPT 13TH, OCT 11TH & 12TH, NOV 8TH, NOV 9TH, DEC 6TH, DEC 7TH, AND DEC 13TH 2025`,
        category: 'Drift',
        eventImg: '/uploads/eventImg-1752698838213-427661032.jpg',
        views: 0},
        {
        id: uuidv4(), 
        name: 'Ebisu Drift Matsuri', 
        host: 'Ebisu Circuit',
        start: '2025-08-23T08:30', 
        end: '2025-08-24T17:00', 
        location: 'Sawamatsukura, Nihonmatsu City, Fukushima Pref. 964-0088',
        details:`The Ebisu Circuit is a famous car racing track and drifting school in Nihonmatsu. Three times a year, it holds the Ebisu Drift Matsuri (Ebisu Drift Festival), a thrilling event that gathers car drifting fans from across Japan and abroad.

The festival usually goes from Saturday morning to Sunday afternoon, during which participants can drift all day and night in the designated courses for a set fee. `,
        category: 'Drift',
        eventImg: '/uploads/eventImg-1752698712216-743633988.jpg',
        views: 0},
        {
        id: uuidv4(), 
        name: 'MotoAmerica Virginia International Raceway 2025', 
        host: 'Virginia International Raceway',
        start: '2025-08-01T08:30', 
        end: '2025-08-03T17:00', 
        location: '1245 Pine Tree Rd, Alton, VA 24520',
        details:`The MotoAmerica AMA/FIM North American Road Racing Championship is an affiliate of KRAVE Group LLC, 
        a partnership that includes three-time 500cc Grand Prix World Champion, two-time AMA Superbike Champion, 
        and AMA Hall of Famer Wayne Rainey; ex-racer, former vice president of motorsports operations at the Circuit of The Americas (COTA), 
        and former managing director of Team Roberts in the Grand Prix World Championship Chuck Aksland; 
        executive director of the Petersen Automotive Museum Terry Karges; and energy sector investor and businessman Richard Varner.`,
        category: 'Road Course',
        eventImg: '/uploads/eventImg-1752697916453-395329293.jpg',
        views: 0},
        {
        id: uuidv4(), 
        name: 'ChampCar (F) 24-Hr Race (9:00am SAT - 9:00am SUN)', 
        host: 'Virginia International Raceway',
        start: '2025-08-16T08:30', 
        end: '2025-08-17T17:00', 
        location: '1245 Pine Tree Rd, Alton, VA 24520',
        details:`Race your car with some friends, or find a drive with one of many arrive and drive teams. 
        Race at world-famous tracks like Daytona, Road Atlanta, Watkins Glen, Road America, VIR, and Sebring.
        ChampCar is for people that have always wanted to go road racing without all of the hassles, huge rulebook, or obscene expense.
        All that is required is a current drivers license, ChampCar club membership, some safety equipment, and a need to go wheel to wheel racing!`,
        category: 'Road Course',
        eventImg: '/uploads/eventImg-1752698446449-368959176.jpg',
        views: 0}];

let eventCategories = ['Road Course', 'Drift', 'Car Show', 'Dirt Oval', 'Karting', 'Asphalt Oval', 'Other'];

//returns a slice of the top 3 events in the database sorted by views
exports.getTop3 = () => events.sort((eventA, eventB) => eventB.views - eventA.views).slice(0,3);

//return all the possible categories
exports.getEventCategories = () => eventCategories;

//Get all events
exports.find = () => events;

//Get an event by its id
exports.findById = (id) => events.find(element => element.id === id);

//Get a temporary map of the events by category until we implement a proper database
exports.getMap = () => Map.groupBy(events , event => event.category);

//Update an event by its id
exports.updateById = (id, newEvent) => {
        let event = this.findById(id);
        if (event) {
                event.name = newEvent.name;
                event.host = newEvent.host;
                event.start = newEvent.start;
                event.end = newEvent.end;
                event.location = newEvent.location;
                event.details = newEvent.details;
                event.category = newEvent.category;
                event.eventImg = newEvent.eventImg;
                return true;
        } else
                return false;
}

//Delete an event by its id
exports.deleteById = (id) => {
        let index = events.findIndex(event => event.id === id);
        if(index !== -1) {
                events.splice(index, 1)
                return true;
        } else 
                return false;
}

//Create a new event
exports.createNew = (newEvent, eventImg) => {
        if(newEvent) {
                newEvent.id = uuidv4();
                newEvent.eventImg = eventImg;
                newEvent.views = 0;
                events.push(newEvent);
        }
        return this.findById(newEvent.id);
}
