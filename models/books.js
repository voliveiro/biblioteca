const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = Schema({
  author: String,
  title: String, 
  notes: String, 
  owner: String, 
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book