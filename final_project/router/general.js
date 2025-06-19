const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// const doesExist = (username) => {
//   let userswithsamename = users.filter((user) => {
//     return user.username === username;
//   });
//   if (userswithsamename.length > 0) return true;
//   else return false;
// };

public_users.post("/register", (req, res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json("User Authenticated. You can login");
    } else {
      return res.status(404).json("User already exist");
    }
  } else {
    return res.status(404).json("Unable to register User");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get("/async" , async (req,res) =>
{
  try{
    const response = await axios.get("http://localhost:5000/");
    res.send(response.data);
  }
  catch(error)
  {
    res.status(500).send('Error Fetching Books')
  }

})

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify({ books }, null, 5));
  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get("/async/isbn/:isbn",async(req,res) =>
{
  const isbn = req.params.isbn;
  try{
  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`)
  res.send(response.data);
  }
  catch(err)
  {
    res.status(500).send('Error fetching book by ISBN')
  }
})


// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
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

public_users.get("/async/author/:author" , async(req,res) =>
{
  const author = req.params.author;
  try{
    const response = axios.get(`http://localhost:5000/author/${author}`)
    res.send(response.data);
  }
  catch(error)
  {
    res.status(500).send('Error fetching author')
  }
})

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
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


public_users.get("/async/title/:title" , async(req,res) =>
{
  const title = req.params.title;
  try{
    const response = axios.get(`http://localhost:5000/title/${title}`) ;
    res.send(response.data);
  }
  catch(err)
  {
    res.status(500).send('Error fetching book by title')
  }
})

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
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
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book Not Found for this ISBN" });
  }

  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
