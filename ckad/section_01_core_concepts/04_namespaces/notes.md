# Namespaces

## What is it?
A **Namespace** is a logical partition inside a Kubernetes cluster that lets you organize and isolate resources (Pods, Services, Deployments, etc.) within the same physical cluster.

## Key Characteristics
- **Name scoping**: Resource names must be unique within a namespace, not across the whole cluster. This means two teams can each have a Deployment named `app` in their own namespace without any collision.
- **Multi-tenancy**: Multiple teams, projects, or environments (dev, stage, prod) can share one physical cluster with logical boundaries between them. This reduces infrastructure costs while keeping workloads clearly organized.
- **RBAC integration**: Role-Based Access Control policies are namespace-scoped, so you can grant a team full control over their own namespace while preventing them from touching other namespaces. This is a key building block for cluster security.
- **Resource governance**: `ResourceQuota` caps cumulative CPU, memory, and object counts per namespace, and `LimitRange` sets default per-Pod limits. Together they prevent any one team from starving the rest of the cluster.
- **Namespaced vs cluster-scoped resources**: Resources like Pods, Deployments, and Services live inside a namespace and require the `-n` flag when targeted by kubectl. Resources like Nodes, PersistentVolumes, and Namespaces themselves are cluster-wide and ignore the `-n` flag.
- **Built-in namespaces**: Kubernetes ships with `default` (user workloads when no namespace is specified), `kube-system` (core cluster components), `kube-public` (publicly readable data), and `kube-node-lease` (node heartbeat leases). In real projects, creating dedicated namespaces for each application or team is a widely adopted best practice.

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
