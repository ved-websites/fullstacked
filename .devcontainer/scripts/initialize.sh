#!/bin/bash

DEV_PID=$(pgrep -f 'vite\.js dev')

# If there is a vite dev server already running, kill it.
if [ ! -z $DEV_PID ]
then
	kill $DEV_PID
fi