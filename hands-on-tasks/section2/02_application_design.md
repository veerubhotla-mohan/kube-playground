# CKAD Practice Checklist – Section 2: Application Design and Build

## Labels on Pods
- [ ] Create a pod with labels using `kubectl`
- [ ] Verify labels using `kubectl get pods --show-labels`
- [ ] Create a pod with labels using YAML
- [ ] Add/modify a label on an existing pod

## ReplicaSet
- [ ] Create a ReplicaSet using a YAML file
- [ ] List ReplicaSets
- [ ] Get details of a ReplicaSet
- [ ] Describe a ReplicaSet
- [ ] Scale a ReplicaSet
- [ ] Delete a ReplicaSet

## Deployments
- [ ] Create a Deployment using `kubectl`
- [ ] Create a Deployment using a YAML file
- [ ] Scale a Deployment
- [ ] Check rollout history of a Deployment
- [ ] Rollback a Deployment
- [ ] Rollback to a specific revision (`--to-revision`)
- [ ] Update container image using `kubectl set image`
- [ ] Configure rolling updates using `maxSurge` and `maxUnavailable`
- [ ] Verify rolling update behavior during deployment

## DaemonSet
- [ ] Create a DaemonSet using a YAML file
- [ ] Verify DaemonSet pods are running on all nodes

## Jobs and CronJobs
- [ ] Create a Job using `kubectl`
- [ ] Create a Job using a YAML file
- [ ] Create a CronJob using `kubectl`
- [ ] Create a CronJob using a YAML file

### Job Parameters
- [ ] Set `activeDeadlineSeconds` in a Job
- [ ] Set `backoffLimit` in a Job
- [ ] Configure `completions` in a Job
- [ ] Configure `parallelism` in a Job
- [ ] Verify Job execution behavior with these parameters
