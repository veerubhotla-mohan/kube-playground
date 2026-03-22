# Node Selectors

## What is it?
A node selector is the simplest way to constrain a Pod so Kubernetes schedules it only onto Nodes that have specific labels. The scheduler performs an exact label match: every key and value listed in `spec.nodeSelector` must already exist on the target Node.

## Key Characteristics
- Defined in the Pod spec under `spec.nodeSelector`.
- Uses exact key-value matches only; there are no operators such as `In` or `NotIn`.
- All listed labels must match for the Pod to be scheduled.
- If no Node has the required labels, the Pod stays in `Pending`.
- Commonly used for simple placement rules such as SSD nodes, regional nodes, or dedicated hardware pools.
- Works well for basic scheduling, but becomes limiting when you need expressions or soft preferences.
- Node selectors rely on labels already being present on Nodes.

## Commands
```kubectl
# Add a label to a node so Pods can target it
kubectl label nodes worker-1 disktype=ssd

# Verify node labels
kubectl get nodes --show-labels

# Create a Pod with a nodeSelector
kubectl apply -f <manifest.yaml>

# Inspect why a Pod is or is not scheduled
kubectl describe pod api-on-ssd

# Validate a manifest client-side
kubectl apply --dry-run=client -f <manifest.yaml>
```