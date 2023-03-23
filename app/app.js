// Import express.js
const express = require("express");

// Create express app
var app = express();


app.set ('view engine', 'pug');
app.set ('views', './views');

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to useC
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.render("index");
});


//render static site


// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});