const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js') // our model

// const isAuthenticated = (req, res, next) => {
//   if (req.body.currentUser) {
//     return next();
//   } else {
//     res.redirection("/sessions/new")
//   }
// }
users.get('/new',  (req, res) => {
  res.render('users/new.ejs')
})

// users/new form submit

// create a new user based on input in form

users.post('/', (req, res) => {
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err)
    }
    console.log(createdUser);
    res.redirect('/')
  })
}) 

module.exports = users