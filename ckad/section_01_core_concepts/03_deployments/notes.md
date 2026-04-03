# Deployment

## What is it?
A **Deployment** is a higher-level abstraction that manages a ReplicaSet and provides declarative updates for Pods. You describe the desired state (image, replicas, update strategy), and the Deployment controller continuously reconciles the actual state to match it.

Deployments are the standard way to run stateless workloads in Kubernetes. They wrap a ReplicaSet and add **rolling updates**, **rollbacks**, and **revision history** on top.

## Key Characteristics
- **Manages a ReplicaSet**: A Deployment creates and owns a ReplicaSet, which in turn manages the actual Pods. In practice you interact only with the Deployment, and Kubernetes handles the lower-level ReplicaSet bookkeeping for you.
- **Rolling update strategy**: By default, new Pods are created and old ones are removed gradually so the application stays available during an upgrade. The pace is controlled by `maxUnavailable` and `maxSurge` to balance speed against stability.
- **Recreate strategy**: All existing Pods are terminated first, then new ones are started. This causes a brief period of downtime but is necessary when old and new versions cannot safely run side by side.
- **Revision history and rollback**: Every rollout saves a revision entry, so you can inspect what changed and roll back to any previous version with a single command. This makes recovering from a bad release fast and reliable.
- **Horizontal scaling**: Changing `replicas` scales the workload up or down and the Deployment propagates that change to its managed ReplicaSet automatically. Scale up for high traffic, scale down to reduce resource usage.
- **Pause and resume**: You can pause a Deployment to apply multiple spec changes without triggering a separate rollout for each one. Once satisfied, resuming causes a single controlled rollout incorporating all the batched changes.
- **ReplicaSet per rollout**: Each rollout produces a new ReplicaSet; old ones are kept but scaled to zero. This is what makes rollout history, diff inspection, and undo operations work — the previous state is preserved, not discarded.

## Rolling Update Parameters
Controlled under `spec.strategy.rollingUpdate`:

| Field | Default | Meaning |
|-------|---------|---------|
| `maxUnavailable` | 25% | Max Pods that can be unavailable during the update |
| `maxSurge` | 25% | Max extra Pods that can be created above the desired count |

## Commands

```kubectl
# Create a Deployment from a YAML definition file
kubectl apply -f deployment.yaml

# Create a Deployment imperatively
kubectl create deployment <name> --image=<image>

# Create a Deployment imperatively and output the YAML without creating (dry-run trick)
kubectl create deployment <name> --image=<image> --dry-run=client -o yaml > deployment.yaml

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

# Scale a Deployment by editing the spec live
kubectl edit deployment/<name>

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
