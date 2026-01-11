# GitHub Governance Setup

**Purpose**: Branch protection + CI enforcement

---

## Branch Protection (Main)

### Via GitHub Web UI

1. Go to: https://github.com/InfinityXOneSystems/infinity-xos-2.0/settings/branches
2. Click "Add branch protection rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass before merging
     - Add status check: `CI` (from .github/workflows/ci.yml)
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings
   - ✅ Restrict who can push to matching branches (Admins only)
5. Save changes

### Via GitHub CLI (if permissions allow)

```bash
gh api repos/InfinityXOneSystems/infinity-xos-2.0/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

---

## Actions Permissions

### Enable GitHub Actions

1. Go to: https://github.com/InfinityXOneSystems/infinity-xos-2.0/settings/actions
2. Under "Actions permissions":
   - Select: ✅ Allow all actions and reusable workflows
3. Under "Workflow permissions":
   - Select: ✅ Read and write permissions
   - Enable: ✅ Allow GitHub Actions to create and approve pull requests
4. Save

### Organization Settings (if blocked)

1. Go to: https://github.com/organizations/InfinityXOneSystems/settings/actions
2. Under "Policies":
   - Select: ✅ Allow all actions and reusable workflows
3. Under "Workflow permissions":
   - Select: ✅ Read and write permissions
4. Save

---

## Secrets Setup

### Required Secrets

Add these at: https://github.com/InfinityXOneSystems/infinity-xos-2.0/settings/secrets/actions

| Secret Name | Value Source | Purpose |
|-------------|--------------|---------|
| `GCP_PROJECT_ID` | `infinity-x-one-systems` | GCP project |
| `GCP_SA_KEY` | Service account JSON | Cloud Run deploy |
| `FIREBASE_TOKEN` | `firebase login:ci` | Firebase deploy |

### Add Secret via CLI

```bash
gh secret set GCP_PROJECT_ID --body "infinity-x-one-systems"
gh secret set GCP_SA_KEY --body "$(cat /path/to/service-account.json)"
gh secret set FIREBASE_TOKEN --body "$(firebase login:ci)"
```

---

## Verification

```bash
# Check branch protection
gh api repos/InfinityXOneSystems/infinity-xos-2.0/branches/main/protection

# Check Actions status
gh api repos/InfinityXOneSystems/infinity-xos-2.0/actions/permissions

# List secrets (names only)
gh secret list
```

---

**Last Updated**: 2026-01-08
