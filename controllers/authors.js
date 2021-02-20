const express = require('express');
const router = express.Router();
const Author = require('../models/authors.js');


router.get('/new', (req, res) => {
    res.render('authors/new.ejs');
});

router.post('/', (req, res) => {
    Author.create(req.body, (err, createdAuthor) => {
        res.redirect('/authors');
    });
});

router.get('/', (req, res) => {
    Author.find({}, (err, foundAuthors) => {
        res.render('authors/index.ejs', {
            authors: foundAuthors
        });
    });
});

router.get('/:id', (req, res)=>{
	Author.findById(req.params.id, (err, foundAuthor)=>{
		res.render('authors/show.ejs', {
			author: foundAuthor
		});
	});
});

router.delete('/:id', (req, res)=>{
	Author.findByIdAndRemove(req.params.id, ()=>{
		res.redirect('/authors');
	});
});
module.exports = router;