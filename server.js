require('dotenv').config(); 
const express = require('express'); 
const ejs = require('ejs');
const methodOverride = require('method-override');

const app = express()
const data = require('./modules/data.js')

/* Middleware */ 
app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({extended:false})); 
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    console.log ('Middleware'); 
    next();
})

//display data
app.get('/', (req, res) => {
    res.send(data)
})

app.get('/index', (req, res) => {
    res.render('index.ejs', {
        books: data,
    })
})

//show 

app.get('/index/:indexNo', (req,res) => {
    const book = data[req.params.indexNo]; 
    res.render('show.ejs', {
        books: data, 
        book: book,

    })
})

//routes to add a book

app.get('/new', (req, res) => {
    res.render('new.ejs')
})

app.post('/index', (req, res) => {
    data.push(req.body); 
    res.redirect('/index')
})

//update a book 

app.put('/index/:indexNo', (req, res) => {   
    const book = data[req.params.indexNo]
	book.remarks = req.body.remarks 
	res.redirect('/index/'); //redirect to the index page
})

app.get('/index/:indexNo/edit', (req, res) => {
    res.render('edit.ejs', {
        indexNo: req.params.indexNo,
        book: data[req.params.indexNo],
        
    })
})

//delete a book

app.delete('/index/:indexNo', (req, res) => {
    data.splice(req.params.indexNo, 1); 
    res.redirect('/index');
})

app.listen(process.env.PORT, () => {
    console.log ("biblioteca on port 3000")
})



