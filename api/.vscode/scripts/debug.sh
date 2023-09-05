#!/bin/bash

API_DEV_PID=$(pgrep -f 'pnpm start:debug' -d ' ')

# If there is a api dev server already running, kill it.
if [ ! -z $API_DEV_PID ]
then
	kill $API_DEV_PID
fi

pnpm start:debug