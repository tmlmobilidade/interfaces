#!/bin/sh

echo "Starting cleanup..."

find . -type d \( -name "node_modules" -o -name ".next" -o -name "dist" -o -name ".turbo" -o -name "coverage" \) -prune -exec rm -rf {} +

find . -type f \( -name "package-lock.json" -o -name "pnpm-lock.yaml" \) -exec rm -f {} +

echo "Cleanup complete!"