"use strict"

const request = require('request');
const sampleResponse = require("./response.json");

let handler = (req, callback) => {
  let res = sampleResponse;
  let term = "tester";
  let rq = {
    uri: process.env.es_url,
    json: true
  };
  request.get(rq, (esErr, esRes, body) => {
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
          callback(JSON.stringify(res));
        }

      });
    }
  });

};

module.exports = handler;
