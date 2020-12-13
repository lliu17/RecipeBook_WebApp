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

    var searchIn;   // check radio button to see if search for name or ingredients
    if (req.body.search == "name") {
        searchIn = "recipeName";
    }
    else {
        searchIn = "ingredients";
    }
    console.log("search in: " + searchIn);

    MongoClient.connect(url,  { useUnifiedTopology: true }, (errConnect, client) => {
        if (errConnect) return console.error(errConnect);
        else console.log("connected to db");

        const db = client.db("FamilyRecipe");
        const collection = db.collection("recipes");
        
        // search using regular expression - not exact match
        collection.find({[searchIn]: new RegExp(query)}).toArray((errSearch, result) => 
        {
            if (errSearch) return console.error(errSearch);
            else {
                // console.log(result);
                console.log("found " + result.length + " recipes.");
                
                // print all search results
                res.writeHead(200, {'Content-Type': 'text/html'});
                printItems(result, res);
            }
            client.close();
            res.end();
        });
    });
});

function printItems(result, res) {
    var recipesToPrint = "<body class='search-results'><h1>Search Results</h1><div id='resultsDiv'>";

    if (result.length > 0) {
        for (i=0; i<result.length; i++) {
            recipesToPrint += "<p id=" + result[i].recipeName + ">Recipe: " + result[i].recipeName + "</p><br>";
        }
    } else {
        recipesToPrint += "<p>No recipes with those keywords were found in the database.</p>";
    }
    recipesToPrint += "</div>";
    res.write(recipesToPrint);
}

module.exports = router;