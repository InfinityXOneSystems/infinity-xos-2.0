*Saved at: 12/23/2025, 2:43:06 PM*

**[ADDED]**
```
150       parser = argparse.ArgumentParser()
151       parser.add_argument("--dry-run", action="store_true", help="Do not push, create PRs, or merge; only report")
152       args = parser.parse_args()
153       dry_run = args.dry_run
154   
```
**[REMOVED]**
```
(from line ~156)
    if not token:
        print("GITHUB_TOKEN required in env")

```
**[ADDED]**
```
156       if not token and not dry_run:
157           print("GITHUB_TOKEN required in env for non-dry-run")
```
**[REMOVED]**
```
(from line ~204)
            ensure_branch_and_push(subpath, branch, token)

```
**[ADDED]**
```
204               ensure_branch_and_push(subpath, branch, token, dry_run=dry_run)
```
**[REMOVED]**
```
(from line ~222)
        pr = create_pr(owner, repo, head=branch, base="main", title=title, body=body, token=token)

```
**[ADDED]**
```
222           pr = create_pr(owner, repo, head=branch, base="main", title=title, body=body, token=token, dry_run=dry_run)
```
**[REMOVED]**
```
(from line ~230)
            requests.post(comment_url, headers=headers, json=comment_body)

```
**[ADDED]**
```
230               if not dry_run:
231                   requests.post(comment_url, headers=headers, json=comment_body)
232               else:
233                   print(f"[dry-run] would comment on PR #{pr_number} in {owner}/{repo}")
```
**[REMOVED]**
```
(from line ~240)
            auto_approve_and_merge(owner, repo, pr_number, token)

```
**[ADDED]**
```
240               auto_approve_and_merge(owner, repo, pr_number, token, dry_run=dry_run)
```

---

### 📄 c:\AI\repos\infinity-xos\scripts\auto_pr_and_validate.py
*Saved at: 12/23/2025, 2:42:56 PM*

**[ADDED]**
```
10    import argparse
```
**[REMOVED]**
```
(from line ~62)
def ensure_branch_and_push(submodule_path, branch_name, token):

```
**[ADDED]**
```
62    def ensure_branch_and_push(submodule_path, branch_name, token, dry_run=False):
```
**[ADDED]**
```
72        if dry_run:
73            print(f"[dry-run] would set remote auth and push branch {branch_name} for {submodule_path}")
74            return
```
**[REMOVED]**
```
(from line ~105)
def create_pr(owner, repo, head, base, title, body, token):

```
**[ADDED]**
```
105   def create_pr(owner, repo, head, base, title, body, token, dry_run=False):
106       if dry_run:
107           print(f"[dry-run] would create PR {owner}/{repo} {head} -> {base} : {title}")
108           return {"number": None, "url": None}
```
**[REMOVED]**
```
(from line ~119)
def auto_approve_and_merge(owner, repo, pr_number, token):

```
**[ADDED]**
```
119   def auto_approve_and_merge(owner, repo, pr_number, token, dry_run=False):
120       if dry_run:
121           print(f"[dry-run] would approve and merge PR #{pr_number} in {owner}/{repo}")
122           return {}
```

---

### 📄 c:\AI\repos\infinity-xos\env\env.schema.md
*Saved at: 12/23/2025, 2:00:27 PM*

**[ADDED]**
```
2     
3     This file lists canonical secret IDs that should exist in Google Secret Manager.
4     One secret id per line. You may optionally map a secret to a submodule path using `->`.
5     
6     Examples:
7     
8     # DB_PASSWORD
9     # API_KEY -> services/real-estate-intelligence
10    
11    Add your project-wide secret IDs below (example entries):
12    DB_PASSWORD
13    API_KEY
14    GCP_SA_KEY
15    ## Env Variable Schema
```

---

### 📄 c:\AI\repos\infinity-xos\.github\workflows\auto_doc_sync.yml
*Saved at: 12/23/2025, 1:59:51 PM*

**[ADDED]**
```
35          - name: Authenticate to GCP
36            if: secrets.GCP_SA_KEY != ''
37            env:
38              GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}
39            run: |
40              echo "$GCP_SA_KEY" > /tmp/gcp_key.json
41              gcloud auth activate-service-account --key-file=/tmp/gcp_key.json
42              # set project if provided in secret JSON
43              python - <<'PY'
44    import json, os
45    try:
46        j=json.load(open('/tmp/gcp_key.json'))
47        if 'project_id' in j:
48            os.system(f"gcloud config set project {j['project_id']}")
49    except Exception:
50        pass
51    PY
52    
53          - name: Run secret sync (GCP Secret Manager)
54            env:
55              GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}
56              GCP_PROJECT: ${{ secrets.GCP_PROJECT }}
57            run: |
58              python scripts/secret_sync.py || true
59    
```
**[ADDED]**
```
63              AUTO_MERGE_PAT: ${{ secrets.AUTO_MERGE_PAT }}
```

---

### 📄 c:\AI\repos\infinity-xos\requirements.txt
*Saved at: 12/23/2025, 1:59:40 PM*

**[ADDED]**
```
15    google-cloud-secret-manager
16    google-auth
```

---

### 📄 c:\AI\repos\infinity-xos\scripts\secret_sync.py
*Saved at: 12/23/2025, 1:59:31 PM*

**[ADDED]**
```
1     #!/usr/bin/env python3
2     """Secret sync utility