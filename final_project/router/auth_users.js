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
    const {username} = req.session.authorization || {}
    if(review){
        if(!book.reviews[username]){
            book.reviews[username] = review;
            return res.status(202).json({message: "Book Review updated for user: "+req.user.data+" review: "+review});
        }else{
            book.reviews[username] = review
            return res.status(202).json({message: "Book Review Added for user: "+req.user.data+" review: "+review});
        }
    }else{
        return res.status(401).json({message: "Bad Request.Review not provided"})
    }  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const {username} = req.session.authorization;
    const book = books[req.params.isbn]
    if(book.reviews[username]){
        book.reviews[username] = '';
        return res.status(200).json({message: "Review delete for user "+username})
    }else{
        return res.status(401).json({message: "User review does not exists"});
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
