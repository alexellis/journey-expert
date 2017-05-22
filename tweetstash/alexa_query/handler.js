"use strict"

const request = require('request');
const sampleResponse = require("./response.json");

let handler = (req, callback) => {
  let res = sampleResponse;


  callback(JSON.stringify(res));
};

module.exports = handler;
