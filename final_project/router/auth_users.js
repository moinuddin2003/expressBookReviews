const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const e = require("express");
const regd_users = express.Router();

let users = [];
//write code to check is the username is valid
const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error Logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password
      },
      'access',
      { expiresIn: 60*60 }
    );

    req.session.authorization = { 
      accessToken, username 
    };
    return res.status(200).send("User successfully logged in");
  } 
  else {
    return res
      .status(404)
      .json({ message: "Invalid Login Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn
  const review = req.query.review

  if(!books[isbn])
  {
    return res.status(404).json({message:'Book not found'})
  }
  const username = req.session.authorization.username;

  const alreadyReviewed = books[isbn].reviews.hasOwnProperty(username)

  books[isbn].reviews[username] = review;

  if(alreadyReviewed)
  { 
    return res.status(200).json({message: 'Review updated'})
  }
  else
  {
    return res.status(200).json({message: 'Review Added'})
  }


  // return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.delete("/auth/review/:isbn" , (req,res) =>
{
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  // const review = req.query.review;

  if(books[isbn].reviews[username])
  {
    delete books[isbn].reviews[username]
    return res.status(200).json({message: 'Review Deleted Successfully'})
  }
  else
  {
    return res.status(404).json({message:'Review Not Found'})
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

