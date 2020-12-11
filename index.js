const express = require("express");
const path = require("path");
const handlebar = require("express-handlebars");

app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// body parser middleware
app.use(express.json());    // raw json
app.use(express.urlencoded({extended: false})); // form submission - url encoded data

// set static folder for html/css
app.use(express.static(path.join(__dirname, "public")));

// route: create recipe
app.use("/recipes", require("./recipe-book"));

// handlebars middleware
// app.engine("handlebars", handlebar({defaultLayout: "main"}));
// app.set("view engine", "handlebars");

// // render index on home /
// app.get("/", (req, res) => res.render("index")); 
// // or render can take 2nd param
// app.get("/", (req, res) => res.render("index", {    
//     title: "Member App",
//     members
// }));
