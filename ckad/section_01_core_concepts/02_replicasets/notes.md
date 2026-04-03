# ReplicaSet

## What is it?
A **ReplicaSet** ensures that a specified number of identical Pod replicas are running at any given time. If a Pod crashes or is deleted, the ReplicaSet automatically creates a replacement. It is the successor to the older `ReplicationController`.

In practice, ReplicaSets are rarely created directly — they are managed by **Deployments**, which add rolling-update and rollback capabilities on top.

## Key Characteristics
- **Label-selector driven**: The ReplicaSet continuously compares the desired replica count against all Pods whose labels match its selector. If the numbers differ, it creates or deletes Pods until the actual state matches the target state.
- **Set-based selectors**: Uses `matchLabels` and `matchExpressions` in `spec.selector`, which are more expressive than the simple equality checks of the older ReplicationController. This gives you finer control over which Pods the ReplicaSet considers its own.
- **Self-healing**: Automatically recreates Pods that are deleted, crash, or get evicted from a node. This keeps your application running without manual intervention and is one of the biggest advantages over manually managed Pods.
- **Horizontal scaling**: Changing the `replicas` field runs more or fewer copies of the same Pod template. Increasing replicas spreads load across more instances; decreasing it frees cluster resources.
- **Pod adoption**: A ReplicaSet can adopt an existing Pod it did not create if that Pod's labels match the selector and no other controller owns it. This can cause unexpected ownership changes, so it is important to keep selectors unique per workload.
- **Cascade deletion**: Deleting a ReplicaSet also deletes all the Pods it owns by default. To keep Pods running after removing the controller, use `--cascade=orphan`, which breaks ownership without stopping the Pods.

## How the selector works
The `spec.selector` must match the labels in `spec.template.metadata.labels`. Kubernetes will reject the manifest if they do not match.

```
spec:
  selector:
    matchLabels:
      app: myapp        ← must match ↓
  template:
    metadata:
      labels:
        app: myapp      ← must match ↑
```

## Commands

```kubectl
# Create a ReplicaSet from a file
kubectl apply -f replicaset.yaml

# List all ReplicaSets in the current namespace
kubectl get replicasets
kubectl get rs                          # short alias

# Get a specific ReplicaSet
kubectl get rs <name>

# Describe a ReplicaSet (shows events, selector, pod status)
kubectl describe rs <name>

# Scale a ReplicaSet imperatively
kubectl scale rs <name> --replicas=5

# Delete a ReplicaSet (also deletes its Pods)
kubectl delete rs <name>

# Delete a ReplicaSet but keep its Pods (orphan them)
kubectl delete rs <name> --cascade=orphan

# Edit a running ReplicaSet live
kubectl edit rs <name>
```
