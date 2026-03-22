# Resource Requirements

## What is it?
Resource requirements define how much CPU and memory a container asks for (`requests`) and the maximum it is allowed to use (`limits`). Kubernetes uses these values for Pod scheduling and runtime enforcement.

## Key Characteristics
- `requests` are the minimum resources guaranteed to a container for scheduling.
- `limits` are hard caps on resource usage at runtime.
- CPU is measured in cores or millicores (`500m` = 0.5 core).
- Memory is measured in bytes (commonly `Mi` and `Gi`).
- Scheduler places Pods based on sum of container `requests` in each Pod.
- CPU limit overrun leads to **throttling**: the container usually keeps running, but Linux gives it fewer CPU time slices.
- Memory limit overrun can lead to **OOMKill**: the container process is terminated if it exceeds its memory cgroup limit.
- CPU is considered **compressible**: extra demand can be reduced by slowing execution.
- Memory is effectively **non-compressible**: once allocated, it cannot be safely "slowed" in place, so eviction/kill is used under pressure.
- Practical impact of CPU throttling: higher latency and slower throughput, but process survival is common.
- Practical impact of memory OOM: container restarts, transient errors, and possible CrashLoopBackOff patterns.
- If only `limits` are set, Kubernetes can copy limit values as requests in many clusters (defaulting behavior may vary by policy).
- Namespace policies such as **LimitRange** can enforce min/max and inject defaults for missing requests/limits.

## Commands
```kubectl
# Create a Pod with CPU/memory requests and limits
kubectl apply -f 01_pod_requests_limits.yaml

# Inspect resource requests and limits for a Pod
kubectl describe pod web-with-resources

# View requests/limits via JSONPath
kubectl get pod web-with-resources -o jsonpath='{.spec.containers[0].resources}'

# Watch restart counts and reason if memory pressure causes OOMKill
kubectl get pod web-with-resources -o wide
kubectl describe pod web-with-resources

# View namespace-level default/min/max policy that affects requests and limits
kubectl get limitrange -n dev-team
kubectl describe limitrange container-resource-policy -n dev-team

# Validate manifest client-side
kubectl apply --dry-run=client -f 01_pod_requests_limits.yaml
kubectl apply --dry-run=client -f 02_pod_multiple_containers_resources.yaml
```
