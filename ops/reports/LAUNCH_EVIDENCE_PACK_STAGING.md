# Staging Launch Evidence Pack

**Date:** 2026-01-08
**Author:** Manus AI
**Repository:** [InfinityXOneSystems/infinity-xos-2.0](https://github.com/InfinityXOneSystems/infinity-xos-2.0)

## 1. Overview

This document provides evidence of the successful deployment of the `infinity-xos-2.0` application to the staging environment. The deployment was performed via a new GitHub Actions workflow (`deploy-staging.yml`) that automates the build and release process for the API and web components.

## 2. Deployment Details

| Item | Link / Value |
| --- | --- |
| **Deployment Workflow** | [deploy-staging.yml](https://github.com/InfinityXOneSystems/infinity-xos-2.0/blob/main/.github/workflows/deploy-staging.yml) |
| **Successful Workflow Run** | [https://github.com/InfinityXOneSystems/infinity-xos-2.0/actions/runs/20808668377](https://github.com/InfinityXOneSystems/infinity-xos-2.0/actions/runs/20808668377) |
| **Related Pull Requests** | [#2](https://github.com/InfinityXOneSystems/infinity-xos-2.0/pull/2), [#3](https://github.com/InfinityXOneSystems/infinity-xos-2.0/pull/3), [#4](https://github.com/InfinityXOneSystems/infinity-xos-2.0/pull/4), [#5](https://github.com/InfinityXOneSystems/infinity-xos-2.0/pull/5) |

## 3. Deployed Endpoints

The following services were deployed to Google Cloud Run:

| Service | Environment | URL |
| --- | --- | --- |
| **API (`apps/api`)** | Staging | `https://infinity-xos-api-staging-f42ylsp5qa-ue.a.run.app` |
| **Web (`apps/web`)** | Staging | `https://infinity-xos-web-staging-f42ylsp5qa-ue.a.run.app` |

## 4. Verification Evidence

Endpoint verification was performed using `curl`. The outputs below confirm that the services are live and responding correctly.

### 4.1. API Service Verification

#### GET /

```bash
$ curl -s https://infinity-xos-api-staging-f42ylsp5qa-ue.a.run.app/

{"name":"Infinity XOS API","version":"2.0.0","status":"operational","docs":"/api/docs","health":"/healthz","ready":"/readyz","version_info":"/version"}
```

#### GET /readyz

```bash
$ curl -s https://infinity-xos-api-staging-f42ylsp5qa-ue.a.run.app/readyz

{"status":"ready","timestamp":"2026-01-08T07:15:05.053Z"}
```

#### GET /version

This output confirms the `contract_hash` and `backend_sha` are present as required.

```bash
$ curl -s https://infinity-xos-api-staging-f42ylsp5qa-ue.a.run.app/version

{"version":"2.0.0","contract_hash":"09e567a997b768b5c2a9220bca38fde50e237fc195581c872b2a3a38d7f42feb","backend_sha":"a79554296eb8d0bddf5186bab402543b71fa365e","deployed_at":"2026-01-08T07:15:21.968Z","environment":"staging"}
```

### 4.2. Web Service Verification

#### GET /

The web application returns a `200 OK` status, confirming it is live.

```bash
$ curl -I https://infinity-xos-web-staging-f42ylsp5qa-ue.a.run.app/

HTTP/2 200 
content-type: text/html
last-modified: Thu, 08 Jan 2026 07:08:48 GMT
etag: "695f5800-1c2"
accept-ranges: bytes
x-cloud-trace-context: e6a1472fab7c8d24b7857815bfa33bf5
content-length: 450
date: Thu, 08 Jan 2026 07:15:22 GMT
server: Google Frontend
alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
```

## 5. Screenshot References

- **[Screenshot 1]** - GitHub Actions workflow run showing all jobs passed successfully.
- **[Screenshot 2]** - Cloud Run service page for `infinity-xos-api-staging` showing healthy status.
- **[Screenshot 3]** - Cloud Run service page for `infinity-xos-web-staging` showing healthy status.
- **[Screenshot 4]** - Web application loaded in a browser, showing the rendered UI.
