# TASK LEDGER

**Strict checklist of remaining work**

---

## Phase 3: Product Vision Workflow

### 3.1 Onboarding Flow
- [ ] Create `/apps/web/src/pages/Onboarding/index.tsx`
- [ ] Implement 8-question flow (Step 1: Start Here, Step 2: Discovery)
- [ ] Questions: name, location, business status, autonomy preference, problems, vision, AI partner, notes
- [ ] Store answers in Firestore (`visionProjects` collection)
- [ ] Auto-create Vision Project after completion
- [ ] Add left menu navigation
- [ ] **Acceptance**: User can complete flow, data persists, project created

### 3.2 Vision Project Page
- [ ] Create `/apps/web/src/pages/VisionProject/index.tsx`
- [ ] Display captured answers from onboarding
- [ ] Interactive checklist UI
- [ ] Timeline stub
- [ ] Buttons: "Problem Solver" → "Agent Builder" → "Launch"
- [ ] **Acceptance**: Shows user's answers, buttons navigate correctly

### 3.3 Problem Solver
- [ ] Create `/apps/web/src/pages/ProblemSolver/index.tsx`
- [ ] Structured input form
- [ ] Generate roadmap + steps + actions (AI-powered)
- [ ] Store artifacts in Firestore
- [ ] Link to docs placeholders
- [ ] **Acceptance**: User can input problem, get roadmap, data persists

### 3.4 Agent Builder
- [ ] Create `/apps/web/src/pages/AgentBuilder/index.tsx`
- [ ] Display 20-30 prebuilt agents (config-driven)
- [ ] Agent cards with image placeholders
- [ ] "Create Custom Agent" button
- [ ] Generate "Launch Prompt" for selected agent
- [ ] Store agent config in Firestore
- [ ] **Acceptance**: User can browse agents, create custom, get launch prompt

### 3.5 Investor Page
- [ ] Create `/apps/web/src/pages/Investor/index.tsx`
- [ ] Access code gating (simple password check)
- [ ] Fast onboarding variant
- [ ] "Instant Demo" button
- [ ] Capability map display
- [ ] Evidence pack links
- [ ] Voice avatar placeholder + integration plan
- [ ] **Acceptance**: Access code works, demo flows, evidence accessible

### 3.6 Admin Panels
- [ ] **Services Panel**: List Cloud Run services, revisions, traffic splits
- [ ] **GitHub Panel**: Repo status, Actions status, recent PRs
- [ ] **Autopilot Panel**: Mode (on/off/safe), last run, next run, kill switch toggle
- [ ] **Vision Cortex Panel**: Job runs, last report, TAQ validation status
- [ ] **Acceptance**: Each panel shows real data from GCP/GitHub APIs

---

## Phase 4: GCP Deployment

### 4.1 Backend Deployment
- [ ] Create `ops/scripts/deploy-staging.sh`
- [ ] Build Docker image for API
- [ ] Push to Google Container Registry
- [ ] Deploy to Cloud Run (staging)
- [ ] Set environment variables (BACKEND_SHA, NODE_ENV=staging)
- [ ] Configure IAM for public access
- [ ] **Acceptance**: `curl https://api-staging.infinityxai.com/healthz` returns 200

### 4.2 Frontend Deployment
- [ ] Install Firebase CLI
- [ ] Create `firebase.json` config
- [ ] Build frontend with staging API URL
- [ ] Deploy to Firebase Hosting (staging)
- [ ] Configure rewrites for `/api` → Cloud Run
- [ ] **Acceptance**: https://staging.infinityxai.com loads, /admin shows contract panel

### 4.3 Custom Domain
- [ ] Configure Firebase Hosting custom domain (infinityxai.com)
- [ ] Configure Cloud Run custom domain (api.infinityxai.com)
- [ ] Update DNS records
- [ ] Verify SSL certificates
- [ ] **Acceptance**: https://infinityxai.com and https://api.infinityxai.com work

### 4.4 Autopilot Scheduling
- [ ] Create Cloud Scheduler job for autopilot-loop
- [ ] Set schedule (e.g., every 6 hours)
- [ ] Configure service account with GitHub + GCP permissions
- [ ] Test autopilot run manually
- [ ] **Acceptance**: Autopilot runs on schedule, creates PRs when issues detected

