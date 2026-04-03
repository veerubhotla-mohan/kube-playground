# Environment Variables

## What is it?
In Kubernetes, **environment variables** allow you to inject configuration data directly into containers at runtime. They decouple configuration from the container image. The simplest form defines values inline in the Pod spec under `env[].value` — no external resource required.

## Key Characteristics
- **Defined in `env[]`**: Each variable is declared as a name and value pair directly in the container spec. This makes simple configuration explicit and easy to read in the YAML manifest.
- **Scoped to a container**: Environment variables are configured per container, even when multiple containers exist in one Pod. If two containers need the same variable, you must define it in both container sections.
- **Immutable at runtime**: Values are injected when the container process starts and do not auto-update afterward. When configuration changes, a new Pod rollout is typically required to apply updated values.
- **Available to all processes**: Any process running inside the container can read these variables from its environment. This is why env vars are a common way to pass app settings such as ports, modes, or endpoint URLs.
- **Reference other sources**: Using `valueFrom`, env vars can come from ConfigMaps, Secrets, or Pod fields instead of hardcoded text. This supports cleaner and safer configuration management, especially for sensitive or frequently changed values.

## Commands
```kubectl
# Create a Pod with an environment variable set imperatively
kubectl run nginx --image=nginx --env="APP_COLOR=blue"

# Set multiple env vars imperatively (repeat --env for each)
kubectl run nginx --image=nginx --env="APP_COLOR=blue" --env="APP_MODE=prod"

# Generate a Pod manifest with env vars (dry-run trick — edit then apply)
kubectl run nginx --image=nginx --env="APP_COLOR=blue" --dry-run=client -o yaml > pod.yaml
kubectl apply -f pod.yaml

# List all env variables inside a running container
kubectl exec <pod-name> -- env

# Describe a Pod to inspect its declared environment variables
kubectl describe pod <pod-name>
```

## Setting env vars in a YAML definition file
Define variables under `spec.containers[].env` as a list of `name`/`value` pairs:

```yaml
spec:
  containers:
    - name: nginx
      image: nginx
      env:
        - name: APP_COLOR
          value: "blue"
        - name: APP_MODE
          value: "prod"
```

Apply the file:

```kubectl
kubectl apply -f pod.yaml
```
