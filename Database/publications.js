const mongoose = require("mongoose");

// define schema
const PublicationsSchema = {
    id: Number,
    name: String,
    books: [String]
};

// create model
const PublicationsModel = mongoose.model("Publications", PublicationsSchema);

// export model
module.exports = PublicationsModel;