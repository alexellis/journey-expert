"use strict"

const request = require('request');
const sampleResponse = require("./response.json");

let handler = (val, callback) => {
  let req = JSON.parse(val);

  let term = process.env.term;

  if(req.request.intent.name == "CountIntent") {
    lookupStats(req, term, (err, res) => {
      return callback(JSON.stringify(res));
    });
  } else if(req.request.intent.name == "QueryIntent") {
    lookupTweet(req, term, (err, res) => {
      return callback(JSON.stringify(res));
    });
  }
};

let lookupStats = (req, term, callback) => {
  let res = sampleResponse;
  let latestUri = process.env.es_url+ "_search"

  let sinceToday = "now/d"; // rounds down to current day.

  let query = {
  "query": {
    "bool": {
      "should": {
        "term": { "text" : term }
      },
      "filter": {
        "range": { "@timestamp" : { "gte" : sinceToday}}
      },      
      "minimum_should_match" : 1,
      "boost" : 1.0
    }
  }
 };

 
  let rq = {
    uri: latestUri,
    json: true,
    body: query
  };

  request.get(rq, (esErr, esRes, body) => {
    if(esErr) {
      res.response.outputSpeech.text = "There was an error looking up Tweet data.";
      return callback(esErr, res);
    }
    let total = 0;

    if(body.hits && body.hits.total) {
      total = body.hits.total;
    }
    res.response.outputSpeech.text = "There have been " + total + " tweets about " + term + " today.";

    return callback(esErr, res);
  });
}

let lookupTweet = (req, term, callback) => {
  let res = sampleResponse;
  let latestUri = process.env.es_url+ "tweet/event/_search?q=text:"+term+"&sort=@timestamp:desc";

  let rq = {
    uri: latestUri,
    json: true
  };

  request.get(rq, (esErr, esRes, body) => {
    if(esErr) {
      res.response.outputSpeech.text = "There was an error looking up Tweet data.";
      return callback(esErr, res);
    }

    if(body.hits && body.hits.hits && body.hits.hits.length > 0) {
      let text = body.hits.hits[0]["_source"].text;
      var filter = {
        uri: process.env.filter_url,
        json: false,
        body: text
      };
     request.post(filter, (filterErr, filterRes, filteredText) => {     
      if(filterErr) {
          console.error(filterErr);
        } else {
          res.response.outputSpeech.text = filteredText;
          return callback(filterErr, res);
        }
      });
    }
  });
}

module.exports = handler;
