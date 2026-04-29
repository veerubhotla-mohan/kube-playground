# CKAD Practice Checklist – Section 3: Configuration

## Environment Variables
- [ ] Create a pod with environment variables using YAML
- [ ] Create a pod with environment variables using `kubectl`

## ConfigMaps
- [ ] Create a ConfigMap using `kubectl`
- [ ] Create a ConfigMap using a YAML file
- [ ] Use all keys of a ConfigMap as environment variables in a Pod
- [ ] Use a specific key of a ConfigMap as an environment variable in a Pod

## Secrets
- [ ] Create a Secret using `kubectl`
- [ ] Create a Secret using a YAML file
- [ ] Use all keys of a Secret as environment variables in a Pod
- [ ] Use a specific key of a Secret as an environment variable in a Pod

## Resource Requests and Limits
- [ ] Set CPU requests for a container
- [ ] Set memory requests for a container
- [ ] Set CPU limits for a container
- [ ] Set memory limits for a container
- [ ] Verify resource configuration using `kubectl describe`

## LimitRange
- [ ] Create a namespace with a LimitRange configured
- [ ] Define default CPU and memory requests in LimitRange
- [ ] Define default CPU and memory limits in LimitRange
- [ ] Define minimum CPU and memory requests/limits in LimitRange
- [ ] Define maximum CPU and memory requests/limits in LimitRange
- [ ] Create a pod in the namespace without specifying requests/limits
- [ ] Verify that default values are applied from LimitRange
- [ ] Attempt to create a pod violating min/max constraints and observe failure

## ResourceQuota
- [ ] Create a namespace
- [ ] Create a ResourceQuota in the namespace using YAML
- [ ] Set CPU limits quota
- [ ] Set memory limits quota
- [ ] Set pod count limit
- [ ] Verify quota usage using `kubectl describe quota`
- [ ] Create resources to consume quota and observe usage changes
- [ ] Attempt to exceed quota limits and observe failure
