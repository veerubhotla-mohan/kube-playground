---
name: k8s-dry-run
description: "Validate a Kubernetes YAML manifest using kubectl dry-run client-side before presenting it to the user. Use for checking spec correctness, catching schema errors, and confirming apiVersion/kind/field validity without touching a live cluster."
argument-hint: "Path to the Kubernetes YAML file to validate (e.g. ckad/section_01_core_concepts/01_pods/01_pod_basic.yaml)"
user-invocable: false
---

# Kubernetes Manifest Dry-Run Validation

## Purpose
Validate YAML manifests **before** delivering them to the user. Catches structural and schema errors client-side using `kubectl apply --dry-run=client`. This does **not** contact a live cluster.

## When to Use
- After creating or editing any Kubernetes YAML manifest
- Before including a manifest in a `notes.md` or presenting it as a final answer
- When asked to verify an existing YAML file

## Procedure

### Step 1 — Start Minikube
```bash
minikube start
```
Wait for the command to complete successfully before proceeding. If it fails, stop and report the error to the user.

### Step 2 — Check kubectl availability
```bash
kubectl version --client --short 2>/dev/null || echo "kubectl not available"
```
If kubectl is unavailable, skip to the **Fallback** section.

### Step 3 — Run client-side dry-run
```bash
kubectl apply --dry-run=client -f <path-to-yaml-file>
```
- `--dry-run=client`: validates the manifest locally against the Kubernetes OpenAPI schema. No cluster contact.
- Expected success output: `<resource>/<name> configured (dry run)` or `created (dry run)`

### Step 4 — Interpret results

| Output | Meaning | Action |
|--------|---------|--------|
| `... created (dry run)` | Valid manifest | Proceed — deliver to user |
| `... configured (dry run)` | Valid manifest | Proceed — deliver to user |
| `error: error validating ...` | Schema/field error | Fix the manifest, re-validate |
| `error: unable to recognize ...` | Unknown apiVersion or kind | Correct `apiVersion`/`kind`, re-validate |
| `error parsing ...` | YAML syntax error | Fix indentation/syntax, re-validate |

### Step 5 — Fix and re-validate
If validation fails:
1. Read the error message carefully — it includes the field path and reason.
2. Fix the identified field(s) in the YAML file.
1. Re-run Step 3 until the output confirms success.
4. Do not deliver the manifest to the user until validation passes.

## Fallback (kubectl unavailable)
If `kubectl` is not available, perform manual validation:
1. Confirm `apiVersion` matches the resource kind (e.g. `apps/v1` for Deployment, `v1` for Pod).
2. Confirm required fields are present: `apiVersion`, `kind`, `metadata.name`, `spec`.
3. Check indentation — YAML is whitespace-sensitive; use 2-space indentation consistently.
4. Verify container specs have `name` and `image` fields.
5. Flag any uncertainty to the user with an explicit note.

## Common Errors Reference

| Error | Common Cause |
|-------|-------------|
| `unknown field "x"` | Misspelled or unsupported field name |
| `cannot unmarshal !!str into int` | Wrong value type (string where int expected) |
| `missing required field "name"` | Container or metadata missing `name` |
| `no matches for kind "X"` | Wrong `apiVersion` for the resource kind |
| `mapping values are not allowed in this context` | YAML indentation error |
