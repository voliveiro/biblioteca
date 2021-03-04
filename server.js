require('dotenv').config(); 
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const ejs = require('ejs');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session')
const User = require('./models/users.js')
const Books = require('./models/books.js')


const userController = require('./controllers/users.js')
const sessionsController = require('./controllers/sessions.js')
const appController = require('./controllers/app.js')

const mongoose = require('mongoose');
const mongoURI = process.env.DB_URI ||'mongodb://localhost:27017/'+ 'books'
const db = mongoose.connection

//Middleware 

app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }))

app.use((req, res, next) => {
    console.log('Middleware 2');
    next();
});
  
app.use('/users', userController)
app.use('/sessions', sessionsController)
app.use('/app', appController)

//Database

mongoose.Promise = global.Promise

mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('the connection with mongod is established');
    }
);

mongoose.connection.once('open', () => {
    console.log('connected to mongo');
});

db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', mongoURI))
db.on('disconnected', () => console.log('mongo disconnected'))

const isAuthenticated = (req, res, next) => {
    console.log(req.session.currentUser);
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect('/sessions/new');
    }
};


app.get('/', (req, res) => {
    res.render('index.ejs', {
        currentUser: req.session.currentUser
    })
})

app.get('/app', isAuthenticated, (req, res)=>{
    if(req.session.currentUser){
        res.render('app/index.ejs')
    } else {
        res.redirect('/sessions/new');
    }
})

app.listen(process.env.PORT, ()=>{
    console.log('Listening');
});