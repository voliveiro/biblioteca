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
| New          | /sessions/new | GET       | new session |
| New          | /:id/add      | GET       | form to add new book |
| Create       | /users        | POST      | Create new user |
| Create       | /sessions     | POST      | Create new session |
| Create       | /app/ho       | POST      | Create new book |
| Show         | /app/catalogue| GET       | Show catalogue |
| Show         | /app/catalogue/:id| GET   | Show each book |
| Edit         | /app/:bookID  | GET       | Edit book notes form|
| Update       | /app/:bookID  | PUT       | Update book notes |
| Destroy      | /sessions     | DELETE    | End session |
| Destroy      | /app/:bookID  | DELETE    | Delete book |

### Further Development 

I would like to add three additional features 
- Manage user profile (e.g. change username, delete profile), 
- Improve the Book Schema to allow users to connect books to other relevant books (possibly by adding a field with an array of linked bookIDs)
- Ability to search the catalogue 


