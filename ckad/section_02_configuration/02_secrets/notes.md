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
# Create a secret from literals
kubectl create secret generic app-credentials \
  --from-literal=username=ckad-user \
  --from-literal=password=s3cr3t-pass

# Inspect secret keys (values are base64-encoded)
kubectl get secret app-credentials -o yaml

# Decode one key value
kubectl get secret app-credentials -o jsonpath='{.data.username}' | base64 -d; echo

# Use all keys from a secret as env vars in a generated Pod manifest
kubectl run secret-entire-env --image=busybox:1.36 --dry-run=client -o yaml
```
