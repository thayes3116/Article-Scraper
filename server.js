var express = require("express");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");


// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));

// Import routes and give the server access to them.
var routes = require("./controller/controller.js");

app.use("/", routes);

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_1npw9w42:568hm9f4kq6q6873a5j3o78tr5@ds113063.mlab.com:13063/heroku_1npw9w42");
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