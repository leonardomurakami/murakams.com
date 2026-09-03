# Infrastructure status — sanitization boundary

This module implements the public infrastructure status capability with an
explicit sanitization boundary between Kubernetes/ArgoCD and the public
portfolio interface.

## Flow

```
Kubernetes / ArgoCD
        ↓
private collector          (collector-contract.ts — raw shape, NOT public)
        ↓
explicit sanitizer        (sanitizer.ts — default-deny allowlist projection)
        ↓
small public data model   (public-schema.ts — the only shape the UI consumes)
        ↓
portfolio API/cache       (api/index.ts — fresh/stale/degraded contract)
        ↓
/infra                    (the only public surface)
```

## Safety boundary

**ArgoCD is never exposed to the Internet.** The public interface only receives
explicitly allowlisted information from `public-schema.ts`. The sanitizer is a
default-deny projection: anything not in the allowlist is dropped by
construction.

The following NEVER cross the boundary:

- Kubernetes manifests, secrets, environment variables, ConfigMap contents
- Internal IP addresses, node names, private hostnames
- Repository credentials, cluster credentials, ArgoCD tokens
- Annotations (unless explicitly allowlisted — none are)
- Container registry credentials / image refs
- Arbitrary Kubernetes API objects
- Raw ArgoCD API responses

Tests in `tests/infra/sanitizer.test.ts` assert that representative sensitive
inputs (Secrets, IPs, node names, private hostnames, raw responses, tokens,
annotations) are stripped and that every public-schema field is explicitly
allowlisted.

## Live collection

A live collector (`collector.ts`) implements `CollectorFn` from
`collector-contract.ts`. It runs as a Kubernetes CronJob
(`murakams-infra-collector`) in the murakams namespace, queries the in-cluster
ArgoCD and Kubernetes APIs, projects the result through the sanitizer, and
writes the public snapshot to the `murakams-infra-snapshot` ConfigMap. The
murakams web deployment mounts that ConfigMap at `/var/lib/infra/snapshot.json`
and the API/cache layer (`api/index.ts`) reads it at request time, reporting
`fresh`, `stale` (aged past the staleness threshold), or `degraded` (absent or
unreadable, falling back to the fixture). The immersive System Monitor fetches
the same snapshot client-side from the `/api/infra` endpoint.

The collector filters to the ArgoCD `workloads` project by default
(`ARGOCD_PROJECT_FILTER`) so platform plumbing is not exposed. ArgoCD is reached
over an in-cluster HTTPS connection; the collector authenticates with an ArgoCD
local account token (`infra-collector`, `role:readonly`) mounted from a
Kubernetes Secret — never committed to Git. See the deployments repository for
the one-time token/Secret setup.

The public schema, the API/cache interface, and the frontend are unchanged from
the mocked phase; only the data source switched from the fixture to the mounted
live snapshot.
