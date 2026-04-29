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
- [ ] Get logs of a pod
- [ ] Get logs of a specific container in a multi-container pod
- [ ] Stream logs using `-f`

## Metrics Server
- [ ] Install Metrics Server
- [ ] Verify Metrics Server is running
- [ ] Get node metrics using `kubectl top nodes`
- [ ] Get pod metrics using `kubectl top pods`

## Events
- [ ] Create multiple pods
- [ ] Get cluster events using `kubectl get events`
- [ ] Describe a pod to inspect related events