"use strict"

let request = require('request');
let util = require('util')
var Twitter = require('twitter');
let config = require('/run/secrets/twitter_config.json');
let async = require('async');

// Inject @timestamp key for use with ElasticSearch 
let transform = (content) => {
  content["@timestamp"] = new Date(content["created_at"]).toISOString();
};
  
const max_file_ops = 5;

let track = (hashtag) => {

  var client = new Twitter(config.twitter);
  var stream = client.stream('statuses/filter', {track: hashtag});

  let write_queue = async.queue((task, done) => {

    transform(task.content);

    let rq = {
      uri: process.env.receiver_url,
      json: true,
      body: task.content
    };

    var posting = task.content.text +"\n @" + task.content.user.screen_name + " ("+task.content.user.location+") "+ task.content.user.lang;
    console.log(posting);
    
    request.post(rq, (err, result, body) => {

      if(err) {
        console.error(result.statusCode, result.headers, err);
      }

      done();
    });
  }, max_file_ops);
  
  console.log("Started, let's watch the hashtag #" + hashtag)
  console.log("Forwarding to: " + process.env.receiver_url);
  
  stream.on('data', (tweet) => {
     console.log(".");
     write_queue.push({content: tweet, id: tweet.id });
  });

  stream.on('error', function(e) {
     console.error(e);
     console.error(e.stack);
     process.exit(-1);
  });

};

if(process.argv.length != 3) {
  console.error("Specify a #hashtag.")
  return -1;
}

if(!process.env.receiver_url) {
  return console.error("Set env-var: 'receiver_url' for forwarding captured tweets.");
}

track(process.argv[2]);

