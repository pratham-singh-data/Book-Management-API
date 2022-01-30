// prefix = books

// initialise router
const router = require("express").Router();

//models
const BookModel = require("../../database/books");
const AuthorModel = require("../../database/authors");

/* 
Route           /books / author / : aid
Description     Get all books by a specified author
Access          PUBLIC
Parameters      num
Method          GET
*/
router.get("/author/:aid", async (req, res) => {
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
Route           /books
Description     Get all books
Access          PUBLIc
Parameters      NONE
Method          GET
*/
router.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(
        getAllBooks
    );
});


/* 
Route           /books/category/:category
Description     Get books based on category
Access          PUBLIC
Parameters      category
Method          GET
*/
router.get("/category/:category", async (req, res) => {
    const cat = req.params.category;
    const reqBook = await BookModel.find({
        category: cat
    });

    if (reqBook.length === 0) {
        return res.end("Sorry, No books are available");
    }

    return res.json({
        books: reqBook
    });
});

/* 
Route           /books/:num
Description     Get all specific books by ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
router.get("/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const getSpecificBook = await BookModel.findOne({
        isbn: isbn
    });

    if (!getSpecificBook) {
        return res.json({
            book: `Sorry, The book of ISBN:${isbn} is not available`
        });
    }

    return res.json({
        book: getSpecificBook
    });
});

/*
Route           / books / new
Description     Add a book
Access          PUBLIC
Parameters      newBook
Method          POST
*/
router.post("/new", async (req, res) => {
    try{
        const newBook = req.body;
        await BookModel.create(newBook);

        return res.json({
            data: await BookModel.find(),
            message: "Update Successful"
        });
    }
    catch(error){
        return res.json({"error": error.message});
    }
});

/*
Route           / books / update / title / :isbn
Description     Update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
router.put("/update/title/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const title = req.body.title;

    const updatedBook = await BookModel.findOneAndUpdate({
        isbn: isbn
    }, {
        title: title
    }, {
        new: true
    });

    if (!updatedBook) {
        return res.json("Sorry, that book is not available.");
    }

    return res.json(updatedBook);
});

/*
Route           / books / update / author / :isbn
Description     Update author of a book
Access          PUBLIC
Parameters      isbn, newAuthor
Method          PUT
*/
router.put("/update/author/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const newAuthor = req.body.author;

    // updated the book database
    const updatedBook = await BookModel.findOneAndUpdate({
        isbn: isbn
    }, {
        $addToSet: {
            authors: newAuthor
        }
    }, {
        new: true
    });

    // update the Author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: newAuthor
    }, {
        $addToSet: {
            books: isbn
        }
    }, {
        new: true
    });

    // message to user
    let retValue = {};

    if (!updatedBook) {
        retValue["Updated Book"] = "No Book Updated";
    } else {
        retValue["Updated Book"] = updatedBook;
    }

    if (!updatedAuthor) {
        retValue["Updated Author"] = "No Author Updated";
    } else {
        retValue["Updated Author"] = updatedAuthor;
    }

    return res.json(retValue);
});

/*
Route           / books / delete / author / :id
Description     Delete an author from a book
Access          PUBLIC
Parameters      isbn, id
Method          DELETE
*/
router.delete("/delete/author/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const id = req.body.id;

    // update book database
    const updatedBook = await BookModel.findOneAndUpdate({
        isbn: isbn
    }, {
        $pull: {
            authors: id
        }
    }, {
        new: true
    });

    // update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: id
    }, {
        $pull: {
            books: isbn
        }
    }, {
        new: true
    });

    // return result to the user
    let retValue = {};

    if (!updatedBook) {
        retValue["Updated Book"] = "No book to update";
    } else {
        retValue["Updated Book"] = updatedBook;
    }

    if (!updatedAuthor) {
        retValue["Updated Author"] = "No author to update";
    } else {
        retValue["Updated Author"] = updatedAuthor;
    }

    res.json(retValue);
});

/*
Route           / book / delete / full / :isbn
Description     Delete a book from the database
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
router.delete("/delete/full/:isbn", async (req, res) => {
    const isbn = req.params.isbn;

    const deletedBook = await BookModel.findOneAndRemove({
        isbn: isbn
    });

    if (!deletedBook) {
        return res.send("No book deleted");
    }

    return res.json(deletedBook);
});

// exports
module.exports = router;