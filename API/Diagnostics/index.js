// initialise router
const router = require("express").Router();

// models
const BookModel = require("../../database/books");
const AuthorModel = require("../../database/authors");
const PublicationModel = require("../../database/publications");

/*
Route           / diagnostics / database
Description     View full database
Access          PUBLIC
Parameters      NONE
Method          GET
*/
router.get("/database", async (req, res) => {
    res.json({
        "Books": await BookModel.find(),
        "Authors": await AuthorModel.find(),
        "Publications": await PublicationModel.find()
    });
});

// export
module.exports = router;