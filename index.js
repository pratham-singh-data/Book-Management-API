require("dotenv").config();
const express = require("express"); // import express
const booksAI = express(); // initialise express

// get database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(() => console.log("connection established"));
const database = require("./Database/index");

//models
const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publications");


// configurations
booksAI.use(express.json()); // use json data

/* 
Route           /
Description     Get all books
Access          PUBLIc
Parameters      NONE
Method          GET
*/
booksAI.get("/", async(req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(
        getAllBooks
    );
});

/* 
Route           /books/:num
Description     Get all specific books by ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
booksAI.get("/books/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const getSpecificBook = await BookModel.findOne({isbn: isbn});

    if (! getSpecificBook) {
        return res.json({
            book: `Sorry, The book of ISBN:${isbn} is not available`
        });
    }

    return res.json({
        book: getSpecificBook
    });
});

/* 
Route           /books / author / : aid
Description     Get all books by a specified author
Access          PUBLIC
Parameters      num
Method          GET
*/
booksAI.get("/books/author/:aid", async(req, res) => {
    const aid = req.params.aid;
    const getSpecificBook = await BookModel.find({
        authors: aid
    });

    if (getSpecificBook.length === 0) {
        return res.json({
            book: `Sorry, This book is not available`
        });
    }

    return res.json({
        book: getSpecificBook
    });
});

/* 
Route           /books/category/:category
Description     Get books based on category
Access          PUBLIC
Parameters      category
Method          GET
*/
booksAI.get("/books/category/:category", async(req, res) => {
    const cat = req.params.category;
    const reqBook = await BookModel.find(
        {category: cat}
    );

    if (reqBook.length === 0) {
        return res.end("Sorry, No books are available");
    }

    return res.json({
        books: reqBook
    });
});


/*
Route           / authors
Description     Get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/
booksAI.get("/authors", async (req, res) => {
    res.json({
        "Authors": await AuthorModel.find()
    });
});

/*
Route           / authors /: id
Description     Get author based on their ID
Access          PUBLIC
Parameters      id
Method          GET
*/
booksAI.get("/authors/:id", async (req, res) => {
    const id = req.params.id;
    const reqAuth = await AuthorModel.findOne({id: id});

    if (! reqAuth) {
        return res.end("Sorry, this author is not associated with us");
    }

    return res.json(reqAuth);
});

/*
Route           / authors / isbn / : isbn
Description     Get author based on their book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
booksAI.get("/authors/isbn/:isbn", async(req, res) => {
    const isbn = req.params.isbn;
    const reqAuths = await AuthorModel.find({books: isbn});

    if (reqAuths.length === 0) {
        return res.end("Sorry, This author is not associated with us.");
    }

    return res.json(reqAuths);
});

/*
Route           / publications
Description     Get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
booksAI.get("/publications", async(req, res) => {
    res.json(await PublicationModel.find());
});

/*
Route           / publications / id / :id
Description     Get a specific publications
Access          PUBLIC
Parameters      id
Method          GET
*/
booksAI.get("/publications/id/:id", async(req, res) => {
    const id = req.params.id;
    const reqPublication = await PublicationModel.findOne({id : id});

    if (! reqPublication) {
        return res.end("Sorry, this publication is not associated wih us.");
    }

    return res.json(reqPublication);
});

/*
Route           / publications / isbn / :isbn
Description     Get a specific publications
Access          PUBLIC
Parameters      id, isbn
Method          GET
*/
booksAI.get("/publications/isbn/:isbn", async(req, res) => {
    const isbn = req.params.isbn;
    const reqPublication = await PublicationModel.find({books: isbn});

    if (reqPublication.length == 0) {
        return res.end("Sorry, this publication is not associated wih us.");
    }

    return res.json(reqPublication);
});


/*
Route           / books / new
Description     Add a book
Access          PUBLIC
Parameters      newBook
Method          POST
*/
booksAI.post("/books/new", async(req, res) => {
    const newBook = req.body;
    await BookModel.create(newBook);

    return res.json({
        data: await BookModel.find(),
        message: "Update Successful"
    });
});

/*
Route           / books / update / title / :isbn
Description     Update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
booksAI.put("/books/update/title/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const {
        title
    } = req.body;
    database.books.forEach((book) => {
        if (book.isbn == isbn) {
            book.title = title;
        }
    });

    return res.json(database.books);
});

/*
Route           / books / update / author / :isbn
Description     Update author of a book
Access          PUBLIC
Parameters      isbn, newAuthor
Method          PUT
*/
booksAI.put("/books/update/author/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const newAuthor = req.body.author;
    database.books.forEach((book) => {
        if (book.isbn == isbn) {
            book.authors.push(newAuthor);
        }
    });

    database.authors.forEach((author) => {
        if (author.id == newAuthor) {
            author.books.push(isbn);
        }
    });

    return res.json(database);
});

