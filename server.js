var express = require("express");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));


 // set up handlebars for templating
app.engine("handlebars", exphbs({ defaultLayout: "index" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controller/controller.js");
app.use("/", routes);

const dbConnectString = process.env.MONGODB_URI || 
	process.env.MONGODB_URL || 
	"mongodb://localhost/scraper";	

//"mongodb://heroku_1npw9w42:568hm9f4kq6q6873a5j3o78tr5@ds113063.mlab.com:13063/heroku_1npw9w42";

// Database configuration with mongoose
mongoose.connect(dbConnectString);
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
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 3000!");
});