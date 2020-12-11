const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://grandma:grandma123@cluster0.hdzif.mongodb.net/?retryWrites=true&w=majority";

// display thank you message after submitting recipe (post action)
router.get("/", (req, res) => { 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("Thank you for submitting a recipe!<br>");
    res.write('<a href="/recipe-book.html">Add another recipe</a>');
    res.end();
});

// add new -> post request
router.post("/", (req, res) => {
    // note: valid input not checked here! should be checked in the form before submission
    const newRecipe = req.body;
    console.log(newRecipe);

    MongoClient.connect(url,  { useUnifiedTopology: true }, (err, client) => {
        if (err) return console.error(err);
        else console.log("connected to db");

        const db = client.db("FamilyRecipe");
        const collection = db.collection("recipes");
        collection.insertOne(newRecipe, (err, res) => 
        {
            if (err) return console.error(err);
            else console.log(`data inserted: ${res.insertedCount} rows`);
            client.close();
        });
    });
    res.redirect("/recipes");
});

module.exports = router;