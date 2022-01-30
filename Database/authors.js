const mongoose = require("mongoose");

// define schema
const AuthorsSchema = {
    id: {
        type: Number,
        required: true
    },
    name: String,
    books: [String]
};

// create model
const AuthorsModel = mongoose.model("Authors", AuthorsSchema);

// export model
module.exports = AuthorsModel;