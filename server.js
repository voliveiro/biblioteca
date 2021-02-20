require('dotenv').config(); 
const express = require('express');
const app = express();
const ejs = require('ejs');
const methodOverride = require('method-override');
const Books = require('./models/books.js')
const data = require('./models/data.js')
const mongoose = require('mongoose');
const mongoURI = process.env.DB_URI ||'mongodb://localhost:27017/'+ 'books'
const db = mongoose.connection

const authorsController = require('./controllers/authors.js');


app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    console.log('Middleware 2');
    next();
});

app.use('/authors', authorsController);

 

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

//add seed data

// app.get('/index/seed', (req, res) => {
//     Books.create(data, (err, data) => {
//         res.redirect('/');
//     })
// });

//show all books


app.get('/index', (req, res) => {
    Books.find({}, (error, books) => {
        res.render('index.ejs', {
            Books: books
        });
    });
});


//SHOW 

app.get('/:id', (req,res) => {
    Books.findById(req.params.id, (err, book) => {
        res.render('show.ejs', {
            book: book, 
    })
   
    })
})

// ADD

app.get('/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/index', (req, res) => {
    Books.create(req.body, (error, book) => {
        res.redirect('/index')
    })
    })
    

//UPDATE

app.put('/index/:indexNo', (req, res) => {   
    const book = data[req.params.indexNo]
    const remarksText = req.body.remarks
	book.remarks = '<p>' + remarksText.replace(/\n/g, "</p>\n<p>") + '</p>'
	res.redirect('/index/'); //redirect to the index page
})

app.get('/index/:indexNo/edit', (req, res) => {
    res.render('edit.ejs', {
        indexNo: req.params.indexNo,
        book: data[req.params.indexNo],
        
    })
})

//DELETE

app.delete('/index/:indexNo', (req, res) => {
    data.splice(req.params.indexNo, 1); 
    res.redirect('/index');
})

app.listen(process.env.PORT, () => {
    console.log ("biblioteca on port 3000")
})



