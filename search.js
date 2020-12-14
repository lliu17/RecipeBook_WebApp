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
    var recipesToPrint = "<head><link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'><link rel='stylesheet' href='recipe-book.css'></head><body style='background-color: black;'><div class='search-results'><h1 style='text-align: center;'>Search Results</h1><ul class='nav-content' style='background-color: rgba(255, 255, 150, .5);'><li class='nav-li'><a href='index.html'>HOME</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='recipe-book.html'>CREATE</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='search.html'>SEARCH</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='about.html'>ABOUT US</a></li>&nbsp;&nbsp;&bull;&nbsp;<li class='nav-li'><a href='contact.html'>CONTACT</a></li></ul><div id='resultsDiv'>";
    var numRecipes = 1;
    var numUtensils = 1;
    var numIngred = 1;
    var numInstruc = 1;

    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            recipesToPrint += "<p class='recipeTitle'" + result[i].recipeName + ">Recipe " + numRecipes + ": " + result[i].recipeName + "</p>";
            recipesToPrint += "<p class='recipeContent'>Time: " + result[i].hours + " hours, " + result[i].minutes + " minutes</p>";
            recipesToPrint += "<p class='recipeContent'>Utensils:</p>";
            for (var j = 0; j < result[i].utensils.length; j++) {
                recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numUtensils + ". " + result[i].utensils[j] + "</p>";
                numUtensils++;
            }
            recipesToPrint += "<p class='recipeContent'>Ingredients:</p>";
            recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numIngred + ". " + result[i].ingredients + "</p>";
            // uncomment out once ingredients has been made an array
            // for (j = 0; j < result[i].ingredients.length; j++) {
            //     recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numIngred + ". " + result[i].ingredients[j] + "</p>";
            //     numIngred++;
            // }

            recipesToPrint += "<p class='recipeContent'>Instructions:</p>";
            for (j = 0;  j < result[i].instructions.length; j++) {
                recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numInstruc + ". " + result[i].instructions[j] + "</p>";
                numInstruc++;
            }
            
            //recipesToPrint += "<p class='recipeContent'>" + result[i].instructions + "</p>";

            numInstruc = 1;
            numIngred = 1;
            numUtensils = 1;
            numRecipes++;
        }
    } else {
        recipesToPrint += "<p>No recipes with those keywords were found in the database.</p>";
    }
    recipesToPrint += "</div></div></body>";
    res.write(recipesToPrint);
}

module.exports = router;