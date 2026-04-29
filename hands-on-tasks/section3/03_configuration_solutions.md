# CKAD Practice Checklist – Section 3: Configuration

## Environment Variables
### Create a pod with environment variables using YAML
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
    env:
      - name: key1
        value: value1
      - name: key2
        value: value2
```
### Create a pod with environment variables using `kubectl`
`kubectl run nginx --image nginx --env "key1=value1" --env "key2=value2"`

## ConfigMaps
### Create a ConfigMap using `kubectl`
`kubectl create configmap my-config --from-literal=key1=config1 --from-literal=key2=config2`

### Create a ConfigMap using a YAML file
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config-map
data:
  key1: "value1"
  key2: "value2"
  key3: |
    sub_key1=sub_value1
    sub_key2=sub_value

```

### Use all keys of a ConfigMap as environment variables in a Pod
Step1: Create the pod and print the env variables
```
apiVersion: v1
kind: Pod
metadata:
  name: env-configmap
spec:
  containers:
    - name: app
      command: ["/bin/sh", "-c", "printenv"]
      image: busybox:latest
      envFrom:
        - configMapRef:
            name: my-config-map
```
Step2: Verify the environment variables by checking logs
```kubectl logs pods/env-configmap```

### Use a specific key of a ConfigMap as an environment variable in a Pod
Step 1: Create the pod
```
apiVersion: v1
kind: Pod
metadata:
  name: env-configmap
spec:
  containers:
  - name: envars-test-container
    image: nginx
    env:
    - name: CONFIGMAP_KEY1
      valueFrom:
        configMapKeyRef:
          name: my-config-map
          key: key1
```
Step 2: Verify
```kubectl describe pod env-configmap```

## Secrets
### Create a Secret using `kubectl`
```kubectl create secret generic my-secret --from-literal=key1=supersecret --from-literal=key2=topsecret```

### Create a Secret using a YAML file
```
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
data:
  key1: dmFsdWUxCg==
  key2: dmFsdWUyCg==
```

### Use all keys of a Secret as environment variables in a Pod
Step 1: Create a pod and print the env vars
```
apiVersion: v1
kind: Pod
metadata:
  name: envfrom-secret
spec:
  containers:
  - name: envars-test-container
    image: busybox:latest
    command: ["/bin/sh", "-c", "printenv"]
    envFrom:
    - secretRef:
        name: my-secret
```

Step 2: Verify from logs
```kubectl logs envfrom-secret```

### Use a specific key of a Secret as an environment variable in a Pod
Step 1: Create pod
```
apiVersion: v1
kind: Pod
metadata:
  name: env-single-secret
spec:
  containers:
  - name: envars-test-container
    image: nginx
    env:
    - name: SECRET_KEY1
      valueFrom:
        secretKeyRef:
          name: my-secret
          key: key1
```

Step 2: Verify
```kubectl describe pod env-single-secret```

## Resource Requests and Limits
### Set limits and requests of CPU and memory for a container
```
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources-demo
spec:
  containers:
  - name: pod-resources-demo
    image: nginx
    resources:
      limits:
        cpu: "0.5"
        memory: "100Mi"
      requests:
        cpu: "0.5"
        memory: "50Mi"
```

## LimitRange
### Create a namespace 
```kubectle create namespace limit-range-demo```

### Create a limit range in the namespace and define default, min and max requests and limits of CPU and memory 
```
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-resource-constraint
  namespace: limit-range-demo
spec:
  limits:
  - default: # this section defines default limits
      cpu: "500m"
      memory: "600Mi"
    defaultRequest: # this section defines default requests
      cpu: "100m"
      memory: "200Mi"
    max: # max and min define the limit range
      cpu: "100m"
      memory: "700Mi"
    min:
      cpu: "50m"
      memory: "150Mi"
    type: Container

```

### Create a pod in the namespace without specifying requests/limits
Step 1: Create 
```kubectl run nginx --image nginx --namespace limit-range-demo ```

Step 2: Verify
```kubectl describe pod nginx --namespace limit-range-demo```
Default limits and requests should be set to the pod


### Create a pod in the namespace specifying requests and limits within the limit range
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
  namespace: limit-range-demo
spec:
  containers:
  - image: nginx
    name: nginx
    resources:
      requests:
        cpu: 300m
        memory: 150Mi
      limits:
        cpu: 400m
        memory: 400Mi
```

### Create a pod in the namespace specifying requests and limits outisde of the limit range
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
  namespace: limit-range-demo
spec:
  containers:
  - image: nginx
    name: nginx
    resources:
      requests:
        cpu: 300m
        memory: 800Mi # This is over max 700
      limits:
        cpu: 400m
        memory: 400Mi
```


### Attempt to create a pod violating min/max constraints and observe failure
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
  namespace: limit-range-demo
spec:
  containers:
  - image: nginx
    name: nginx
    resources:
      requests:
        cpu: 300m
        memory: 800Mi # This is over max 600
```

## ResourceQuota
### Create a namespace
```kubectle create namespace rq-demo```

### Create a ResourceQuota in the namespace using YAML
```
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
  namespace: rq-demo
spec:
  hard:
    requests.cpu: "50m"
    requests.memory: "500Mi"
    limits.cpu: "200m"
    limits.memory: "2000Mi"
    pods: "4"
```

### Create resources to consume quota and observe usage changes

Step 1 - Create a pod
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx
  namespace: rq-demo
spec:
  containers:
  - image: nginx
    name: nginx
    resources:
      requests:
        memory: "400Mi"
        cpu: "30m"
      limits:
        memory: "800Mi"
        cpu: "50m"
```
Step 2 - Describe the quota
```kubectl describe resourcequotas --namespace rq-demo```
We should see the use CPU and memory resources

### Attempt to exceed quota limits and observe failure
```
apiVersion: v1
kind: Pod
metadata:
  labels:
    run: nginx
  name: nginx-failure-cpu-exceed
  namespace: rq-demo
spec:
  containers:
  - image: nginx
    name: nginx
    resources:
      requests:
        memory: "400Mi"
        cpu: "30m" #Quota is set to 50m. Previous pod took 30m. Hence only 20m is left
      limits:
        memory: "800Mi"
        cpu: "50m"
```
