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
  request.get(rq, (httpRes, err, body) => {
    if(body.hits && body.hits.hits && body.hits.hits.length > 0) {
      res.response.outputSpeech.text = "We found this - " + body.hits.hits[0]["_source"].text;    
    }
    callback(JSON.stringify(res));
  });

};

module.exports = handler;
