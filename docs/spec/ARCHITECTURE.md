
This document provides an overview of the automated PR system architecture and workflow interactions.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                   infinity-matrix                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Pull Request Events                       │
│  • opened  • synchronize  • reopened  • labeled  • reviews  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────┴─────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Auto-Fix    │      │ Auto-Resolve │      │ Auto-Merge   │
│  Workflow    │      │  Workflow    │      │  Workflow    │
└──────────────┘      └──────────────┘      └──────────────┘
```

## Workflow Components

### 1. Auto-Fix Workflow

```
Pull Request Event (opened/synchronize/reopened)
    │
    ▼
Checkout code from PR branch
    │
    ▼
Setup Python 3.11
    │
    ▼
Install formatting tools
(Black, isort, autopep8)
    │
    ▼
Apply formatters
    ├─→ Black formatter
    ├─→ isort
    ├─→ autopep8
    ├─→ Fix whitespace
    └─→ Fix line endings
    │
    ▼
Check for changes
    │
    ├─→ No changes: Exit
    │
    └─→ Changes detected
        │
        ▼
    Commit & Push fixes
        │
        ▼
    Comment on PR
    (✅ Auto-fix applied)
```

### 2. Auto-Resolve Workflow

```
Pull Request Event (opened/synchronize/reopened)
    │
    ▼
Checkout code from PR branch
    │
    ▼
Fetch base branch
    │
    ▼
Check for merge conflicts
    │
    ├─→ No conflicts
    │   │
    │   └─→ Add ready-to-merge label
    │       │
    │       └─→ Exit
    │
    └─→ Conflicts detected
        │
        ▼
    Attempt auto-resolution
    (merge with -X theirs)
        │
        ├─→ Resolution failed
        │   │
        │   └─→ Comment: Manual intervention needed
        │
        └─→ Resolution successful
            │
            ▼
        Run validation checks
            │
            ▼
        Commit & Push resolution
            │
            ▼
        Add ready-to-merge label
            │
            ▼
        Comment: ✅ Conflicts resolved
```

### 3. Auto-Merge Workflow
```
Pull Request Event
(PR update / Review / Check completion)
    │
    ▼
Get PR details
    │
    ▼
Check merge criteria
    │
    ├─→ Is draft? ──Yes──→ Exit
    │
    ├─→ Has conflicts? ──Yes──→ Exit
    │
    ├─→ Has blocking labels? ──Yes──→ Exit
    │   (wip, do-not-merge, needs-review)
    │
    ├─→ Checks failed? ──Yes──→ Exit
    │
    ├─→ Checks running? ──Yes──→ Exit
    │
    ├─→ Changes requested? ──Yes──→ Exit
    │
    └─→ All criteria met
        │
        ▼
    Merge PR (squash)
        │
        ├─→ Merge failed
        │   │
        │   └─→ Comment: ⚠️ Auto-merge failed
        │
        └─→ Merge successful
            │
            └─→ Comment: ✅ Auto-merged
```