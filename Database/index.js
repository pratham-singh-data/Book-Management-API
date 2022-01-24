const books = [
    {
        isbn: "ON23LS",
        title: "Getting Started With MERN",
        authors: [1, 2, 3],
        languaage: "en",
        pubdate: "2021-01-01",
        category: ["fiction", "programming", "tech", "web-dev"],
        publication: 1
    },

    {
        isbn: "ON23LN",
        title: "Getting Started With Google",
        authors: [2, 3],
        languaage: "fr",
        pubdate: "2021-01-02",
        category: ["programming", "tech", "web-dev"],
        publication: 2
    }
];

const authors = [
    {
        id: 1,
        name: "Pratham Singh",
        books: ["ON23LS"]
    },

    {
        id: 2,
        name: "Pavan Kumar",
        books: ["ON23LS", "ON23LN"]
    },

    {
        id: 3,
        name: "Nitin Garg",
        books: ["ON23LS", "ON23LN"]
    }
];

const publications = [
    {
        id: 1,
        name: "Chakra",
        books: ["ON23LS"]
    },

    {
        id: 2,
        name: "GNOME",
        books: ["ON23LN"]
    }
];

module.exports = {books, authors, publications};