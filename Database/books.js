const mongoose = require("mongoose");

// create schema
const BooksSchema = mongoose.Schema({
    isbn: String,
    title: String,
    authors: [Number],
    languaage: String,
    pubdate: String,
    category: [String],
    publication: Number
});

// create model
const BookModel = mongoose.model("Books", BooksSchema);

module.exports = BookModel;