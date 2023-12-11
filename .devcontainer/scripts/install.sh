#!/bin/bash

cwd="/home/node/workspace"

cd $cwd

# Setup shared aliases

cat $cwd/.devcontainer/files/.bashrc >> ~/.bashrc

# Prepare PNPM

PNPM_TMP_OWNER=$(stat -c '%U' /home/node/.local/share/pnpm/store/v3/tmp/)

if [ $PNPM_TMP_OWNER = "root" ]
then
	echo "PNPM has root folder permissions, setting store has node"
	sudo chown -R node:node ${DEV_HOME_DIR}/.local/share/pnpm/store
fi

# Install packages

pnpm install --frozen-lockfile

pnpm --silent dlx playwright install > /tmp/playwright-install.log & # Put in background to allow other things to resolve in parallel
playwrightInstallPID=$!

# Init Project

pnpm run --silent init

# Setup initial migration

cd $cwd/api

rm prisma/migrations/.gitignore 2> /dev/null

HAS_INIT_MIGRATION=$(ls -l prisma/migrations | grep '_initialize$')

if [[ -z $HAS_INIT_MIGRATION ]]
then
	read -p "Edit your Prisma Schema how you want it to be for the initial migration, then press enter here!"

	# Commented out until https://github.com/microsoft/vscode-remote-release/issues/8535 is fixed.
	# code --wait prisma/schema.prisma

	pnpm exec prisma migrate dev --skip-seed --skip-generate --name initialize
else
	echo 'Skipping Prisma migrate as this project has already been initialized ("_initialize" folder present in migrations folder)'
fi

# Restore Playwright install output before changing project names

tail --pid $playwrightInstallPID -n +1 -f /tmp/playwright-install.log
rm /tmp/playwright-install.log

# Setup Project Name

cd $cwd

pnpm run --silent init:name

# !--- If project renamed, nothing under here will be run. ---!
