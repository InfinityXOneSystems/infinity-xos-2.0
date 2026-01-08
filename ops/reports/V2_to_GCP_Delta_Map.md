# V2 → GCP Delta Map

**Purpose**: Map every V2 assumption to GCP-native replacement

---

## Hosting & Compute

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| Hostinger VPS | Cloud Run | Serverless, auto-scale, $0 idle |
| Railway | Cloud Run | Same benefits, GCP-native |
| Vercel | Firebase Hosting | Free tier, CDN, GitHub Actions |
| Kubernetes (K8s/GKE) | Cloud Run | Simpler, cheaper, no cluster management |
| Docker Compose (local) | Docker + Cloud Run | Same Docker images, deploy anywhere |

---

## Database & Storage

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| PostgreSQL (self-hosted) | Cloud SQL PostgreSQL | Managed, backups, HA |
| MongoDB | Firestore | Real-time, NoSQL, generous free tier |
| Redis (self-hosted) | Memorystore Redis | Managed, low-latency |
| Local file storage | Cloud Storage | Object storage, CDN integration |
| S3 (AWS) | Cloud Storage | GCP-native, same API (gsutil) |

---

## AI & ML

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| OpenAI API | Gemini API | Multimodal, cheaper, GCP credits |
| Anthropic Claude | Gemini API | Same capabilities, GCP-native |
| Ollama (local LLM) | Vertex AI + Ollama hybrid | Cloud for production, local for dev |
| Pinecone (vector DB) | Vertex AI Vector Search | GCP-native, integrated with Gemini |
| LangChain | Vertex AI + custom | GCP-native RAG, less overhead |

---

## Secrets & Config

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| .env files | Secret Manager | Versioned, IAM-controlled, audit logs |
| Vault (HashiCorp) | Secret Manager | GCP-native, simpler |
| Environment variables (hardcoded) | Secret Manager | Never commit secrets |

---

## CI/CD & Deployment

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| Jenkins | GitHub Actions | Free for public repos, GCP integration |
| GitLab CI | GitHub Actions | Already using GitHub |
| Manual deployment | Cloud Build + GitHub Actions | Automated, triggered on PR merge |
| SSH deploy scripts | Cloud Run deploy | `gcloud run deploy` one command |

---

## Monitoring & Logging

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| Grafana + Prometheus | Cloud Monitoring | GCP-native, no setup |
| ELK Stack | Cloud Logging | GCP-native, structured logs |
| Sentry (error tracking) | Cloud Error Reporting | GCP-native, free tier |
| Uptime Robot | Cloud Monitoring uptime checks | GCP-native |

---

## Networking & Domains

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| Cloudflare CDN | Firebase Hosting CDN | Built-in, global edge |
| Nginx reverse proxy | Firebase Hosting rewrites | Config-based, no server |
| Let's Encrypt (manual) | Firebase Hosting SSL | Automatic, free |
| Custom domain (Hostinger) | Firebase Hosting + Cloud Run | Easy DNS config |

---

## Queues & Scheduling

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| BullMQ (Redis queue) | Cloud Tasks | GCP-native, HTTP-based |
| Cron jobs (crontab) | Cloud Scheduler | GCP-native, managed |
| Celery (Python) | Cloud Tasks | Language-agnostic |

---

## Authentication & Authorization

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| Auth0 | Firebase Auth | GCP-native, free tier |
| Custom JWT | Firebase Auth + Custom Claims | Managed, secure |
| OAuth (self-hosted) | Firebase Auth OAuth | Pre-built providers |

---

## Backup & Disaster Recovery

| V2 Assumption | GCP Replacement | Rationale |
|---------------|-----------------|-----------|
| Manual backups | Firestore export to GCS | Automated, scheduled |
| pg_dump scripts | Cloud SQL automated backups | Point-in-time recovery |
| Local backup storage | Cloud Storage | Durable, geo-redundant |

---

## Cost Comparison (Estimated Monthly)

| V2 Stack | GCP Stack | Savings |
|----------|-----------|---------|
| Hostinger VPS: $20 | Cloud Run: $0-10 | $10-20 |
| Railway: $20 | Cloud Run: $0-10 | $10-20 |
| MongoDB Atlas: $57 | Firestore: $0-25 | $32-57 |
| Redis Cloud: $30 | Memorystore: $0-15 | $15-30 |
| OpenAI API: $100+ | Gemini API: $50+ | $50+ |
| **Total V2**: ~$227/mo | **Total GCP**: ~$50-100/mo | **$127-177/mo** |

---

## Migration Priorities

1. **Immediate** (blocking deployment):
   - Hostinger → Cloud Run
   - .env → Secret Manager
   - Manual deploy → GitHub Actions

2. **High** (performance/cost):
   - MongoDB → Firestore
   - OpenAI → Gemini
   - Redis → Memorystore

3. **Medium** (nice-to-have):
   - Grafana → Cloud Monitoring
   - Sentry → Cloud Error Reporting

4. **Low** (can defer):
   - Auth0 → Firebase Auth (if not using auth yet)
   - Celery → Cloud Tasks (if not using queues yet)

---

**Last Updated**: 2026-01-08
