const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "An error occurred during registration" });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Simulamos una llamada asíncrona
    const response = await axios.get('http://url-to-books-data');
    const books = response.data;

    return res.status(200).json(books);
  } catch (error) {
    console.error("Error retrieving book list:", error);
    return res.status(500).json({ message: "Error retrieving book list" });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://url-to-books-data/isbn/${isbn}`);
    const book = response.data;

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error retrieving book details:", error);
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(`http://url-to-books-data/author/${author}`);
    const booksByAuthor = response.data;

    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    console.error("Error retrieving books by author:", error);
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://url-to-books-data/title/${title}`);
    const booksByTitle = response.data;

    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    console.error("Error retrieving books by title:", error);
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
