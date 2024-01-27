#!/bin/sh
>&2 echo "Starting server..."
npm run start:$NODE_ENV
