const express = require('express');
const users = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

// new user sign-up form
users.get('/new', (req, res) => {
    res.render('users/new.ejs');
});

// create new user
users.post('/', (req, res) => {
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10),
    );
    User.create(req.body, () => {
        res.redirect('/');
    });
});



// edit user info 

users.get('/edituserinfo/:id', (req, res) => {
    User.findById( req.params.id , ( err , user ) => {
        if ( err ) { 
            console.log ( err ); 
        }
        console.log (user)
        res.render ( 'edituser.ejs' , { user : user }
    );
    });
})

users.put( './home' , ( req , res ) => {
    User.findByIdAndUpdate( req.params.id, {$set: {username: req.body.username}}, ( err , user ) => { 
        if ( err ) { 
            console.log( err ); 
        }
        console.log (user)
        res.redirect ( './home' );
    });
});

module.exports = users;