# Launch Runbook

**Purpose**: Deploy to production safely

## Pre-Launch Checklist
- [ ] Preflight checks passed
- [ ] Staging deployment successful
- [ ] Staging smoke tests passed
- [ ] Contract hashes match (frontend + backend)
- [ ] Rollback plan documented
- [ ] Team notified of launch window

## Launch Steps

### 1. Final Verification
```bash
# Verify staging is healthy
curl https://api-staging.infinityxai.com/healthz
curl https://api-staging.infinityxai.com/version

# Check contract sync
curl https://infinityxai.com/admin
# Verify GREEN "MIRROR SYNCED" status
```

### 2. Database Backup
```bash
# Create production backup
gcloud firestore export gs://infinity-xos-backups/$(date +%Y%m%d-%H%M%S)

# Verify backup completed
gsutil ls gs://infinity-xos-backups/
```

### 3. Deploy Backend
```bash
# Set production environment
export ENVIRONMENT=production
export GCP_PROJECT_ID=infinity-x-one-systems
export GCP_REGION=us-east1

# Deploy API to Cloud Run
./ops/scripts/deploy-prod.sh api

# Wait for deployment
gcloud run services describe infinity-xos-api \
  --region=$GCP_REGION \
  --format='value(status.url)'
```

### 4. Deploy Frontend
```bash
# Build frontend with production config
cd apps/web
VITE_API_URL=https://api.infinityxai.com npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting --project infinity-x-one-systems
```

### 5. Smoke Tests
```bash
# Test production endpoints
./ops/scripts/verify.sh production

# Expected outputs:
# ✅ /healthz returns 200
# ✅ /readyz returns 200
# ✅ /version returns correct contract_hash
# ✅ Frontend loads
# ✅ /admin shows GREEN sync status
```

### 6. Traffic Migration
```bash
# If using gradual rollout:
gcloud run services update-traffic infinity-xos-api \
  --to-latest=10 \
  --region=$GCP_REGION

# Monitor for 5 minutes, then:
gcloud run services update-traffic infinity-xos-api \
  --to-latest=100 \
  --region=$GCP_REGION
```

### 7. Post-Launch Monitoring
```bash
# Watch logs
gcloud logging tail "resource.type=cloud_run_revision" --limit=50

# Check error rate
# (Add monitoring dashboard URL)

# Verify metrics
# (Add metrics dashboard URL)
```

## Success Criteria
- ✅ All smoke tests pass
- ✅ Error rate < 0.1%
- ✅ Response time < 500ms p95
- ✅ No critical alerts
- ✅ Contract panel shows GREEN

## Rollback Procedure
If ANY check fails:
```bash
# Immediate rollback
./ops/scripts/rollback.sh production

# Restore database if needed
# (See BACKUP_RESTORE_DRILL.md)
```

## Post-Launch
1. Update status page
2. Notify team of successful launch
3. Monitor for 24 hours
4. Document any issues
5. Schedule post-mortem if needed
