//require modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { urlencoded } = require('body-parser');
const eventRoutes = require('./routes/eventRoutes');
const homeRoutes = require('./routes/mainRoutes');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const {getCollection} = require('./models/event')

//create app
const app = express();

//configure app
const port = 8080;
const host = 'localhost';
const url = 'mongodb://localhost:27017/motorshift_connection';
app.set('view engine', 'ejs');

//mongodb connection
mongoose.connect(url)
.then(()=>{
    //start server
    app.listen(port, host);
    console.log('Server running on: ' +host+ ':' +port);
    
})
.catch(err=>console.log(err));


//mount middleware
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());

//routes

// home page
app.use('/', homeRoutes);

// events pages
app.use('/events', eventRoutes);

//error handlers
app.use((req, res, next) => {
    let err = new Error('The server cannot locate' +req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    console.log(err);
    res.status(err.status);
    res.render('main/error', {error: err});
})
