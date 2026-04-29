# CKAD Practice Checklist – Section 2: Application Design and Build

## Labels on Pods
### Create a pod with labels using `kubectl`
```kubectl run nginx --image nginx --labels app=backend,env=dev```

### Verify labels
```kubectl get pods --show-labels ```

### Create a pod with labels using YAML
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    env: dev
    app: backend
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
```

### Add/modify a label on an existing pod
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    env: dev
    app: backend
    version: v1 # New label added to existing pod
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
```


## ReplicaSet
### Create a ReplicaSet using a YAML file
```
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: nginx
        image: nginx
```

### List ReplicaSets
```kubectl get rs```

### Get details of a ReplicaSet
```kubectl describe rs frontend```

### Scale a ReplicaSet
```kubectl scale rs frontend --replicas 5```

### Delete a ReplicaSet
```kubectl delete rs frontend ```

## Deployments
### Create a Deployment using `kubectl`
``` kubectl create deployment nginx-deployment --image nginx --replicas 5```

### Create a Deployment using a YAML file
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
```

### Scale a Deployment
```kubectl scale deployment nginx-deployment --replicas 10```

### Check rollout history of a Deployment
Command to check rollout history of a deployment:
```kubectl rollout history deployment nginx-deployment```
1. Create a deployment
2. Run this command to check rollout history
3. Update the image of the deployment (modify the image to nginx:1.14.3 in the YAML file and apply the change)
4. Run this command again

### Rollback a Deployment (Undo)
```kubectl rollout undo deployment nginx-deployment```

### Rollback to a specific revision (`--to-revision`)
``` kubectl rollout undo deployment nginx-deployment --to-revision 2```

### Update container image using `kubectl set image`
```kubectl set image deployments nginx-deployment nginx=nginx:1.14.5```

### Deployment strategies
#### Create a deployment with `Recreate` strategy
```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: dep-recreate
  name: dep-recreate
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dep-recreate
  strategy: 
    type: Recreate
  template:
    metadata:
      labels:
        app: dep-recreate
    spec:
      containers:
      - image: nginx
        name: nginx
```

#### Create a deployment with `RollingUpdate` strategy
```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: dep-rolling-update
  name: dep-rolling-update
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dep-rolling-update
  strategy: 
    type: RollingUpdate

  template:
    metadata:
      labels:
        app: dep-rolling-update
    spec:
      containers:
      - image: nginx
        name: nginx
```

#### Configure rolling updates using `maxSurge` and `maxUnavailable`
```
apiVersion: apps/v1
kind: Deployment
metadata:
 name: nginx-deployment
 labels:
   app: nginx
spec:
 replicas: 3
 selector:
   matchLabels:
     app: nginx
 template:
   metadata:
     labels:
       app: nginx
   spec:
     containers:
     - name: nginx
       image: nginx:1.14.2
 strategy:
   type: RollingUpdate
   rollingUpdate:
     maxUnavailable: 1
     maxSurge: 1
```

## DaemonSet
### Create a DaemonSet using a YAML file
```
apiVersion: apps/v1
kind: DaemonSet
metadata:
 name: nginx-daemon-set
 labels:
   app: nginx
spec:
 selector:
   matchLabels:
     app: nginx
 template:
   metadata:
     labels:
       app: nginx
   spec:
     containers:
     - name: nginx
       image: nginx:1.14.2
```


## Jobs and CronJobs
### Create a Job using `kubectl`
``` kubectl create job my-job --image=busybox```

### Create a Job using a YAML file
```
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

### Create a CronJob using `kubectl`
```kubectl create cronjob my-job --image=busybox --schedule="*/1 * * * *"```
### Create a CronJob using a YAML file
```
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.28
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

### Job Parameters
#### Set `activeDeadlineSeconds`, `backoffLimit`, `completions` and `parallelism` in a Job
```apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  parallelism: 1
  completions: 5
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4

```

## Taints and Tolerations
### Taint a node
#### Taint with NoSchedule effect
```kubectl taint node minikube env=dev:NoSchedule```
#### Taint with PreferNoSchedule effect
```kubectl taint node minikube env=dev:PreferNoSchedule```
#### Taint with NoExecute effect
```kubectl taint node minikube env=dev:NoExecute```

### Attempt to create a pod without toleration - verify failure
Assumption - One node `minikube` is present with NoSchedule toleration added
Attempt to create pod: ```kubectl run nginx --image nginx```

### Attempt to create a pod with toleration
#### Toleration with Equal operator
```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  tolerations:
  - key: "env"
    operator: "Equal"
    value: "dev"
    effect: "NoSchedule"
```

#### Toleration with Exists operator
```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  tolerations:
  - key: "env"
    operator: "Exists"
    effect: "NoSchedule"
```


## Node Affinity

### Create a pod with `requiredDuringSchedulingIgnoredDuringExecution`
```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd            
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
```


### Create a pod with `preferredDuringSchedulingIgnoredDuringExecution`
```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd            
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
```

### Different operators in matchExpressions
#### In operator 
Covered above

#### Exists operator
```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disktype
            operator: Exists
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
```
