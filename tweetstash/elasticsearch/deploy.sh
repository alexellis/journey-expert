#!/bin/bash

# Note 420 error means too many connections, give it a good 5-10mins before retrying.

docker stack deploy elas1 -c ./docker-compose.yml
