# Frontend ↔ Backend Contract Map

**Purpose**: Explicit wiring for every route

---

## Route: `/admin`

### Frontend
- **Component**: `apps/web/src/pages/Admin/index.tsx`
- **Sub-components**: `ContractPanel.tsx`
- **State**: Fetches backend version info

### Backend Endpoints
| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/version` | GET | Get contract hash + backend SHA | `{ version, contract_hash, backend_sha, deployed_at, environment }` |
| `/healthz` | GET | Health check | `{ status: "ok", timestamp }` |
| `/readyz` | GET | Readiness check | `{ status: "ready", timestamp }` |

### Data Models
```typescript
interface VersionInfo {
  version: string;
  contract_hash: string;
  backend_sha: string;
  deployed_at: string;
  environment: string;
}
```

### Missing Glue
- **Admin panels** (Services, GitHub, Autopilot, Vision Cortex) need backend endpoints:
  - `GET /admin/services` → List Cloud Run services
  - `GET /admin/github` → Repo + Actions status
  - `GET /admin/autopilot` → Autopilot status + controls
  - `GET /admin/vision-cortex` → Job runs + reports

---

## Route: `/onboarding`

### Frontend
- **Component**: `apps/web/src/pages/Onboarding/index.tsx` (NOT CREATED YET)
- **Flow**: 8-question wizard
- **State**: Stores answers locally, submits on completion

### Backend Endpoints
| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/vision-projects` | POST | Create vision project | `VisionProjectInput` | `VisionProject` |
| `/vision-projects/:id` | GET | Get project | - | `VisionProject` |
| `/vision-projects/:id` | PATCH | Update project | `Partial<VisionProjectInput>` | `VisionProject` |

### Data Models
```typescript
interface VisionProjectInput {
  preferredName: string;
  location: string;
  businessStatus: 'have' | 'want' | 'rebrand' | 'automate' | 'unsure';
  autonomyPreference: 'full_auto' | 'hybrid' | 'manual';
  problems: string;
  vision: string;
  wantAIPartner: boolean;
  notes?: string;
}

interface VisionProject extends VisionProjectInput {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'completed';
}
```

### Firestore Collection
- **Collection**: `visionProjects`
- **Document ID**: Auto-generated
- **Indexes**: `userId`, `createdAt`

### Missing Glue
- Backend endpoints NOT IMPLEMENTED
- Firestore schema NOT CREATED
- Frontend component NOT CREATED

---

## Route: `/problem-solver`

### Frontend
- **Component**: `apps/web/src/pages/ProblemSolver/index.tsx` (NOT CREATED YET)
- **Flow**: Structured input → AI generates roadmap

### Backend Endpoints
| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/problem-solver/analyze` | POST | Generate roadmap | `ProblemInput` | `ProblemSolution` |
| `/problem-solver/solutions/:id` | GET | Get saved solution | - | `ProblemSolution` |

### Data Models
```typescript
interface ProblemInput {
  visionProjectId: string;
  problemDescription: string;
  constraints?: string;
  goals?: string;
}

interface ProblemSolution {
  id: string;
  visionProjectId: string;
  problemDescription: string;
  roadmap: {
    phases: Array<{
      name: string;
      duration: string;
      steps: string[];
    }>;
  };
  actions: string[];
  createdAt: string;
}
```

### Missing Glue
- Backend endpoints NOT IMPLEMENTED
- AI integration (Gemini API) NOT WIRED
- Frontend component NOT CREATED

---

## Route: `/agent-builder`

### Frontend
- **Component**: `apps/web/src/pages/AgentBuilder/index.tsx` (NOT CREATED YET)
- **Flow**: Browse prebuilt agents OR create custom

### Backend Endpoints
| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/agents` | GET | List prebuilt agents | - | `Agent[]` |
| `/agents/:id` | GET | Get agent details | - | `Agent` |
| `/agents/custom` | POST | Create custom agent | `AgentInput` | `Agent` |
| `/agents/:id/launch-prompt` | GET | Generate launch prompt | - | `{ prompt: string }` |

### Data Models
```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  imageUrl?: string;
  config: Record<string, any>;
  isPrebuilt: boolean;
}

interface AgentInput {
  name: string;
  description: string;
  category: string;
  capabilities: string[];
}
```

### Firestore Collection
- **Collection**: `agents` (prebuilt)
- **Collection**: `customAgents` (user-created)

### Missing Glue
- Backend endpoints NOT IMPLEMENTED
- Prebuilt agent configs NOT CREATED (need 20-30 agents)
- Frontend component NOT CREATED

---

## Route: `/investor`

### Frontend
- **Component**: `apps/web/src/pages/Investor/index.tsx` (NOT CREATED YET)
- **Flow**: Access code → Fast onboarding → Demo → Evidence

### Backend Endpoints
| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/investor/verify-code` | POST | Verify access code | `{ code: string }` | `{ valid: boolean }` |
| `/investor/evidence-pack` | GET | Get evidence pack | - | `EvidencePack` |
| `/investor/demo-status` | GET | Get demo status | - | `DemoStatus` |

### Data Models
```typescript
interface EvidencePack {
  githubPRs: Array<{ number: number; title: string; url: string }>;
  deployedServices: Array<{ name: string; url: string; status: string }>;
  contractHash: string;
  lastDeployment: string;
  healthChecks: Record<string, boolean>;
}

interface DemoStatus {
  isRunning: boolean;
  currentStep?: string;
  progress?: number;
}
```

### Missing Glue
- Backend endpoints NOT IMPLEMENTED
- Access code storage (Secret Manager or Firestore)
- Voice avatar integration (placeholder only)
- Frontend component NOT CREATED

---

## Route: `/vision-project/:id`

### Frontend
- **Component**: `apps/web/src/pages/VisionProject/index.tsx` (NOT CREATED YET)
- **Flow**: Display answers → Checklist → Timeline → Action buttons

### Backend Endpoints
| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/vision-projects/:id` | GET | Get project | - | `VisionProject` |
| `/vision-projects/:id/checklist` | GET | Get checklist | - | `ChecklistItem[]` |
| `/vision-projects/:id/timeline` | GET | Get timeline | - | `TimelineEvent[]` |

### Data Models
```typescript
interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}
```

### Missing Glue
- Backend endpoints NOT IMPLEMENTED
- Checklist generation logic
- Timeline generation logic
- Frontend component NOT CREATED

---

## Summary: What's Missing

| Route | Frontend | Backend | Data Model | Firestore |
|-------|----------|---------|------------|-----------|
| `/admin` | ✅ Partial | ✅ Partial | ✅ | N/A |
| `/onboarding` | ❌ | ❌ | ✅ | ❌ |
| `/problem-solver` | ❌ | ❌ | ✅ | ❌ |
| `/agent-builder` | ❌ | ❌ | ✅ | ❌ |
| `/investor` | ❌ | ❌ | ✅ | ❌ |
| `/vision-project/:id` | ❌ | ❌ | ✅ | ❌ |

**Priority**: Implement `/onboarding` → `/agent-builder` → `/investor` → `/admin` panels

---

**Last Updated**: 2026-01-08
