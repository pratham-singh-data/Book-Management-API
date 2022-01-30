// prefix = authors

// initisialise router
const router = require("express").Router();

// models
const AuthorModel = require("../../database/authors");

/*
Route           / authors
Description     Get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const reqAuth = await AuthorModel.findOne({
        id: id
    });

    if (!reqAuth) {
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
router.get("/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const reqAuths = await AuthorModel.find({
        books: isbn
    });

    if (reqAuths.length === 0) {
        return res.end("Sorry, This author is not associated with us.");
    }

    return res.json(reqAuths);
});

/*
Route           / authors / :id
Description     Update name of author by id
Access          PUBLIC
Parameters      id, name
Method          PUT
*/
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;

    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: id
    }, {
        name: name
    }, {
        new: true
    });

    if (!updatedAuthor) {
        return res.send("Sorry, no author updated");
    }

    return res.json(updatedAuthor);
});

/*
Route           / authors / new
Description     Add an author
Access          PUBLIC
Parameters      newAuthor
Method          POST
*/
router.post("/new", async (req, res) => {
    try {
        const newAuthor = req.body;
        await AuthorModel.create(newAuthor);
        return res.json({
            data: await AuthorModel.find(),
            message: "Update Successful"
        });
    } catch (error) {
        res.json({
            "error": error.message
        });
    }
});

/*
Route           / authors / delete/ :id
Description     Delete an author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    const deletedAuthor = await AuthorModel.findOneAndRemove({
        id: id
    });

    if (!deletedAuthor) {
        return res.send("No author deleted");
    }

    return res.json(deletedAuthor);
});

// exports
module.exports = router;