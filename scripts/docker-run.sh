#!/bin/bash

# Run the Docker container
docker run -d \
  --name ahe \
  -p 3000:3000 \
  --env-file .env \
  ahe 