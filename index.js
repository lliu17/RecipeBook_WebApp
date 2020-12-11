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
