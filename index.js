require("dotenv").config();
const express = require("express"); // import express
const booksAI = express(); // initialise express

// get database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection Established"));

// mircorservises routes
const books = require("./API/Book");
const authors = require("./API/Author");
const publications = require("./API/Publication");
const diagnostics = require("./API/Diagnostics");

// configurations
booksAI.use(express.json()); // use json data

// initialising microservices
booksAI.use("/books", books);
booksAI.use("/authors", authors);
booksAI.use("/publications", publications);
booksAI.use("/diagnostics", diagnostics);

// start server at port 3000
booksAI.listen(3000, () => console.log("Server is running at port: 3000"));