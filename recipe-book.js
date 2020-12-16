const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const search = require("./search");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://grandma:grandma123@cluster0.hdzif.mongodb.net/?retryWrites=true&w=majority";

// display thank you message after submitting recipe (post action)
router.get("/", (req, res) => { 
    res.writeHead(200, {'Content-Type': 'text/html'});
    var text = "<head><link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'><link rel='stylesheet' href='recipe-book.css'></head><body style='background-color: #6495ED'><div class='search-results'><h1 style='text-align: center;'>Recipe Submitted!</h1><ul class='nav-content' style='background-color: rgba(255, 255, 150, .5);'><li class='nav-li'><a href='index.html'>HOME</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='recipe-book.html'>CREATE</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='search.html'>SEARCH</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='about.html'>ABOUT US</a></li>&nbsp;&nbsp;&bull;&nbsp;<li class='nav-li'><a href='contact.html'>CONTACT</a></li></ul><div id='recipeSubmittedDiv'>";
    text += "<h2>Thank you for submitting a recipe!</h2></br><a href='/recipe-book.html'>Add another recipe</a>'</div></body>";
    res.write(text);
    res.end();
});

// add new -> post request
router.post("/", (req, res) => {
    // note: valid input not checked here! should be checked in the form before submission
    const newRecipe = toLowerCase(req.body);
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

// change recipe name and ingredients to lower case during insertion
function toLowerCase(recipe) {
    recipe.recipeName = recipe.recipeName.toLowerCase(); 

    if (isArray(recipe.ingredients)) {
        for (j = 0; j < recipe.ingredients.length; j++) {
            recipe.ingredients[j] = recipe.ingredients[j].toLowerCase(); 
        }
    }
    else {
        recipe.ingredients = recipe.ingredients.toLowerCase(); 
    }
    return recipe;
}

// checking if an object is an array - duplicated from search.js bc I don't want to
// mess with exports, ideally should be just in one file then accessed through export
function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

module.exports = router;