const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
  return res.status(400).json({message:"Bad Request. Username or password missing"});
});

let fetchBooksPromise = new Promise((resolve,reject)=>{
    if(books && Object.keys(books).length > 0){
        resolve(books)
    }else{
        reject("No books")
    }
})
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  fetchBooksPromise.then((books)=>{
      res.send(JSON.stringify(books))
  }).catch((err)=>{
    console.log(err)
  })
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  fetchBooksPromise.then((books)=>{
    const book = books[isbn]
    res.send(JSON.stringify(book))
    }).catch((err)=>{
        console.log(err)
    })
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  fetchBooksPromise.then((books)=>{
    const length = Object.keys(books).length;
    for(var i=1;i<=length;i++){
        var book = books[i]
        if(book.author === author){
            return res.status(200).json(book)
        }
    }
    }).catch((err)=>{
        console.log(err)
    })
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  fetchBooksPromise.then((books)=>{
        const length = Object.keys(books).length;
        for(var i=1;i<=length;i++){
            var book = books[i]
            if(book.title === title){
                return res.status(200).json(book)
            }
        }
    }).catch((err)=>{
        console.log(err)
    })
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn= req.params.isbn;
  const reviews = books[isbn].reviews;

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
