#!/bin/sh

# Run database migrations
pnpx prisma migrate deploy

# Start the application
pnpm run start:prod