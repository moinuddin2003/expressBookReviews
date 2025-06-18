const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify({ books }, null, 5));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).send("Book Not Found");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const author = req.params.author;
  let result = [];

  for (let key in books) {
    if (books[key].author === author) {
      result.push({
        id: key,
        AuthorName: books[key].author,
        title: books[key].title,
        reviews: books[key].reviews,
      });
    }
  }

  if (result.length > 0) {
    return res.status(200).json({ BookAuthor: result });
  } else {
    return res.status(404).json("Not Found");
  }

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

    const title = req.params.title;
  const result = [];

  for (let key in books) {
    if (books[key].title === title) {
      result.push({
        id: key,
        title: books[key].title,
        AuthorName: books[key].author,
        Reviews: books[key].reviews,
      });
    }
  }

  if (result.length > 0) {
    return res.status(200).json({ Finding_by_Title: result });
  } else {
    return res.status(404).json({ message: "Title Not Found" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