### 4.5 Monitoring
- [ ] Create Cloud Monitoring dashboard
- [ ] Add metrics: error rate, response time, request count
- [ ] Configure alerting policies (error rate > 5%, response time > 1s)
- [ ] Set up log-based metrics
- [ ] **Acceptance**: Dashboard shows metrics, alerts trigger on test failures

### 4.6 Production Deployment
- [ ] Run preflight checks
- [ ] Create production backup
- [ ] Deploy API to Cloud Run (production)
- [ ] Deploy frontend to Firebase Hosting (production)
- [ ] Run smoke tests
- [ ] Verify contract panel GREEN
- [ ] **Acceptance**: Production live, all health checks pass

---

## Phase 5: Security Hardening

### 5.1 IAM Configuration
- [ ] Document required IAM roles
- [ ] Create service accounts with least privilege
- [ ] Configure Cloud Run IAM (private where possible)
- [ ] Configure Secret Manager IAM
- [ ] **Acceptance**: IAM audit shows no overprivileged accounts

### 5.2 Admin RBAC
- [ ] Add `role` field to user model (owner/admin/viewer)
- [ ] Implement role checks in backend
- [ ] Restrict admin actions by role
- [ ] Add audit logging for admin actions
- [ ] **Acceptance**: Non-admins cannot access privileged endpoints

### 5.3 Rate Limiting
- [ ] Add rate limiting middleware to API
- [ ] Configure limits per endpoint
- [ ] Return 429 status on limit exceeded
- [ ] **Acceptance**: Rate limits enforced, tested with load tool

### 5.4 Security Scans
- [ ] Add `npm audit` to CI
- [ ] Add dependency scanning (Dependabot or Snyk)
- [ ] Add Docker image scanning
- [ ] Configure security alerts in GitHub
- [ ] **Acceptance**: CI fails on high/critical vulnerabilities

### 5.5 Rollback Rehearsal
- [ ] Deploy test change to staging
- [ ] Run `ops/scripts/rollback.sh staging`
- [ ] Verify rollback completes in < 5 minutes
- [ ] Document rollback time
- [ ] **Acceptance**: Rollback tested, documented, < 5 min

---

## Phase 6: Investor Polish

### 6.1 Evidence Pack
- [ ] Run `ops/scripts/generate-evidence-pack.sh`
- [ ] Take screenshots of /admin contract panel (GREEN)
- [ ] Take screenshots of deployed services
- [ ] Add screenshots to evidence pack
- [ ] **Acceptance**: Evidence pack complete with all proof points

### 6.2 Demo Script
- [ ] Write investor demo script (step-by-step)
- [ ] Practice demo flow
- [ ] Record demo video (optional)
- [ ] **Acceptance**: Demo script tested, < 10 minutes

### 6.3 Voice Avatar (Optional)
- [ ] Research voice avatar APIs (ElevenLabs, Play.ht)
- [ ] Create integration plan
- [ ] Add placeholder to investor page
- [ ] **Acceptance**: Integration plan documented

### 6.4 Performance Optimization
- [ ] Run Lighthouse audit
- [ ] Optimize bundle size (code splitting)
- [ ] Add caching headers
- [ ] Optimize images
- [ ] **Acceptance**: Lighthouse score > 90

### 6.5 SEO Baseline
- [ ] Add meta tags (title, description, OG tags)
- [ ] Add robots.txt
- [ ] Add sitemap.xml
- [ ] Configure Google Search Console
- [ ] **Acceptance**: SEO audit passes, site indexed

---

## Critical Path (Next 10 Actions)

1. Deploy API to Cloud Run staging
2. Deploy frontend to Firebase Hosting staging
3. Test `/admin` contract panel on staging
4. Create `/onboarding` page with 8-question flow
5. Implement Firestore persistence for Vision Projects
6. Create `/agent-builder` page with prebuilt agents
7. Create `/investor` page with access code
8. Expand admin panels (Services, GitHub, Autopilot)
9. Run evidence pack generator
10. Deploy to production

---

**Last Updated**: 2026-01-08
