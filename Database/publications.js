const mongoose = require("mongoose");

// define schema
const PublicationsSchema = {
    id: {
        type: Number,
        required: true
    },
    name: String,
    books: [String]
};

// create model
const PublicationsModel = mongoose.model("Publications", PublicationsSchema);

// export model
module.exports = PublicationsModel;