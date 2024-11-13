const { public_users, fetchBooksPromise } = require('./general.js');

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    fetchBooksPromise
        .then((books) => {
            res.send(JSON.stringify(books));
        }).catch((error) => {
            console.log(error);
            res.status(500);
        });
});
