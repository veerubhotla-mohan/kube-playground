# ReplicaSet

## What is it?
A **ReplicaSet** ensures that a specified number of identical Pod replicas are running at any given time. If a Pod crashes or is deleted, the ReplicaSet automatically creates a replacement. It is the successor to the older `ReplicationController`.

In practice, ReplicaSets are rarely created directly — they are managed by **Deployments**, which add rolling-update and rollback capabilities on top.

## Key Characteristics
- Maintains a stable set of replica Pods using a **label selector**
- Supports **set-based** selectors (`matchLabels`, `matchExpressions`), unlike the older ReplicationController which only supports equality-based selectors
- Automatically replaces Pods that are deleted, crash, or are evicted
- Scales horizontally — increase or decrease `replicas` to scale the workload
- A Pod created **outside** a ReplicaSet can be **adopted** if it matches the selector (and it has no ownerReference)
- Deleting a ReplicaSet also deletes all the Pods it owns (cascade delete by default)

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
