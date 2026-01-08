#!/bin/bash
set -euo pipefail

echo "=== Infinity XOS Preflight Check ==="

# Check GCP authentication
echo "Checking GCP authentication..."
gcloud auth list || echo "WARNING: GCP not authenticated"

# Check required tools
echo "Checking required tools..."
command -v node >/dev/null 2>&1 || { echo "ERROR: node not found"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "ERROR: npm not found"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "ERROR: docker not found"; exit 1; }

# Check environment
echo "Checking environment variables..."
[ -z "${GCP_PROJECT_ID:-}" ] && echo "WARNING: GCP_PROJECT_ID not set"

# Check dependencies
echo "Checking dependencies..."
npm ci --silent

# Run tests
echo "Running tests..."
npm run test

echo "✅ Preflight checks passed"
