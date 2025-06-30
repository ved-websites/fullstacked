#!/bin/sh

# =========================
# === Prisma Workaround ===
# =========================

pnpm run generate

pnpm run build:prisma:binaries

rm -r src

# ====================
# === DB Migration ===
# ====================

pnpx prisma migrate deploy

# =========================
# === Start Application ===
# =========================

pnpm run start:prod