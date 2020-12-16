const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const convert = require('convert-units')
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://grandma:grandma123@cluster0.hdzif.mongodb.net/?retryWrites=true&w=majority";

// add new -> post request
router.post("/", (req, res) => {
    // note: valid input not checked here! should be checked in the form before submission
    var query = req.body.query.toLowerCase();
    console.log("query = " + query);

    var searchIn;   // check radio button to see if search for name or ingredients
    if (req.body.search == "name") {
        searchIn = "recipeName";
    }
    else {
        searchIn = "ingredients";
        query = query.split(/[ ,]+/);
    }
    // make regular expression(s) for the query
    var RE = [];
    if (isArray(query)) {
        for (var i = 0; i < query.length; i++) {
            RE[i] = new RegExp(query[i]);
        }
    }
    else {
        RE[0] = new RegExp(query);
    }

    console.log("search in: " + searchIn);
    console.log("reg = " + RE);

    MongoClient.connect(url,  { useUnifiedTopology: true }, (errConnect, client) => {
        if (errConnect) return console.error(errConnect);
        else console.log("connected to db");

        const db = client.db("FamilyRecipe");
        const collection = db.collection("recipes");
        
        // search using regular expression - not exact match
        collection.find({[searchIn]: {$all: RE}}).toArray((errSearch, result) => 
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
    var recipesToPrint = "<head><link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'><link rel='stylesheet' href='recipe-book.css'></head><body style='background-color: #6495ED'><div class='search-results'><h1 style='text-align: center;'>Search Results</h1><ul class='nav-content' style='background-color: rgba(255, 255, 150, .5);'><li class='nav-li'><a href='index.html'>HOME</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='recipe-book.html'>CREATE</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='search.html'>SEARCH</a></li>&nbsp;&nbsp;&bull;&nbsp;&nbsp;<li class='nav-li'><a href='about.html'>ABOUT US</a></li>&nbsp;&nbsp;&bull;&nbsp;<li class='nav-li'><a href='contact.html'>CONTACT</a></li></ul><div id='resultsDiv'>";
    var numRecipes = 1;
    var numUtensils = 1;
    var numIngred = 1;
    var numInstruc = 1;

    if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
            recipesToPrint += "<p class='recipeTitle'" + result[i].recipeName + ">Recipe " + numRecipes + ": " + result[i].recipeName + "</p>";
            recipesToPrint += "<p class='recipeContent'>Time: " + result[i].hours + " hours, " + result[i].minutes + " minutes</p>";
            
            // add strings for utensils
            recipesToPrint += "<p class='recipeContent'>Utensils:</p>";
            if (isArray(result[i].utensils)) {
                for (var j = 0; j < result[i].utensils.length; j++) {
                        recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numUtensils + ". " + result[i].utensils[j] + "</p>";
                        numUtensils++;
                }
            }
            else if  (result[i].utensils.length == 0) {
                recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;No utensils needed.</p>";
            }
            else {
                recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;1. " + result[i].utensils + "</p>";
            }

            // add strings for ingredients
            recipesToPrint += "<p class='recipeContent'>Ingredients:</p>";
            if (isArray(result[i].ingredients)) {
                for (ingredI=0; ingredI<result[i].ingredients.length; ingredI++) {
                    recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;" + result[i].quanIngredient[ingredI] + " " + result[i].units[ingredI] + " " + result[i].ingredients[ingredI] + "</p>";
                }
            }
            else if  (result[i].ingredients.length == 0) {
                recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;No ingredients needed.</p>";
            }
            else {
                recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;" + result[i].quanIngredient + " " + result[i].units + " " + result[i].ingredients + "</p>"
            }
                            ;
             // add conversions
            //  console.log("testing convert: " + convert(1).from("cup").to("tsp"));
            //  recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp; (" 
            //                     + result[i].quanIngredient + " " + result[i].units + " = "
            //                     + ")";

            // recipesToPrint += '<input class="API_num_unit" type="text" name="" value="' + result[i].quanIngredient + '">';
            // // make selection menu
            // recipesToPrint += '<select name="API_units"> <option value="cups">cups</option><option value="oz">oz</option>'
            //                 + '<option value="tsp">tsp</option><option value="tbsp">tbsp</option><option value="lb">lb</option></select>';
            // // pre-select the default unit (the one originally used by the recipe)
            // // const displayUnit = document.getElementsByName("API_units");
            // // for (var u = 0; u < displayUnit.length; u++) {
            // //     if (displayUnit.options[u] == result[i].units) {
            // //         displayUnit.options[u].selected = true;
            // //         break;
            // //     }
            // // } 
            // recipesToPrint += "<span class='recipeContent'> of " + result[i].ingredients + "</p>";

            // recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numIngred + ". " + result[i].ingredients + "</p>";
            // uncomment out once ingredients has been made an array
            // for (j = 0; j < result[i].ingredients.length; j++) {
            //     recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numIngred + ". " + result[i].ingredients[j] + "</p>";
            //     numIngred++;
            // }

            // add strings for instructions
            recipesToPrint += "<p class='recipeContent'>Instructions:</p>";
            if (isArray(result[i].instructions)) {
                for (j = 0;  j < result[i].instructions.length; j++) {
                    recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numInstruc + ". " + result[i].instructions[j] + "</p>";
                    numInstruc++;
                }
            }
            else {
                recipesToPrint += "<p class='recipeContent'>&nbsp;&nbsp;&nbsp;" + numInstruc + ". " + result[i].instructions + "</p>";
            }

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

// checking if an object is an array
function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

module.exports = router;