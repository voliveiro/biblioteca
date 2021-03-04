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

/* NEW */ 
//add a new book

app.get ( '/:id/add', isAuthenticated, ( req , res ) => {
    User.findById( req.params.id , ( err , user ) => {
        if ( err ) { 
            console.log ( err ); 
        }
        console.log (user)
        res.render ( 'add.ejs' , { user : user }
    );
    });
});

/*CREATE*/ 

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


/*INDEX*/ 
// Show user catalogue 

app.get('/catalogue', isAuthenticated, (req,res) => {
    if(req.session.currentUser){
        Books.find( {owner: req.session.currentUser._id} , ( err , books ) => {
            if ( err ) { 
                console.log ( err ); 
            }
            res.render ( 'catalogue.ejs' , { 
                Books: books, 
                user: req.session.currentUser, 
            }
        );
        });
    }
})

/* SHOW */ 
// Show each book in user's catalogue

app.get('/catalogue/:bookID', isAuthenticated, (req,res) => {
    if(req.session.currentUser){
        Books.findById( req.params.bookID , ( err , book ) => {
            if ( err ) { 
                console.log ( err ); 
            }
            res.render ( 'showbook.ejs' , { 
                book: book, 
                bookid: req.params.bookid, 
                user: req.session.currentUser, 
            }
        );
        });
    }
})

/*UPDATE */ 

//edit book notes


app.get ( '/:bookID' , isAuthenticated, ( req , res ) => {
    Books.findById( req.params.bookID , ( err , book ) => {
        if ( err ) { 
            console.log ( err ); 
        }
        console.log (book)
        res.render ( 'editbook.ejs' , { 
            book : book,
            bookID: req.params.bookID,  
        }
    );
    });
});
    

app.put( '/:bookID' , ( req , res ) => {
    Books.findByIdAndUpdate( req.params.bookID, {$set: {notes: req.body.notes}}, ( err, book) => { 
        if ( err ) { 
            console.log( err ); 
        }
        console.log(book)
        res.redirect (`/app/catalogue/${req.params.bookID}` );
    });
    
    });

/*DESTROY */ 

// delete book

app.delete (  '/:bookID', isAuthenticated, ( req , res ) => {
    Books.findByIdAndRemove( req.params.bookID , ( err , book ) => {
        console.log(book)
        if ( err ) { 
          console.log( err ); 
        } 
        res.redirect ( '/app/catalogue' );
        
        
    });
  });



module.exports = app; 