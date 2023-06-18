#!/bin/bash

PNPM_TMP_OWNER=$(stat -c '%U' /home/node/.local/share/pnpm/store/v3/tmp/)

if [ $PNPM_TMP_OWNER = "root" ]
then
	echo "PNPM has root folder permissions, setting store has node"
	sudo chown -R node:node ${DEV_HOME_DIR}/.local/share/pnpm/store
fi

pnpm install --frozen-lockfile

pnpx playwright install

pnpm run init
