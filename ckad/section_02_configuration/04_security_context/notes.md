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
# Apply a Pod with a security context
kubectl apply -f pod.yaml

# Verify which UID a running container is using
kubectl exec <pod-name> -- id

# Inspect the security context fields of a live Pod
kubectl get pod <pod-name> -o jsonpath='{.spec.securityContext}'
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].securityContext}'

# Describe a Pod (shows securityContext under containers section)
kubectl describe pod <pod-name>
```

## Setting runAsUser

### Pod level — applies to all containers as a default
```yaml
spec:
  securityContext:
    runAsUser: 1000   # all containers run as UID 1000 unless overridden
  containers:
    - name: app
      image: nginx
```

### Container level — overrides the pod-level value for that container
```yaml
spec:
  securityContext:
    runAsUser: 1000
  containers:
    - name: app
      image: nginx
      securityContext:
        runAsUser: 2000   # this container runs as UID 2000 instead
```

## Adding or Dropping Linux Capabilities
Capabilities are always set at **container** scope under `securityContext.capabilities`:

```yaml
spec:
  containers:
    - name: app
      image: nginx
      securityContext:
        capabilities:
          add: ["NET_ADMIN", "SYS_TIME"]   # grant extra capabilities
          drop: ["ALL"]                     # remove all default capabilities
```

> `add` and `drop` can be used together. `drop: ["ALL"]` first, then `add` is a common least-privilege pattern.