/*
Route           / author / :id
Description     Update name of author by id
Access          PUBLIC
Parameters      id, name
Method          PUT
*/
booksAI.put("/author/:id", (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    database.authors.forEach((author) => {
        if (author.id == id) {
            author.name = name;
        }
    });

    return res.json(database.authors);
});

/*
Route           / publication / :id
Description     Update name of publication by id
Access          PUBLIC
Parameters      id, name
Method          PUT
*/
booksAI.put("/publication/:id", (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    database.publications.forEach((pub) => {
        if (pub.id == id) {
            pub.name = name;
        }
    });

    return res.json(database.publications);
});

/*
Route           / publication / update / :id
Description     Add new book to a publication
Access          PUBLIC
Parameters      id, isbn
Method          PUT
*/
booksAI.put("/publication/update/:id", (req, res) => {
    const id = req.params.id;
    const isbn = req.body.isbn;
    database.publications.forEach((pub) => {
        if (pub.id == id) {
            pub.books.push(isbn);
        }
    });

    return res.json(database.publications);
});

/*
Route           / authors / new
Description     Add an author
Access          PUBLIC
Parameters      newAuthor
Method          POST
*/
booksAI.post("/authors/new", async(req, res) => {
    const newAuthor = req.body;
    await AuthorModel.create(newAuthor);
    return res.json({
        data: await AuthorModel.find(),
        message: "Update Successful"
    });
});

/*
Route           / publications / new
Description     Add a new publication
Access          PUBLIC
Parameters      newPublication
Method          POST
*/
booksAI.post("/publications/new", async(req, res) => {
    const newPublication = req.body;
    await PublicationModel.create(newPublication);

    return res.json({
        data: await PublicationModel.find(),
        message: "Update Successful"
    });
});


/*
Route           / books / delete / author / :id
Description     Delete an author from a book
Access          PUBLIC
Parameters      isbn, id
Method          DELETE
*/
booksAI.delete("/books/delete/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const id = req.body.id;

    // update book database
    database.books.forEach((book) => {
        if (book.isbn == isbn) {
            book.authors = book.authors.filter((author) => author != id);
        }
    });

    // update author database
    database.authors.forEach((author) => {
        if (author.id == id) {
            author.books = author.books.filter((book) => book != isbn);
        }
    });

    res.json(database);
});

/*
Route           / database
Description     View full database
Access          PUBLIC
Parameters      NONE
Method          GET
*/
booksAI.get("/database", async(req, res) => {
    res.json({
        "Books": await BookModel.find(),
        "Authors": await AuthorModel.find(),
        "Publications": await PublicationModel.find()
    });
});

/*
Route           / authors / delete/ :id
Description     Delete an author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
booksAI.delete("/authors/delete/:id", (req, res) => {
    const id = req.params.id;
    const remainingAuthors = database.authors.filter((author) => author.id != id);
    database.authors = remainingAuthors;
    res.json(database.authors);
});

/*
Route           / book / delete/ :isbn
Description     Delete a book from the database
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
booksAI.delete("/books/delete/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const remainingBooks = database.books.filter((book) => book.isbn != isbn);
    database.books = remainingBooks;
    res.json(database.books);
});

/*
Route           / publication / delete / book / :isbn
Description     Delete a book from a publication
Access          PUBLIC
Parameters      isbn, id
Method          DELETE
*/
booksAI.delete("/publication/delete/book/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const id = req.body.id;
    
    // remove book from publications database

    database.publications.forEach((publication) => {
        if(publication.id == id){
            publication.books = publication.books.filter((book) => book != isbn);
        }
    });

    // remove book from books database
    database.books.forEach((book) => {
        if(book.isbn == isbn){
            book.publication = 0; // 0 we are assuming means there is no recorded publication for this book
        }
    });

    res.json(database);
});

/*
Route           / publication / delete / :id
Description     Delete a publication
Access          PUBLIC
Parameters      id
Method          DELETE
*/
booksAI.delete("/publication/delete/:id", (req, res) => {
    // update publication database
    const id = req.params.id;
    database.publications = database.publications.filter((publication) => publication.id != id);

    // uopdate book database
    database.books.forEach((book)=>{
        if(book.publication == id){
            book.publication = 0;
        }
    });
    res.json(database);
});

// start server at port 3000
booksAI.listen(3000, () => console.log("Server is running at port 3000"));