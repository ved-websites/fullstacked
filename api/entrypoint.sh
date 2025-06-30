#!/bin/sh

# ====================
# === Prisma Setup ===
# ====================

PACKAGE_JSON_PATH="./package.json"

VERSION=$(jq -r ".dependencies.\"prisma\" // .devDependencies.\"prisma\"" "$PACKAGE_JSON_PATH")

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

pnpm dlx "prisma@$VERSION" migrate deploy

# =========================
# === Start Application ===
# =========================

pnpm run start:prod