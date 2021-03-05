# Bookworm
### An application to help readers manage their home libraries 
### https://vbiblioteca.herokuapp.com/

### Built Using: 
- Express
- EJS
- Method-Override
- bcrypt 
- Express-Sessions 
- MongoDB 
- FlexBox 
- NYT Developers Books API: https://developer.nytimes.com/docs/books-product/1/overview

### Approach 

Bookworm is built on two models: Users (for users) and Books (for books). The schema for Books includes each book's title, author, notes (created by the user), and the owner - i.e., the User's ID. 

I'd started by adopting a one-model approach that was seemingly simpler - just have one User model, and store each User's books as an array of objects. However, this manipulating book data (e.g. editing book notes, and deleting books) more complicated. 

### Routes 

| Route        | URL           | HTTP Verb | Description |
|:-----------: |:-------------:|:---------:|:-----------:|
| Index        | /             | GET       | Sign Up/ Login |
| Index        | /             | GET       | Suggested Reads |
| Index        | /app/home     | GET       | Main library page |
| New          | /users/new    | GET       | form to add new user |
| New          | /:id/add      | GET       | form to add new book |





