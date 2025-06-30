#!/bin/sh

# =========================
# === Prisma Workaround ===
# =========================

pnpm exec prisma generate

rm -r /app/dist/_generated/prisma

mv /app/src/_generated/prisma /app/dist/_generated/prisma

rm -r /app/src

# ====================
# === DB Migration ===
# ====================

pnpx prisma migrate deploy

# =========================
# === Start Application ===
# =========================

pnpm run start:prod