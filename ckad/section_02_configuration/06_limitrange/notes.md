# LimitRange

## What is it?
A LimitRange is a namespace-level policy that sets default, minimum, and maximum resource constraints for Pods or containers. It helps enforce consistent CPU and memory requests/limits without requiring every manifest author to define all values manually.

## Key Characteristics
- Applied per namespace using `kind: LimitRange`.
- Can define `defaultRequest` values when requests are omitted.
- Can define `default` values when limits are omitted.
- Can enforce `min` and `max` values for CPU and memory.
- Can enforce request-to-limit relationships with `maxLimitRequestRatio`.
- Admission control rejects resources outside policy constraints.
- Commonly used together with `ResourceQuota` for stronger governance.

## Commands
```kubectl
# Create a LimitRange from a YAML definition file
kubectl apply -f limitrange.yaml

# Inspect a LimitRange policy
kubectl describe limitrange <name> -n <namespace>

# List LimitRanges in a namespace
kubectl get limitrange -n <namespace>

# Verify that defaults were injected into a Pod that omits resource fields
kubectl get pod <pod-name> -n <namespace> -o yaml
```
