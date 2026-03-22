# Security Context

## What is it?
Security Context defines privilege and access controls for a Pod or container. It is used to control how processes run, which Linux user/group they run as, and what capabilities they have.

## Key Characteristics
- Can be set at Pod level (`spec.securityContext`) and container level (`spec.containers[].securityContext`).
- Pod-level settings apply by default to all containers unless overridden at container level.
- Container-level `securityContext` takes precedence for overlapping fields.
- Focus for this module: `runAsUser` and `capabilities`.
- `runAsUser` can be defined at Pod or container scope.
- `capabilities` are configured at container scope.
- Helps enforce least privilege and reduce container breakout risk.

## Pod vs Container Level (and Precedence)
- Pod level (`spec.securityContext`): sets defaults for all containers in the Pod.
- Container level (`spec.containers[].securityContext`): applies only to that container and is where `capabilities` are defined.
- If both define `runAsUser`, container-level value wins.
- If only pod-level `runAsUser` exists, containers inherit it.

Quick precedence rule for exams:
- `runAsUser` at both pod and container scope -> container value wins.
- `capabilities` -> set under `spec.containers[].securityContext`.

## Commands
```kubectl
# Create a pod with a security context
kubectl apply -f 01_pod_security_context.yaml

# Verify pod-level runAsUser
kubectl get pod secure-nginx -o yaml

# Check container security context fields quickly
kubectl get pod secure-nginx -o jsonpath='{.spec.containers[0].securityContext}'

# Show pod-level defaults vs container-level override
kubectl get pod secure-nginx-override -o yaml

# Validate a manifest client-side (exam-friendly habit)
kubectl apply --dry-run=client -f 02_pod_container_security_override.yaml
```
