# CKAD Practice Checklist – Section 1: Core Concepts

## Pod Creation
### Create a pod using `kubectl run`

```kubectl run nginx-pod --image nginx```

### Create a pod using a YAML file
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx-pod
  name: nginx-pod
spec:
  containers:
  - image: nginx
    name: nginx-pod
```


## Pod Management Commands
### List all pods
```kubectl get pods```

### List pods with wide output (`-o wide`)
```kubectl get pods -o wide```

### Describe a pod
```kubectl describe pod nginx-pod```


### Delete a pod
```kubectl delete pod nginx-pod```


## Commands & Arguments
### Create a pod that runs `echo` using command
```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-echo-pod
spec:
  containers:
  - image: nginx
    name: nginx-echo-pod
    command: ["echo", "Hello world"]
```

### Create a pod that runs `ping` using command
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: busybox-ping-pod
  name: busybox-ping-pod
spec:
  containers:
  - image: busybox
    name: busybox-ping-pod
    command: 
    - "sh"
    - "-c"
    - "ping -c 4 google.com"
```

### Pass arguments to a container
```
apiVersion: v1
kind: Pod
metadata:
  name: busybox-ping-cmd-args-pod
spec:
  containers:
  - image: busybox
    name: busybox-ping-cmd-args-pod
    command: ["ping"]
    args: ["-c", "3", "google.com"]
```

### Verify command execution via logs (`kubectl logs`)
```ubectl logs busybox-ping-cmd-args-pod```

## Restart Policy
### Create a pod with `restartPolicy: Always`
```
apiVersion: v1
kind: Pod
metadata:
  name: web-server
spec:
  restartPolicy: Always  # Container restarts regardless of exit code
  containers:
  - name: nginx
    image: nginx:1.14.2
    command: ["sh", "-c", "exit 0"] # This will continously fail and the container restarts Always
```

### Create a pod with `restartPolicy: OnFailure`
```
apiVersion: v1
kind: Pod
metadata:
  name: web-server
spec:
  restartPolicy: OnFailure  # Container restarts if exit code is 1 (failure)
  containers:
  - name: nginx
    image: nginx:1.14.2
    command: ["sh", "-c", "exit 1"]
```

### Create a pod with `restartPolicy: Never`
```
apiVersion: v1
kind: Pod
metadata:
  name: web-server
spec:
  restartPolicy: Never  # Container never restarts regardless of exit code
  containers:
  - name: nginx
    image: nginx:1.14.2
    command: ["sh", "-c", "exit 1"]

```

