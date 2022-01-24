const {
    response
} = require("express");
const express = require("express"); // import express
const booksAI = express(); // initialise express

// get database
const database = require("./Database/index");

// configurations
booksAI.use(express.json()); // use json data

/* 
Route           /
Description     Get all books
Access          PUBLIc
Parameters      NONE
Method          GET
*/
booksAI.get("/", (req, res) => {
    return res.json({
        books: database.books
    });
});

/* 
Route           /books/:num
Description     Get all specific books by ISBN
Access          PUBLIC
Parameters      num
Method          GET
*/
booksAI.get("/books/:num", (req, res) => {
    const id = req.params.num;
    const getSpecificBook = database.books.filter((book) => book.isbn == id);

    if (getSpecificBook.length === 0) {
        return res.json({
            book: `Sorry, The book of ISBN:${id} is not available`
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
booksAI.get("/books/author/:aid", (req, res) => {
    const aid = req.params.aid;
    const getSpecificBook = database.books.filter((book) => book.authors.includes(parseInt(aid)));

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
booksAI.get("/books/category/:category", (req, res) => {
    const cat = req.params.category;
    const reqBook = database.books.filter((book) => book.category.includes(cat));

    if (reqBook.length == 0) {
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
booksAI.get("/authors", (req, res) => {
    res.json({
        "Authors": database.authors
    });
});

/*
Route           / authors /: id
Description     Get author based on their ID
Access          PUBLIC
Parameters      id
Method          GET
*/
booksAI.get("/authors/:id", (req, res) => {
    const id = req.params.id;
    const reqAuth = database.authors.filter((author) => author.id == id);

    if (reqAuth.length == 0) {
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
booksAI.get("/authors/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reqAuths = database.authors.filter((author) => author.books.includes(isbn));

    if (reqAuths.length == 0) {
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
booksAI.get("/publications", (req, res) => {
    res.json(database.publications);
});

/*
Route           / publications / id / :id
Description     Get a specific publications
Access          PUBLIC
Parameters      id
Method          GET
*/
booksAI.get("/publications/id/:id", (req, res) => {
    const id = req.params.id;
    const reqPublication = database.publications.filter((pub) => pub.id == id);

    if (reqPublication.length == 0) {
        return res.end("Sorry, this publication is not associated wih us.");
    }

    return res.json(reqPublication);
});

/*
Route           / publications / isbn / :isbn
Description     Get a specific publications
Access          PUBLIC
Parameters      id
Method          GET
*/
booksAI.get("/publications/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reqPublication = database.publications.filter((pub) => pub.books.includes(isbn));

    if (reqPublication.length == 0) {
        return res.end("Sorry, this publication is not associated wih us.");
    }

    return res.json(reqPublication);
});


/*
Route           / books / new
Description     Add a book
Access          PUBLIC
Parameters      NONE
Method          POST
*/
booksAI.post("/books/new", (req, res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({
        data: database.books,
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
Parameters      isbn
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
        if(author.id == newAuthor){
            author.books.push(isbn);
        }
    });

    return res.json(database);
});

/*
Route           / author / :id
Description     Update name of author by id
Access          PUBLIC
Parameters      id
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
Parameters      id
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
Parameters      id
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
Parameters      NONE
Method          POST
*/
booksAI.post("/authors/new", (req, res) => {
    const newAuthor = req.body;
    database.authors.push(newAuthor);
    return res.json({
        data: database.authors,
        message: "Update Successful"
    });
});

/*
Route           / publications / new
Description     Add a new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
booksAI.post("/publications/new", (req, res) => {
    const newPublication = req.body;
    database.publications.push(newPublication);
    return res.json({
        data: database.publications,
        message: "Update Successful"
    });
});

// start server at port 3000
booksAI.listen(3000, () => console.log("Server is running at port 3000"));