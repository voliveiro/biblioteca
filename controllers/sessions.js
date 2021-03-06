const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

// new session - log in form
sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs');
});

// create new session
sessions.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
      console.log (foundUser)  
      // if db error handle the db error
        if (err) {
            console.log(err);
            res.send('oops something went wrong');
            // if user not found, handle the error
        } else if (!foundUser) {
            res.send('user not found!');
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser;
                res.redirect('/');
                // if passwords don't match, handle the error
            } else {
                res.send('<a href="/">wrong password</a>');
            }
        }
    });
});

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = sessions;