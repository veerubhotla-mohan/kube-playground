# Taints and Tolerations

## What is it?
A taint is a property applied to a Node that repels Pods, while a toleration is a Pod setting that allows the Pod to be scheduled onto, or continue running on, a tainted Node. They are used together to control placement for special-purpose nodes such as dedicated, GPU, or maintenance pools.

## Key Characteristics
- Taints live on Nodes and use the format `key=value:effect`.
- Tolerations live in the Pod spec under `spec.tolerations`.
- A toleration allows scheduling onto a matching tainted Node, but it does not force the Pod onto that Node.
- `NoSchedule` blocks new Pods from being scheduled onto the node unless they have a matching toleration.
- `PreferNoSchedule` is a soft rule: the scheduler tries to avoid placing Pods there, but may still do so if needed.
- `NoExecute` prevents new non-tolerating Pods from landing on the node and also evicts existing Pods that do not tolerate the taint.
- `operator: Equal` matches on key and value, while `operator: Exists` matches only on the key.
- `NoExecute` can evict already-running Pods unless they tolerate the taint.
- `tolerationSeconds` applies only to `NoExecute` and controls how long a Pod may remain after the taint is added.
- For dedicated nodes, taints are commonly combined with labels plus `nodeSelector` or affinity.

## Commands
```kubectl
# Add a taint to a node so ordinary Pods avoid it
kubectl taint nodes worker-1 dedicated=batch:NoSchedule

# Verify the taint on the node
kubectl describe node worker-1

# Create a Pod with a NoSchedule toleration
kubectl apply -f <manifest.yaml>

# Create a Pod with a NoExecute toleration (optionally with tolerationSeconds)
kubectl apply -f <manifest.yaml>

# Remove the taint from the node
kubectl taint nodes worker-1 dedicated=batch:NoSchedule-

# Validate a manifest client-side
kubectl apply --dry-run=client -f <manifest.yaml>
```