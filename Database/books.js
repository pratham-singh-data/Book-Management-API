const mongoose = require("mongoose");

// create schema
const BooksSchema = mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        minLength: 7, 
        maxLength: 14
    },
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