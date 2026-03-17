# Environment Variables

## What is it?
In Kubernetes, **environment variables** allow you to inject configuration data directly into containers at runtime. They decouple configuration from the container image. The simplest form defines values inline in the Pod spec under `env[].value` — no external resource required.

## Key Characteristics
- **Defined in `env[]`**: Each entry has a `name` and a `value`; both are plain strings.
- **Scoped to a container**: Env vars are declared per container inside `spec.containers[]`, not at the Pod level.
- **Immutable at runtime**: Env vars are injected when the container starts. To change them you must recreate the Pod.
- **Available to all processes**: Every process in the container inherits the env vars automatically.
- **Reference other sources**: Beyond literals, `valueFrom` lets you reference ConfigMap keys (`configMapKeyRef`), Secret keys (`secretKeyRef`), or Pod metadata (`fieldRef`) — covered in their own sections.

## Commands
```
# List all env variables inside a running container
kubectl exec <pod-name> -- env

# Describe a Pod to inspect its declared environment variables
kubectl describe pod <pod-name>

# Generate a Pod manifest with an env var set (dry-run trick)
kubectl run nginx --image=nginx --env="APP_COLOR=blue" --dry-run=client -o yaml

```
