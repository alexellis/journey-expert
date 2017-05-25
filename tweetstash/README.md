## Functions

* alexa_query	

Node.js skill which reads Tweet data / statistics from Elastic Search (ES)

* filter_string

Sanitizes strings for Alexa to read out - i.e. removing URLs

* incoming	

Entry-point for Tweets in JSON format, forwarded on to ES

## Supporting code

* elasticsearch

Holds a Docker stack for ElasticSearch and `streaming_forwarder` which listens to the Twitter streaming API and forwards these on to the `incoming` function.

## Instructions for use

* Deploy FaaS

* Deploy ES (included in repo)

This sits on the same network as the FaaS sample stack. (faas_functions)

* Use FaaS CLI to deploy function stack.

Build the functions

```
# faas-cli -action build -yaml ./stack.yaml
```

Then deploy them:

```
# faas-cli -action deploy -yaml ./stack.yaml
```

## Configure Alexa

Set up the phrases and intents for Alexa in your Alexa SDK page.
