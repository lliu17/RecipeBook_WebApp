const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://grandma:grandma123@cluster0.hdzif.mongodb.net/?retryWrites=true&w=majority";

// display search result
// router.get("/", (req, res) => { 
//     res.json(req.body);
//     res.end();
// });

// add new -> post request
router.post("/", (req, res) => {
    // note: valid input not checked here! should be checked in the form before submission
    const query = req.body.query;
    console.log("query = " + query);

    MongoClient.connect(url,  { useUnifiedTopology: true }, (errConnect, client) => {
        if (errConnect) return console.error(errConnect);
        else console.log("connected to db");

        const db = client.db("FamilyRecipe");
        const collection = db.collection("recipes");
        // search using regular expression - not exact match
        collection.find({"recipeName": new RegExp(query)}).toArray((errSearch, result) => 
        {
            if (errSearch) return console.error(errSearch);
            else {
                console.log("found " + result.length + " recipes.");
                res.json(result);
                // loop - return all search results
                // for (i = 0; i < result.length; i++) {
                //     console.log(result[i]);
                //     res.json()
                // }
            }
            client.close();
        });
    });
    //res.redirect("/search");
});

module.exports = router;