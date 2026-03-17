# Namespaces

## What is it?
A **Namespace** is a logical partition inside a Kubernetes cluster that lets you organize and isolate resources (Pods, Services, Deployments, etc.) within the same physical cluster.

## Key Characteristics
- Provides **scope** for names: resource names must be unique within a Namespace, not across the whole cluster.
- Enables **multi-tenancy**: teams, environments (dev/stage/prod), or apps can share one cluster safely.
- Works with **RBAC** to control who can access resources in each Namespace.
- Works with **ResourceQuota** and **LimitRange** to control resource consumption per Namespace.
- Some resources are **namespaced** (Pods, Deployments), while others are **cluster-scoped** (Nodes, PersistentVolumes, Namespaces).
- Kubernetes includes default Namespaces such as `default`, `kube-system`, `kube-public`, and `kube-node-lease`.

## Commands
```kubectl
# List Namespaces
kubectl get namespaces
kubectl get ns

# Create a Namespace
kubectl create namespace dev

# Set current context Namespace (so commands default to it)
kubectl config set-context --current --namespace=dev

# Create/apply a resource into a specific Namespace
kubectl apply -f app.yaml -n dev

# List Pods in a Namespace
kubectl get pods -n dev

# Delete a Namespace (deletes namespaced resources inside it)
kubectl delete namespace dev
```
