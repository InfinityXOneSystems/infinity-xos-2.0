# Incident Response Runbook

**Purpose**: Handle production incidents systematically

## Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **P0** | Complete outage, data loss risk | Immediate |
| **P1** | Major feature broken, user impact | < 15 min |
| **P2** | Minor feature degraded | < 1 hour |
| **P3** | Cosmetic issue, no user impact | < 1 day |

## Incident Response Flow

### 1. Detect & Triage (0-5 min)
```bash
# Check system status
curl https://api.infinityxai.com/healthz
curl https://api.infinityxai.com/readyz

# Check admin panel
open https://infinityxai.com/admin

# View recent logs
gcloud logging tail "resource.type=cloud_run_revision" \
  --limit=100 \
  --format=json

# Check error rate
# (Add monitoring dashboard URL)
```

**Determine severity** and notify team via:
- P0/P1: Page on-call engineer
- P2/P3: Create GitHub issue

### 2. Contain (5-15 min)
**For P0/P1 incidents:**

```bash
# Option A: Rollback to last known good
./ops/scripts/rollback.sh production

# Option B: Enable maintenance mode
gcloud run services update infinity-xos-api \
  --set-env-vars MAINTENANCE_MODE=true \
  --region=us-east1

# Option C: Scale down if resource issue
gcloud run services update infinity-xos-api \
  --max-instances=10 \
  --region=us-east1
```

### 3. Diagnose (15-30 min)
```bash
# Collect evidence
mkdir -p /tmp/incident-$(date +%Y%m%d-%H%M%S)
cd /tmp/incident-*

# Export logs
gcloud logging read "resource.type=cloud_run_revision" \
  --limit=1000 \
  --format=json > logs.json

# Get service config
gcloud run services describe infinity-xos-api \
  --region=us-east1 \
  --format=yaml > service-config.yaml

# Check recent deployments
gcloud run revisions list \
  --service=infinity-xos-api \
  --region=us-east1 \
  --limit=5

# Database status
gcloud firestore operations list --limit=10
```

**Common Issues:**

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| 503 errors | Backend down | Check Cloud Run logs, restart |
| Contract mismatch | Deploy sync issue | Redeploy frontend or backend |
| Slow response | Database overload | Check Firestore metrics, add indexes |
| Memory errors | Memory leak | Restart service, investigate code |

### 4. Fix (30-60 min)
```bash
# If code fix needed:
git checkout -b hotfix/incident-description
# Make fix
git commit -m "fix: [P0] Description of fix"
git push origin hotfix/incident-description

# Create PR and merge (skip normal review for P0)
gh pr create --fill
gh pr merge --squash

# Deploy hotfix
./ops/scripts/deploy-prod.sh api
```

### 5. Verify (60-75 min)
```bash
# Run smoke tests
./ops/scripts/verify.sh production

# Check metrics returned to normal
# Monitor for 15 minutes

# Verify contract panel GREEN
curl https://infinityxai.com/admin
```

### 6. Document (75-90 min)
Create incident report:
```markdown
## Incident Report: [Title]

**Date**: YYYY-MM-DD HH:MM UTC
**Severity**: P0/P1/P2/P3
**Duration**: X minutes
**Impact**: [User-facing impact]

### Timeline
- HH:MM - Incident detected
- HH:MM - Team notified
- HH:MM - Rollback initiated
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Incident resolved

### Root Cause
[Technical explanation]

### Resolution
[What fixed it]

### Prevention
- [ ] Action item 1
- [ ] Action item 2

### Lessons Learned
[What we learned]
```

## Post-Incident
1. Schedule post-mortem (within 48 hours)
2. Update runbooks based on learnings
3. Implement prevention tasks
4. Update monitoring/alerting if gaps found

## Emergency Contacts
- On-call: [Add PagerDuty/phone]
- GCP Support: [Add support case URL]
- Team Slack: #infinity-xos-incidents
