#!/usr/bin/env bash
http-server -h >/dev/null 2>&1 || { echo >&2 "Please install http-server. Install with 'npm install -g http-server'."; exit 1; }
http-server ./dev-resources -p5656