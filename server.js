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

//edit a book 

app.get('/index/:indexNo/edit', (req, res) => {
    let indexNo = req.params.indexNo
    let book = data[indexNo];
    res.render('edit.ejs', {
        book: book,
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



