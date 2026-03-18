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
# Create a ConfigMap from literals
kubectl create configmap app-settings \
  --from-literal=APP_COLOR=blue \
  --from-literal=APP_MODE=production

# Inspect the ConfigMap
kubectl get configmap app-settings -o yaml

# Generate a Pod manifest that uses a specific ConfigMap key
kubectl run configmap-specific-key --image=busybox:1.36 --dry-run=client -o yaml

# List ConfigMaps in the current namespace
kubectl get configmaps
```