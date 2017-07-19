var express = require("express");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./model/Note.js");
var Article = require("./model/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});