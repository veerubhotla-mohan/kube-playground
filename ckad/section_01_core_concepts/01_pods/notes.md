# Pods

## What is it?
A **Pod** is the smallest and most basic deployable unit in Kubernetes. It represents a single instance of a running process and wraps one or more containers that share the same network namespace and storage volumes. All containers in a Pod are co-located on the same node and scale together.

## Key Characteristics
- **Atomic unit**: Kubernetes treats a Pod as one deployable object, so all containers inside it are scheduled to the same node and managed together. This is why you do not scale individual containers inside a Pod, you scale Pods.
- **Shared network**: Containers in the same Pod share one IP address and one network namespace. This makes inter-container communication simple because they can talk to each other using localhost without extra Service configuration.
- **Shared storage**: Containers in a Pod can mount the same volume, which allows them to exchange files or logs during runtime. This is useful in sidecar patterns where one container writes data and another container reads or processes it.
- **Ephemeral by nature**: Pods are meant to be replaceable and can be recreated at any time by a controller. When that happens, the new Pod may get a different IP, so stable access should usually happen through a Service rather than a Pod IP.
- **Single vs multi-container**: Most real workloads use one main container per Pod for simplicity and isolation of responsibility. Multi-container Pods are used when containers must closely cooperate, such as app plus log-forwarder or app plus proxy sidecar.

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
# Create a Pod from a YAML definition file
kubectl apply -f pod.yaml

# Create a Pod imperatively (quick way for exams)
kubectl run nginx --image=nginx

# Create a Pod and expose a port
kubectl run nginx --image=nginx --port=80

# Generate a Pod manifest without creating it (dry-run trick)
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml

# Get a specific Pod
kubectl get pod <pod-name>

# List all Pods in the current namespace
kubectl get pods

# Get detailed info about a Pod (events, IP, node, container status)
kubectl describe pod <pod-name>

# Execute a command inside a running Pod
kubectl exec -it <pod-name> -- /bin/sh

# Delete a Pod
kubectl delete pod <pod-name>

```
