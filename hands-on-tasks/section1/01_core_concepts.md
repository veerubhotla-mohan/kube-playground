# CKAD Practice Checklist – Section 1: Core Concepts

## Pod Creation
- [ ] Create a pod using `kubectl run`
- [ ] Create a pod using a YAML file

## Pod Management Commands
- [ ] List all pods
- [ ] List pods with wide output (`-o wide`)
- [ ] Describe a pod
- [ ] Delete a pod
- [ ] Delete all pods in a namespace

## Commands & Arguments
- [ ] Create a pod that runs `echo` using command
- [ ] Create a pod that runs `ping` using command
- [ ] Pass arguments to a container
- [ ] Verify command execution via logs (`kubectl logs`)

## Restart Policy
- [ ] Create a pod with `restartPolicy: Always`
- [ ] Create a pod with `restartPolicy: OnFailure`
- [ ] Create a pod with `restartPolicy: Never`
- [ ] Verify restart behavior of containers
