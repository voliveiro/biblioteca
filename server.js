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

app.get('/home', isAuthenticated, (req,res) => {
    if(req.session.currentUser){
        res.render('home.ejs', {
            currentUser: req.session.currentUser
        });
    }
})


// Show user catalogue 

app.get('/catalogue', isAuthenticated, (req,res) => {
    if(req.session.currentUser){
        Books.find( {owner: req.session.currentUser._id} , ( err , books ) => {
            if ( err ) { 
                console.log ( err ); 
            }
            res.render ( 'newcatalogue.ejs' , { 
                Books: books, 
                user: req.session.currentUser, 
            }
        );
        });
    }
})

// Show each book in user's catalogue

app.get('/catalogue/:bookid', isAuthenticated, (req,res) => {
    if(req.session.currentUser){
        Books.findById( req.params.bookid , ( err , book ) => {
            if ( err ) { 
                console.log ( err ); 
            }
            res.render ( 'showbook.ejs' , { 
                book: book, 
                bookid: req.params.bookid, 
                user: req.session.currentUser, 
            }
        );
        });
    }
})



//ADD A NEW BOOK

app.get ( '/:id/add' , ( req , res ) => {
    User.findById( req.params.id , ( err , user ) => {
        if ( err ) { 
            console.log ( err ); 
        }
        console.log (user)
        res.render ( 'newadd.ejs' , { user : user }
    );
    });
});
    

app.post( '/home', isAuthenticated, ( req , res ) => {
    let newbook = {}; 
    newbook.author = req.body.author; 
    newbook.title = req.body.title;
    newbook.notes = req.body.notes; 
    newbook.owner = req.session.currentUser._id; 
    Books.create(newbook, (err , book) => { 
        console.log (newbook)
        res.redirect ( `home` );
    });    
});

//edit user info 

app.get('/edituserinfo/:id', (req, res) => {
    User.findById( req.params.id , ( err , user ) => {
        if ( err ) { 
            console.log ( err ); 
        }
        console.log (user)
        res.render ( 'edituser.ejs' , { user : user }
    );
    });
})

app.put( '/home' , ( req , res ) => {
    User.findByIdAndUpdate( req.params.id, {$set: {username: req.body.username}}, ( err , user ) => { 
        if ( err ) { 
            console.log( err ); 
        }
        console.log (user)
        res.redirect ( '/home' );
    });
});

//edit book remarks


app.get ( '/:id/edit' , ( req , res ) => {
    Books.findById( req.params.id , ( err , book ) => {
        if ( err ) { 
            console.log ( err ); 
        }
        console.log (book)
        res.render ( 'neweditbook.ejs' , { 
            book : book 
        }
    );
    });
});
    

app.put( '/catalogue' , ( req , res ) => {
    Books.findByIdAndUpdate( req.params.id, {$set: {notes: req.body.notes}}, ( err , book ) => { 
        if ( err ) { 
            console.log( err ); 
        }
        console.log(book)
        res.redirect ('/catalogue' );
    });
    
    });


app.listen(3000, ()=>{
    console.log('Listening');});