# Deployment

## What is it?
A **Deployment** is a higher-level abstraction that manages a ReplicaSet and provides declarative updates for Pods. You describe the desired state (image, replicas, update strategy), and the Deployment controller continuously reconciles the actual state to match it.

Deployments are the standard way to run stateless workloads in Kubernetes. They wrap a ReplicaSet and add **rolling updates**, **rollbacks**, and **revision history** on top.

## Key Characteristics
- Manages a ReplicaSet under the hood — the ReplicaSet manages the Pods
- Supports **rolling updates**: replaces Pods gradually with zero downtime (default strategy)
- Supports **Recreate** strategy: terminates all existing Pods before creating new ones
- Maintains a **revision history** so you can roll back to any previous version
- Scaling the Deployment scales the underlying ReplicaSet
- Pausing a Deployment lets you batch multiple changes before triggering a rollout
- A new ReplicaSet is created on each rollout; the old one is kept (scaled to 0) for rollback

## Rolling Update Parameters
Controlled under `spec.strategy.rollingUpdate`:

| Field | Default | Meaning |
|-------|---------|---------|
| `maxUnavailable` | 25% | Max Pods that can be unavailable during the update |
| `maxSurge` | 25% | Max extra Pods that can be created above the desired count |

## Commands

```kubectl
# Create a Deployment from a file
kubectl apply -f deployment.yaml

# List Deployments
kubectl get deployments
kubectl get deploy                        # short alias

# Check rollout status (blocks until complete)
kubectl rollout status deployment/<name>

# View rollout history
kubectl rollout history deployment/<name>

# Roll back to the previous revision
kubectl rollout undo deployment/<name>

# Roll back to a specific revision
kubectl rollout undo deployment/<name> --to-revision=2

# Scale a Deployment
kubectl scale deployment/<name> --replicas=5

# Update the image imperatively (triggers a new rollout)
kubectl set image deployment/<name> <container>=<new-image>

# Pause a rollout (batch changes without triggering a rollout)
kubectl rollout pause deployment/<name>

# Resume a paused rollout
kubectl rollout resume deployment/<name>

# Describe a Deployment (shows events, strategy, replica counts)
kubectl describe deployment/<name>

# Delete a Deployment (also deletes its ReplicaSets and Pods)
kubectl delete deployment/<name>
```
