# Deployment Strategies — Blue-Green & Canary

## What is it?
Advanced release strategies that control how traffic shifts from an old version of an application to a new one, beyond the built-in RollingUpdate and Recreate strategies. Both patterns are implemented using standard Kubernetes objects (Deployments + Services) rather than a dedicated resource type.

## Key Characteristics

### Blue-Green
- Two full Deployments run simultaneously: **blue** (current) and **green** (new version).
- A single Service selects traffic using a `slot` label (`blue` or `green`).
- Cutover is instant — patch the Service selector from `slot: blue` to `slot: green`.
- Rollback is instant — patch the selector back to `slot: blue`.
- Requires **double the resources** during the transition window.
- Use case: zero-downtime releases where a hard instant cutover is acceptable.

### Canary
- A **stable** Deployment serves the majority of traffic (e.g. 4 replicas).
- A **canary** Deployment runs the new version with a small replica count (e.g. 1 replica).
- A single Service selects **both** Deployments using a shared `app` label; kube-proxy splits traffic proportionally by Pod count.
- Traffic ratio is controlled by adjusting replica counts (e.g. 4:1 = ~20% canary).
- Promote by scaling up the canary and scaling down (or deleting) stable, or roll back by deleting the canary Deployment.
- Use case: gradual roll-out with real traffic validation before full promotion.

## Commands

```kubectl
# --- Blue-Green ---

# Deploy both versions
kubectl apply -f 01_blue_green_deployment_blue.yaml
kubectl apply -f 02_blue_green_deployment_green.yaml
kubectl apply -f 03_blue_green_service.yaml

# Verify which slot the Service currently targets
kubectl get svc app-service -o jsonpath='{.spec.selector}'

# Cut traffic over to green (instant switchover)
kubectl patch svc app-service -p '{"spec":{"selector":{"app":"my-app","slot":"green"}}}'

# Roll back to blue
kubectl patch svc app-service -p '{"spec":{"selector":{"app":"my-app","slot":"blue"}}}'

# --- Canary ---

# Deploy stable and canary Deployments plus the shared Service
kubectl apply -f 04_canary_deployment_stable.yaml
kubectl apply -f 05_canary_deployment_canary.yaml
kubectl apply -f 06_canary_service.yaml

# Check pod counts across both Deployments
kubectl get pods -l app=my-app --show-labels

# Increase canary traffic share by scaling up canary replicas
kubectl scale deployment app-canary --replicas=2

# Promote canary: scale up to full and remove stable
kubectl scale deployment app-canary --replicas=5
kubectl delete deployment app-stable

# Roll back: delete canary Deployment
kubectl delete deployment app-canary
```
