# Node Affinity

## What is it?
Node affinity is a Pod scheduling rule that constrains which Nodes a Pod can be placed on based on **Node labels**. It is a more expressive replacement for `nodeSelector`, supporting operators and soft ("preferred") rules in addition to hard ("required") rules.

## Key Characteristics
- Rules are defined under `spec.affinity.nodeAffinity` in the Pod spec.
- Two scheduling types control when rules are enforced:
  - `requiredDuringSchedulingIgnoredDuringExecution` — **Hard rule**: Pod will not be scheduled unless the rule is satisfied. Already-running Pods are not evicted if node labels change later.
  - `preferredDuringSchedulingIgnoredDuringExecution` — **Soft rule**: Scheduler tries to place the Pod on a matching Node, but falls back to any available Node if no match is found. Uses a `weight` (1–100) to score candidate Nodes.
- A third type, `requiredDuringSchedulingRequiredDuringExecution`, is planned but not yet available in stable Kubernetes.
- Rules are expressed as `matchExpressions`, each with a `key`, `operator`, and optional `values` list.
- Multiple `matchExpressions` in one `nodeSelectorTerm` are ANDed (all must match).
- Multiple `nodeSelectorTerms` are ORed (at least one must match).

## matchExpression Operators

| Operator | Behaviour | `values` required? |
|----------|-----------|-------------------|
| `In` | Node label value must be one of the listed values | Yes |
| `NotIn` | Node label value must not be in the listed values | Yes |
| `Exists` | Node label key must exist (any value accepted) | No |
| `DoesNotExist` | Node label key must not exist | No |
| `Gt` | Node label value (as integer) must be greater than the single value | Yes |
| `Lt` | Node label value (as integer) must be less than the single value | Yes |

## Commands
```kubectl
# Label a node (prerequisite for affinity rules to match)
kubectl label nodes <node-name> <key>=<value>

# Example — label a node by disk type and region
kubectl label nodes worker-1 disktype=ssd
kubectl label nodes worker-1 region=us-east

# View labels on all nodes
kubectl get nodes --show-labels

# View labels on a specific node
kubectl describe node <node-name> | grep -i label

# Remove a label from a node (append - at the end)
kubectl label nodes <node-name> <key>-

# Apply a Pod with node affinity
kubectl apply -f pod.yaml

# Verify the Pod was scheduled to the expected node
kubectl get pod <pod-name> -o wide
```

## Node Affinity vs nodeSelector

| Feature | `nodeSelector` | Node Affinity |
|---------|---------------|---------------|
| Operators | Exact match only | `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt` |
| Soft/preferred scheduling | No | Yes (`preferredDuring...`) |
| Multiple values per key | No | Yes (`In` with array of values) |
| OR across term groups | No | Yes (multiple `nodeSelectorTerms`) |

## Hard Rule — `requiredDuringSchedulingIgnoredDuringExecution`
The Pod is only scheduled onto Nodes whose labels satisfy **all** expressions:

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: disktype          # Node must have this label
                operator: In
                values:
                  - ssd                # ...with value "ssd" or "nvme"
                  - nvme
  containers:
    - name: app
      image: nginx
```

## Soft Rule — `preferredDuringSchedulingIgnoredDuringExecution`
The scheduler scores Nodes by the `weight`; the Pod still lands somewhere even with no match:

```yaml
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 80                   # Higher weight = stronger preference
          preference:
            matchExpressions:
              - key: region
                operator: Exists       # Any Node that has the "region" label
  containers:
    - name: app
      image: nginx
```
