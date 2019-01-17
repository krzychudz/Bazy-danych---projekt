const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const routes = require('./routes/index');

const methodOverride = require('method-override');


const app = express();


app.set('views', path.join(__dirname, 'views')); // Set dir for views
app.set('view engine', 'pug');  // Set view engine
app.use(express.static(path.join(__dirname,'public'))); //set dir for public

app.use(bodyParser.json()); // Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser()); // Configure cookie parser
app.use(methodOverride('_method'));

app.use(session(
    {
        secret: 'shop',
        resave: false,
        saveUninitialized: true,
        cookie:{}
    }
));

app.use(flash()); // Configure flash


app.use('/', routes); // Our router can handel all request start with /

module.exports = app;

