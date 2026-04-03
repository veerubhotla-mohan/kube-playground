# ConfigMaps

## What is it?
A ConfigMap is a Kubernetes object used to store non-sensitive configuration data as key-value pairs. Pods can consume ConfigMap values as environment variables, command arguments, or mounted files without rebuilding the container image.

## Key Characteristics
- ConfigMaps are namespaced resources, so Pods typically reference ConfigMaps in the same namespace.
- They are intended for non-confidential data such as application settings, feature flags, ports, or endpoint URLs.
- Data can be consumed in multiple ways: `envFrom` (all keys), `configMapKeyRef` (single key), or volume mounts (files).
- Updating a ConfigMap does not automatically restart Pods using env vars; a rollout or Pod restart is usually required.
- ConfigMaps separate runtime configuration from the image, which improves portability across environments.

## Commands
```kubectl
# Create a ConfigMap from a YAML definition file
kubectl apply -f configmap.yaml

# Create a ConfigMap imperatively from literal values
kubectl create configmap app-settings \
  --from-literal=APP_COLOR=blue \
  --from-literal=APP_MODE=production

# Inspect the ConfigMap
kubectl get configmap app-settings -o yaml

# List ConfigMaps in the current namespace
kubectl get configmaps

# Delete a ConfigMap
kubectl delete configmap app-settings
```

## Using a ConfigMap in a Pod

### Inject all keys as env vars (`envFrom`)
All keys in the ConfigMap become environment variables in the container:

```yaml
spec:
  containers:
    - name: app
      image: nginx
      envFrom:
        - configMapRef:
            name: app-settings   # every key becomes an env var
```

### Inject a specific key as an env var (`valueFrom`)
Map one ConfigMap key to a named environment variable:

```yaml
spec:
  containers:
    - name: app
      image: nginx
      env:
        - name: APP_COLOR                 # env var name inside the container
          valueFrom:
            configMapKeyRef:
              name: app-settings          # ConfigMap name
              key: APP_COLOR              # key inside the ConfigMap
```

Apply any Pod manifest:

```kubectl
kubectl apply -f pod.yaml
```