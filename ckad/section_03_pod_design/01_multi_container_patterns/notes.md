# Multi-Container Pod Design Patterns

## What is it?
Kubernetes Pods can run more than one container. Multi-container patterns describe how those containers are structured to serve a common purpose while sharing the same network namespace, localhost, and optionally the same storage volumes.

## Key Characteristics

### 1. Colocated Containers
- Multiple containers defined under `spec.containers` in the same Pod.
- All containers share the Pod's network namespace (communicate via `localhost`) and can share volumes.
- Run **concurrently** — all start together and must all be running for the Pod to be healthy.
- Use case: tightly coupled processes that need to share resources (e.g. app + helper process).

### 2. Init Containers
- Defined under `spec.initContainers` — run **before** any main container starts.
- Run sequentially; each one must complete successfully before the next begins.
- If an init container fails the Pod restarts (respecting `restartPolicy`).
- Use case: pre-flight setup such as waiting for a dependency, seeding a volume with data, or running database migrations.

### 3. Sidecar Container
- Defined under `spec.initContainers` with `restartPolicy: Always` — the native sidecar pattern (Kubernetes 1.29+).
- Unlike regular init containers, it starts **alongside** the main containers rather than blocking them.
- Automatically restarts if it exits, matching the lifecycle of the Pod.
- Shares the Pod's network namespace — can reach the main container via `localhost`.
- Typically handles cross-cutting concerns: logging, metrics scraping, proxying, or secret rotation.
- Use case: health-check poller, log forwarder, Envoy/Istio proxy.

## Commands

```kubectl
# Create a Pod from a manifest
kubectl apply -f <manifest.yaml>

# Watch Pod phases (useful to observe init containers completing)
kubectl get pod <pod-name> -w

# Describe Pod — shows init container status and events
kubectl describe pod <pod-name>

# Stream logs from a specific container within a Pod
kubectl logs <pod-name> -c <container-name>

# Stream logs from an init container
kubectl logs <pod-name> -c <init-container-name>

# Execute a command in a specific container
kubectl exec -it <pod-name> -c <container-name> -- sh

# Delete the Pod
kubectl delete pod <pod-name>
```
