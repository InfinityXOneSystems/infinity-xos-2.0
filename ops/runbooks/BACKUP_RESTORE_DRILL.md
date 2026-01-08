# Backup & Restore Drill Runbook

**Purpose**: Practice disaster recovery to ensure backups work

**Frequency**: Monthly (first Monday of each month)

## Backup Strategy

### Firestore (Primary Database)
- **Automatic**: Daily exports to GCS
- **Retention**: 30 days
- **Location**: `gs://infinity-xos-backups/firestore/`

### Secrets (Secret Manager)
- **Automatic**: Versioned by GCP
- **Retention**: All versions kept
- **Location**: Secret Manager

### Code (GitHub)
- **Automatic**: Git history
- **Retention**: Infinite
- **Location**: github.com/InfinityXOneSystems

## Backup Drill Procedure

### 1. Create Test Backup
```bash
# Set variables
export GCP_PROJECT_ID=infinity-x-one-systems
export BACKUP_BUCKET=infinity-xos-backups
export BACKUP_DATE=$(date +%Y%m%d-%H%M%S)

# Export Firestore
gcloud firestore export gs://$BACKUP_BUCKET/drill-$BACKUP_DATE \
  --project=$GCP_PROJECT_ID

# Wait for completion
gcloud firestore operations list --limit=1

# Verify backup exists
gsutil ls gs://$BACKUP_BUCKET/drill-$BACKUP_DATE/
```

### 2. Create Isolated Test Environment
```bash
# Create test Firestore database
gcloud firestore databases create \
  --database=drill-$BACKUP_DATE \
  --location=us-east1 \
  --type=firestore-native

# Deploy test API instance
gcloud run deploy infinity-xos-api-drill \
  --image=gcr.io/$GCP_PROJECT_ID/infinity-xos-api:latest \
  --region=us-east1 \
  --set-env-vars FIRESTORE_DATABASE=drill-$BACKUP_DATE \
  --no-allow-unauthenticated
```

### 3. Restore Backup
```bash
# Import backup to test database
gcloud firestore import gs://$BACKUP_BUCKET/drill-$BACKUP_DATE \
  --database=drill-$BACKUP_DATE

# Wait for completion
gcloud firestore operations list --database=drill-$BACKUP_DATE --limit=1
```

### 4. Verify Restore
```bash
# Test API against restored data
curl https://infinity-xos-api-drill-*.run.app/healthz

# Verify data integrity
# (Add specific data verification queries)

# Check record counts match
# (Add Firestore query to count documents)
```

### 5. Cleanup
```bash
# Delete test database
gcloud firestore databases delete drill-$BACKUP_DATE

# Delete test Cloud Run service
gcloud run services delete infinity-xos-api-drill --region=us-east1

# Delete test backup
gsutil -m rm -r gs://$BACKUP_BUCKET/drill-$BACKUP_DATE/
```

## Production Restore Procedure

**⚠️ ONLY use in actual disaster scenario**

### Pre-Restore Checklist
- [ ] Incident severity confirmed as P0
- [ ] Current state documented
- [ ] Team notified
- [ ] Backup timestamp identified
- [ ] Restore plan reviewed

### Restore Steps
```bash
# 1. Enable maintenance mode
gcloud run services update infinity-xos-api \
  --set-env-vars MAINTENANCE_MODE=true \
  --region=us-east1

# 2. Create snapshot of current state (if possible)
gcloud firestore export gs://$BACKUP_BUCKET/pre-restore-$(date +%Y%m%d-%H%M%S)

# 3. Identify backup to restore
gsutil ls gs://$BACKUP_BUCKET/firestore/

# 4. Restore from backup
export RESTORE_BACKUP=gs://$BACKUP_BUCKET/firestore/YYYY-MM-DD-HHMMSS
gcloud firestore import $RESTORE_BACKUP

# 5. Verify restore
# (Run verification queries)

# 6. Disable maintenance mode
gcloud run services update infinity-xos-api \
  --remove-env-vars MAINTENANCE_MODE \
  --region=us-east1

# 7. Run smoke tests
./ops/scripts/verify.sh production
```

## Drill Success Criteria
- ✅ Backup created successfully
- ✅ Backup restored to test environment
- ✅ Data integrity verified
- ✅ Restore time < 30 minutes
- ✅ Test environment cleaned up
- ✅ Drill documented

## Drill Report Template
```markdown
## Backup Restore Drill Report

**Date**: YYYY-MM-DD
**Operator**: [Name]
**Backup Size**: X GB
**Restore Time**: X minutes

### Results
- [ ] Backup creation: PASS/FAIL
- [ ] Restore process: PASS/FAIL
- [ ] Data verification: PASS/FAIL
- [ ] Cleanup: PASS/FAIL

### Issues Found
[List any issues]

### Action Items
- [ ] Action 1
- [ ] Action 2

### Notes
[Additional observations]
```

## Backup Monitoring
```bash
# Check last backup time
gsutil ls -l gs://$BACKUP_BUCKET/firestore/ | tail -1

# Verify backup schedule
gcloud scheduler jobs describe firestore-backup

# Check backup size trends
gsutil du -sh gs://$BACKUP_BUCKET/firestore/*
```

## Recovery Time Objectives (RTO)
- **Target RTO**: 1 hour
- **Target RPO**: 24 hours (daily backups)

## Next Drill
Schedule next drill: **[First Monday of next month]**
