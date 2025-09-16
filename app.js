//require modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { urlencoded } = require('body-parser');
const eventRoutes = require('./routes/eventRoutes');
const homeRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create app
const app = express();

//configure app
const port = 8080;
const host = 'localhost';
const uri = 'PRIVATE URI';
app.set('view engine', 'ejs');

//mongodb connection
mongoose.connect(uri)
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

app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 30 * 1000},
    store: new MongoStore({mongoUrl: uri})
}));

app.use(flash());

app.use((req,res,next)=>{
    res.locals.user = req.session.user||null;
    res.locals.successMsgs = req.flash('success');
    res.locals.errorMsgs = req.flash('error');
    next();
});

//routes

// home page
app.use('/', homeRoutes);

// events pages
app.use('/events', eventRoutes);

// user pages
app.use('/users', userRoutes);

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
    res.status(err.status);
    res.render('main/error', {error: err});
})
