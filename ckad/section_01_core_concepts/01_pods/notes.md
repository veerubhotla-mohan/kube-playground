# Pods

## What is it?
A **Pod** is the smallest and most basic deployable unit in Kubernetes. It represents a single instance of a running process and wraps one or more containers that share the same network namespace and storage volumes. All containers in a Pod are co-located on the same node and scale together.

## Key Characteristics
- **Atomic unit**: Kubernetes schedules, starts, and stops all containers in a Pod together.
- **Shared network**: Every container in a Pod shares the same IP address and port space. Containers communicate with each other via `localhost`.
- **Shared storage**: Containers in a Pod can mount the same `volumes`, enabling data sharing between them.
- **Ephemeral by nature**: Pods are not self-healing on their own. If a Pod dies, a controller (e.g., Deployment) recreates it — potentially with a new IP.
- **Single vs multi-container**: Most Pods run one container. Multi-container Pods use patterns like sidecar, ambassador, or adapter.

## Pod Lifecycle Phases
| Phase | Meaning |
|-------|---------|
| `Pending` | Pod accepted but containers not yet running (e.g., pulling image) |
| `Running` | At least one container is running |
| `Succeeded` | All containers exited with code 0 |
| `Failed` | At least one container exited with non-zero code |
| `Unknown` | Pod status could not be determined |

## Commands
```
# Create a Pod imperatively (quick way for exams)
kubectl run nginx --image=nginx

# Create a Pod and expose a port
kubectl run nginx --image=nginx --port=80

# Generate a Pod manifest without creating it (dry-run trick)
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml

# List all Pods in the current namespace
kubectl get pods

# Get detailed info about a Pod (events, IP, node, container status)
kubectl describe pod <pod-name>

# Execute a command inside a running Pod
kubectl exec -it <pod-name> -- /bin/sh

# Delete a Pod
kubectl delete pod <pod-name>

```
