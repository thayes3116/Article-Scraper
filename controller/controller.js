// Requiring comment and article models
var Comment = require("../model/comment.js");
var Article = require("../model/article.js");

var express = require("express");
var router = express.Router();

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

var website = "http://www.theonion.com"

router.get("/", function(req, res){
  res.render("main");
})

// A GET request to scrape the onion website
router.get("/scrape", function(req, res) {

  var scrapeArray = [];

  request(website, function(error, response, html) {

    if (error) {
    	throw error;
    }

    var $ = cheerio.load(html);
    
    //jQuery("article.summary").children("a.handler")
    $("article.summary").each(function(i, element) {

      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element).find('.headline a').text().trim();
       // $(this).children("a").attr("data-track-label");
      result.link = website + $(element).find('.headline a').attr("href").trim();
      
      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {

          scrapeArray.push(doc);

          // console.log(scrapeArray);        
        }
      });

    });
      
  res.render("main", {scrape:scrapeArray})
  });
  // Tell the browser that we finished scraping the text

});

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      //res.json(doc);
    }
  });
});

router.post("/articleSave/:_id", function(req, res){
 
  Article.findOneAndUpdate(
    {"_id": req.params._id}, 
    {$set:{"favorite": true}},
    function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          console.log("post favorite update article ",doc);
          
          res.redirect('/scrape');
        }
  });
  
  console.log("articlesave post route");

});

// Create a new note or replace an existing note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newComment = new Comment(req.body);

  // And save the new note the db
  newComment.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
          
          //res.send(doc);
        }
      });
    }
  });
});
// Export routes for server.js to use.
module.exports = router;