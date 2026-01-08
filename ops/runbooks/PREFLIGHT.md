# Preflight Runbook

**Purpose**: Verify system readiness before deployment

## Prerequisites
- [ ] GCP authentication configured (`gcloud auth list`)
- [ ] Node.js 18+ installed
- [ ] Docker installed and running
- [ ] GitHub CLI authenticated (`gh auth status`)

## Environment Variables
```bash
export GCP_PROJECT_ID="infinity-x-one-systems"
export GCP_REGION="us-east1"
export ENVIRONMENT="staging" # or "production"
```

## Checks

### 1. Code Quality
```bash
# Run linter
npm run lint

# Run tests
npm run test

# Build all packages
npm run build
```

### 2. Contract Verification
```bash
# Generate contract hash
cd packages/contracts
npm run generate-hash

# Verify OpenAPI spec is valid
npm run validate
```

### 3. Security Scan
```bash
# Check for secrets in code
git secrets --scan

# Audit dependencies
npm audit

# Check Docker image for vulnerabilities
docker scan infinity-xos-api:latest
```

### 4. Infrastructure
```bash
# Verify GCP project access
gcloud projects describe $GCP_PROJECT_ID

# Check Cloud Run services
gcloud run services list --region=$GCP_REGION

# Verify Secret Manager secrets exist
gcloud secrets list
```

### 5. Database
```bash
# Test Firestore connection
gcloud firestore databases describe --database=(default)

# Verify backup exists
# (Add backup verification command)
```

## Success Criteria
- ✅ All tests pass
- ✅ No lint errors
- ✅ Contract hash generated
- ✅ No security vulnerabilities (or documented exceptions)
- ✅ GCP access confirmed
- ✅ Secrets accessible

## On Failure
1. Document the failure
2. Create GitHub issue
3. DO NOT proceed to deployment
4. Notify team

## Next Step
After preflight passes → Run `./ops/scripts/deploy-staging.sh`
