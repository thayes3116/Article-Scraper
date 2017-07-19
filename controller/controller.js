// Requiring comment and article models
var Comment = require("../model/comment.js");
var Article = require("../model/article.js");
var express = require("express");
var router = express.Router();

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// A GET request to scrape the onion website
router.get("/scrape", function(req, res) {
  request("http://www.theonion.com/section/politics/", function(error, response, html) {
    
    var $ = cheerio.load(html);
    $("article.summary").each(function(i, element) {

      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").attr("data-track-label");
      result.link = $(this).children("a").attr("href");

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
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// Export routes for server.js to use.
module.exports = router;