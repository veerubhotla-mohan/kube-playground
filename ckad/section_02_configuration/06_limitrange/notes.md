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
# Create a namespace policy for default and bounded resources
kubectl apply -f 01_limitrange_container_defaults.yaml

# Inspect LimitRange policy details
kubectl describe limitrange container-resource-policy -n dev-team

# Try creating a Pod and let defaults be injected
kubectl apply -f 02_pod_without_resources.yaml -n dev-team

# Check effective requests/limits after admission
kubectl get pod demo-no-resources -n dev-team -o yaml

# Validate manifests client-side
kubectl apply --dry-run=client -f 01_limitrange_container_defaults.yaml
kubectl apply --dry-run=client -f 02_pod_without_resources.yaml
```
