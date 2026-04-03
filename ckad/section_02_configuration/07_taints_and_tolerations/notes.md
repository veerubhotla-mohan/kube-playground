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
# Add a taint to a node
kubectl taint nodes <node-name> <key>=<value>:<effect>

# Example — reserve a node for batch workloads
kubectl taint nodes worker-1 dedicated=batch:NoSchedule

# Verify taints on a node
kubectl describe node <node-name> | grep -i taint

# Remove a taint from a node (append - at the end)
kubectl taint nodes <node-name> <key>=<value>:<effect>-

# Apply a Pod manifest with a toleration
kubectl apply -f pod.yaml
```

## Tainting a Node
Taint effects and when to use them:

| Effect | Behaviour |
|--------|-----------|
| `NoSchedule` | New Pods without a matching toleration are not scheduled onto the node |
| `PreferNoSchedule` | Scheduler avoids the node but may still place Pods there if needed |
| `NoExecute` | Blocks new non-tolerating Pods **and** evicts existing ones that don't tolerate it |

```kubectl
# NoSchedule — hard block for new Pods
kubectl taint nodes worker-1 dedicated=batch:NoSchedule

# NoExecute — evicts existing Pods too
kubectl taint nodes worker-1 maintenance=true:NoExecute
```

## Adding a Toleration to a Pod
Toleraton must match the taint's key, value, and effect exactly (when using `operator: Equal`):

```yaml
spec:
  tolerations:
    - key: "dedicated"          # must match the taint key
      operator: "Equal"         # Equal checks key + value; Exists checks key only
      value: "batch"            # must match the taint value
      effect: "NoSchedule"      # must match the taint effect
  containers:
    - name: app
      image: nginx
```

Using `operator: Exists` (matches any value for the key):

```yaml
spec:
  tolerations:
    - key: "maintenance"
      operator: "Exists"
      effect: "NoExecute"
      tolerationSeconds: 300    # Pod stays up to 5 min before eviction
```