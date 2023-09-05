#!/bin/bash

CLIENT_DEV_PID=$(pgrep -f 'vite\.js dev' -d ' ')

# If there is a vite dev server already running, kill it.
if [ ! -z $CLIENT_DEV_PID ]
then
	kill $CLIENT_DEV_PID
fi

pnpm dev