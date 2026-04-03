# Secrets

## What is it?
A Secret is a Kubernetes object used to store sensitive data, such as passwords, tokens, or keys, separately from Pod images and manifests. Pods can consume Secret values as environment variables or mounted files.

## Key Characteristics
- Secrets are namespaced resources, so they are accessed by Pods in the same namespace unless explicitly copied.
- Data is stored as key-value pairs. In manifests, `stringData` accepts plaintext input and Kubernetes converts it to base64 under `data`.
- Secrets can be consumed in multiple ways: `envFrom` (all keys), `secretKeyRef` (single key), or volume mounts (files).
- Updating a Secret does not automatically restart Pods using env vars; rolling restart is typically needed for apps to pick up new values.
- Base64 encoding is not encryption by itself. Use encryption at rest and strict RBAC in real clusters.

## Commands
```kubectl
# Create a Secret from a YAML definition file
kubectl apply -f secret.yaml

# Create a Secret imperatively from literal values
kubectl create secret generic app-credentials \
  --from-literal=username=ckad-user \
  --from-literal=password=s3cr3t-pass

# Inspect secret keys (values are base64-encoded)
kubectl get secret app-credentials -o yaml

# Decode a specific key value
kubectl get secret app-credentials -o jsonpath='{.data.username}' | base64 -d; echo

# List all Secrets in the current namespace
kubectl get secrets

# Delete a Secret
kubectl delete secret app-credentials
```

## Using a Secret in a Pod

### Inject all keys as env vars (`envFrom`)
All keys in the Secret become environment variables in the container:

```yaml
spec:
  containers:
    - name: app
      image: nginx
      envFrom:
        - secretRef:
            name: app-credentials   # every key becomes an env var
```

### Inject a specific key as an env var (`valueFrom`)
Map one Secret key to a named environment variable:

```yaml
spec:
  containers:
    - name: app
      image: nginx
      env:
        - name: DB_USER                  # env var name inside the container
          valueFrom:
            secretKeyRef:
              name: app-credentials      # Secret name
              key: username              # key inside the Secret
```

Apply any Pod manifest:

```kubectl
kubectl apply -f pod.yaml
```
