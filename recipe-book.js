var http = require('http');
var formurl = require('url');

http.createServer(function(req,res) {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('<h1>Database: Search for Recipes</h1>');
    //res.end();

		var qobj = formurl.parse(req.url, true).query,
			recipeName = qobj.recipeName,
			hours = qobj.hours,
			minutes = qobj.minutes,
			utensilsQuantities = qobj.numUtensils,
			utensils = qobj.utenstils,
			ingredientsQuantities = qobj.quanIngredients,
			units = qobj.units,
			ingredients = qobj.ingredients;

    	res.write("The new recipe name is: " + recipeName);

    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://elizabethhom1:vApsZzAxcQKwaQr1@cluster0.6krme.mongodb.net/?retryWrites=true&w=majority";

    MongoClient.connect(url, function(err, db) {
    	if (err) { return console.log(err); }

    	var dbo = db.db("recipebook");
    	var coll = dbo.collection('user1');

		// TODO - make conform w database, add "instructions" loop and "utensils" loops
    	coll.find().toArray(function(err, items) {
    		if (err) {
    			console.log("error: " + err);
    		} else {
    			for (var i = 0; i < items.length; i++) {
    				res.write("<h3>Recipe " + (i + 1) + "</h3>");
    				res.write("Recipe Name: " + items[i].name + "<br />");
    				res.write("Time Needed: " + items[i].duration + "<br />");
    				res.write("Ingredients: ");
    				for (var j = 0; j < items[i].ingredients.length; j++) {
    					res.write(items[i].ingredients[j]);
    					if (j != items[i].ingredients.length - 1) {
    						res.write(", ");
    					} else {
    						res.write("<br />");
    					}
    				}
    				res.write("Rating: " + items[i].rating);
    			}
    		}
    		//res.end();
    		//db.close();
    	})

    	var newRecipe = {};
    	newRecipe['name'] = recipeName;
    	newRecipe['duration'] = duration;
    	newRecipe['rating'] = rating;

    	coll.insertOne(newRecipe, function(err, res) {
    		if (err) { throw err; }
    		res.write("New recipe added!");
    	});

    	db.close();
    })
}).listen(8080);
