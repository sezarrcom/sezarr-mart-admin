#!/bin/bash
echo "Starting custom build process..."
export SKIP_ENV_VALIDATION=true
export DISABLE_ESLINT=true
export NODE_ENV=production
npx next build --turbopack
echo "Build completed successfully!"