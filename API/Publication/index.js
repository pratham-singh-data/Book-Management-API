// prefix = publications

// oinitialise router
const router = require("express").Router();

// models
const PublicationModel = require("../../database/publications");
const BookModel = require("../../database/books");

/*
Route           / publications
Description     Get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
router.get("/", async(req, res) => {
    res.json(await PublicationModel.find());
});

/*
Route           / publications / :id
Description     Get a specific publications
Access          PUBLIC
Parameters      id
Method          GET
*/
router.get("/:id", async(req, res) => {
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
router.get("/isbn/:isbn", async(req, res) => {
    const isbn = req.params.isbn;
    const reqPublication = await PublicationModel.find({books: isbn});

    if (reqPublication.length == 0) {
        return res.end("Sorry, this publication is not associated wih us.");
    }

    return res.json(reqPublication);
});

/*
Route           / publications / :id
Description     Update name of publication by id
Access          PUBLIC
Parameters      id, name
Method          PUT
*/
router.put("/:id", async(req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: id
    },{
        name: name
    },{
        new: true
    });

    if(! updatedPublication){
        return res.send("No publication updated");
    }

    return res.json(updatedPublication);
});

/*
Route           / publications / update / :id
Description     Add new book to a publication
Access          PUBLIC
Parameters      id, isbn
Method          PUT
*/
router.put("/update/:id", async(req, res) => {
    const id = req.params.id;
    const isbn = req.body.isbn;
    
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: id
    },{
        $addToSet:{
            books: isbn
        }
    },{
        new: true
    });

    if(! updatedPublication){
        return res.send("No publication updated");
    }

    return res.json(updatedPublication);
});

/*
Route           / publications / new
Description     Add a new publication
Access          PUBLIC
Parameters      newPublication
Method          POST
*/
router.post("/new", async(req, res) => {
    try{
        const newPublication = req.body;
        await PublicationModel.create(newPublication);

        return res.json({
            data: await PublicationModel.find(),
            message: "Update Successful"
        });
    }
    catch(error){
        res.json({"error": error.message});
    }
});

/*
Route           / publications / delete / book / :isbn
Description     Delete a book from a publication
Access          PUBLIC
Parameters      isbn, id
Method          DELETE
*/
router.delete("/delete/book/:isbn", async(req, res) => {
    const isbn = req.params.isbn;
    const id = req.body.id;
    
    // remove book from publications database
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: id
    },{
        $pull:{
            books: isbn
        }
    }, {
        new: true
    });

    // remove publication from books database
    const updatedBook = await BookModel.findOneAndUpdate({
        isbn: isbn
    }, {
        publication: 0
    }, {
        new: true
    });

    // return result
    let retRes = {};

    if(! updatedPublication){
        retRes["Updated Publication"] = "No Updated Publication";
    }
    else{
        retRes["Updated Publication"] = updatedPublication;
    }

    if (!updatedBook) {
        retRes["Updated Book"] = "No Updated Book";
    } else {
        retRes["Updated Book"] = updatedBook;
    }

    return res.json(retRes);
});

/*
Route           / publications / delete / :id
Description     Delete a publication
Access          PUBLIC
Parameters      id
Method          DELETE
*/
router.delete("/delete/:id", async(req, res) => {
    const id = req.params.id;

    // retreive books by this publication
    const reqPublication = await PublicationModel.findOne({id: id});
    const allBooks = reqPublication.books;

    // uopdate book database
    allBooks.forEach(async(isbn) => {
        await BookModel.findOneAndUpdate({
            isbn: isbn
        }, {
            publication: 0
        });
    });

    // remove publication
    await PublicationModel.findOneAndDelete({id: id});

    return res.send("Database Updated");
});

// exports
module.exports = router;