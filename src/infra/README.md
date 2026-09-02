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

## Live collection is a subsequent phase

The initial implementation is backed by realistic mocked sanitized fixtures
(`fixtures/public-snapshot.ts`) consumed through the portfolio API/cache layer.
A future live collector implements `CollectorFn` from `collector-contract.ts`
and is wired behind the sanitizer; the public schema, the API/cache interface,
and the frontend do not change.
