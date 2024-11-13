const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user)=>{
        return user.username === username && user.password == password
    })
    if(validUsers.length > 0){
        return true
    }else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
        if(authenticatedUser(username,password)){
            let accessToken = jwt.sign({
                data: password
            },'access',{ expiresIn: 60 * 60 })

            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
    }
);

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review
    const isbn = req.params.isbn
    const book = books[isbn]
    console.log("review ",review)
    console.log("book: ",book);
    console.log("req.user: ",req.user)
    if(review){
        book.review = {
            "user": req.user,
            "review":review
        }
    }
    
  return res.status(200).json({message: "Book Review Added"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
