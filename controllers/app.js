const express = require('express');
const app = express.Router();
const User = require('../models/users');
const Books = require('../models/books');

//check if user is authenticated
const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
		return next();
	} else {
		res.redirect('/sessions/new');
	}
};

//renders home page 
app.get('/home', isAuthenticated, (req,res) => {
    if(req.session.currentUser){
        res.render('home.ejs', {
            currentUser: req.session.currentUser
        });
    }
})


//add a new book

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

module.exports = app; 