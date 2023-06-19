#!/bin/bash

API_DEV_PID=$(pgrep -f 'pnpm start:debug')

# If there is a api dev server already running, kill it.
if [ ! -z $API_DEV_PID ]
then
	kill $API_DEV_PID
fi

CLIENT_DEV_PID=$(pgrep -f 'vite\.js dev')

# If there is a vite dev server already running, kill it.
if [ ! -z $CLIENT_DEV_PID ]
then
	kill $CLIENT_DEV_PID
fi