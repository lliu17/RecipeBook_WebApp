const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://grandma:grandma123@cluster0.hdzif.mongodb.net/?retryWrites=true&w=majority";

// display thank you message after post action
router.get("/", (req, res) => { 
    res.send("Thank you for submitting a recipe!");
});

// add new -> post request
router.post("/", (req, res) => {
    console.log("here");
    const newRecipe = {
        name: req.body.recipeName
    }

    if (!newRecipe.name) {  // bad request
        res.status(400).json({msg:"Please include a name"});    
    }
    else {
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
    }
});

module.exports = router;