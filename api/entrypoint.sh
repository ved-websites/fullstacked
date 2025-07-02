#!/bin/sh

# ====================
# === Prisma Setup ===
# ====================

PACKAGE_JSON_PATH="./package.json"

VERSION=$(grep "\"prisma\":" "$PACKAGE_JSON_PATH" | awk -F': "' '{print $2}' | awk -F'"' '{print $1}')

# Check if the version was found
if [ -z "$VERSION" ]; then
    echo "Error: Could not find version for prisma in $PACKAGE_JSON_PATH"
    exit 1
fi

# Clean up the version string (remove carets, tildes, etc.)
# This is important because dlx expects an exact version or a tag like 'latest'
VERSION=$(echo "$VERSION" | sed 's/[^0-9.]*//g')

# ====================
# === DB Migration ===
# ====================

pnpm dlx --silent "prisma@$VERSION" migrate deploy

# =========================
# === Start Application ===
# =========================

pnpm run start:prod