const mongoose = require('mongoose');  
const Schema = mongoose.Schema;  

const bookSchema = new Schema({
    title: String, 
    author: String, 
    ISBN: Number,
    Remarks: String, 

})

const Books = mongoose.model('books', bookSchema)
module.exports = Books