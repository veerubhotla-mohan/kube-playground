# CKAD Practice Checklist – Section 4: Observability and Maintenance

## Liveness Probe
- [ ] Create a pod with HTTP liveness probe
- [ ] Create a pod with TCP liveness probe
- [ ] Create a pod with exec liveness probe
- [ ] Verify liveness probe failures and restarts

## Readiness Probe
- [ ] Create a pod with HTTP readiness probe
- [ ] Create a pod with TCP readiness probe
- [ ] Create a pod with exec readiness probe
- [ ] Verify readiness behavior (pod not receiving traffic when not ready)

## Logs
### Get logs of a pod
Step 1: Create a pod with continuos logging
```
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-continuous-logs
spec:
  containers:
  - name: logger
    image: nginx
    command: ["sh", "-c"]
    args:
      - while true; do echo "Log at $(date)"; sleep 2; done
```

### Get logs of the pods
```kubectl logs pod-with-continuous-logs -f```

### Create pods with 2 containers generating logs
```
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-continuous-logs
spec:
  containers:
  - name: logger1
    image: nginx
    command: ["sh", "-c"]
    args:
      - while true; do echo "Log from pod1 at $(date)"; sleep 2; done
  - name: logger2
    image: nginx
    command: ["sh", "-c"]
    args:
      - while true; do echo "Log from pod2 at $(date)"; sleep 2; done
```

### Get logs of a specific container in the multi-container pod
```kubectl logs pod-with-continuous-logs -f -c logger2```


## Metrics Server
- [ ] Install Metrics Server
- [ ] Verify Metrics Server is running
- [ ] Get node metrics using `kubectl top nodes`
- [ ] Get pod metrics using `kubectl top pods`
