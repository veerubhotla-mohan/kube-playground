import podNotes from '../../ckad/section_01_core_concepts/01_pods/notes.md?raw'
import envNotes from '../../ckad/section_02_configuration/01_env_variables/notes.md?raw'
import envLiteralYaml from '../../ckad/section_02_configuration/01_env_variables/01_env_literal.yaml?raw'
import secretsNotes from '../../ckad/section_02_configuration/02_secrets/notes.md?raw'
import secretBasicYaml from '../../ckad/section_02_configuration/02_secrets/01_secret_basic.yaml?raw'
import podSecretEntireYaml from '../../ckad/section_02_configuration/02_secrets/02_pod_secret_entire.yaml?raw'
import podSecretSpecificKeyYaml from '../../ckad/section_02_configuration/02_secrets/03_pod_secret_specific_key.yaml?raw'
import configMapsNotes from '../../ckad/section_02_configuration/03_configmaps/notes.md?raw'
import configMapBasicYaml from '../../ckad/section_02_configuration/03_configmaps/01_configmap_basic.yaml?raw'
import podConfigMapEntireYaml from '../../ckad/section_02_configuration/03_configmaps/02_pod_configmap_entire.yaml?raw'
import podConfigMapSpecificKeyYaml from '../../ckad/section_02_configuration/03_configmaps/03_pod_configmap_specific_key.yaml?raw'
import podYaml from '../../ckad/section_01_core_concepts/01_pods/01_pod_basic.yaml?raw'
import replicaSetNotes from '../../ckad/section_01_core_concepts/02_replicasets/notes.md?raw'
import replicaSetYaml from '../../ckad/section_01_core_concepts/02_replicasets/01_replicaset_basic.yaml?raw'
import deploymentNotes from '../../ckad/section_01_core_concepts/03_deployments/notes.md?raw'
import deploymentYaml from '../../ckad/section_01_core_concepts/03_deployments/01_deployment_basic.yaml?raw'
import deploymentRecreateYaml from '../../ckad/section_01_core_concepts/03_deployments/02_deployment_recreate.yaml?raw'
import namespaceNotes from '../../ckad/section_01_core_concepts/04_namespaces/notes.md?raw'
import namespaceYaml from '../../ckad/section_01_core_concepts/04_namespaces/01_namespace_basic.yaml?raw'
import securityContextNotes from '../../ckad/section_02_configuration/04_security_context/notes.md?raw'
import podSecurityContextYaml from '../../ckad/section_02_configuration/04_security_context/01_pod_security_context.yaml?raw'
import podContainerSecurityOverrideYaml from '../../ckad/section_02_configuration/04_security_context/02_pod_container_security_override.yaml?raw'
import resourceRequirementsNotes from '../../ckad/section_02_configuration/05_resource_requirements/notes.md?raw'
import podRequestsLimitsYaml from '../../ckad/section_02_configuration/05_resource_requirements/01_pod_requests_limits.yaml?raw'
import podMultiContainerResourcesYaml from '../../ckad/section_02_configuration/05_resource_requirements/02_pod_multiple_containers_resources.yaml?raw'
import limitRangeNotes from '../../ckad/section_02_configuration/06_limitrange/notes.md?raw'
import limitRangeDefaultsYaml from '../../ckad/section_02_configuration/06_limitrange/01_limitrange_container_defaults.yaml?raw'
import podWithoutResourcesYaml from '../../ckad/section_02_configuration/06_limitrange/02_pod_without_resources.yaml?raw'
import taintsAndTolerationsNotes from '../../ckad/section_02_configuration/07_taints_and_tolerations/notes.md?raw'
import podToleratesNoScheduleYaml from '../../ckad/section_02_configuration/07_taints_and_tolerations/01_pod_tolerates_noschedule.yaml?raw'
import podToleratesNoExecuteYaml from '../../ckad/section_02_configuration/07_taints_and_tolerations/02_pod_tolerates_noexecute.yaml?raw'
import nodeSelectorsNotes from '../../ckad/section_02_configuration/08_node_selectors/notes.md?raw'
import podNodeSelectorYaml from '../../ckad/section_02_configuration/08_node_selectors/01_pod_node_selector.yaml?raw'

export const tutorialSections = [
  {
    id: 'section-01-core-concepts',
    label: 'Section 01 - Core Concepts',
    concepts: [
      {
        id: 'pods',
        title: 'Pods',
        notesRaw: podNotes,
        yamlRaw: podYaml,
        exampleSummary:
          'This manifest creates one Pod named nginx with a single nginx container.',
      },
      {
        id: 'replicasets',
        title: 'ReplicaSets',
        notesRaw: replicaSetNotes,
        yamlRaw: replicaSetYaml,
        exampleSummary:
          'This ReplicaSet keeps three identical nginx Pods running using matching labels and selectors.',
      },
      {
        id: 'deployments',
        title: 'Deployments',
        notesRaw: deploymentNotes,
        examples: [
          {
            title: 'RollingUpdate Strategy',
            summary:
              'This Deployment uses RollingUpdate to replace Pods gradually with minimal downtime.',
            yamlRaw: deploymentYaml,
          },
          {
            title: 'Recreate Strategy',
            summary:
              'This Deployment uses Recreate to stop all old Pods first, then create fresh Pods.',
            yamlRaw: deploymentRecreateYaml,
          },
        ],
      },
      {
        id: 'namespaces',
        title: 'Namespaces',
        notesRaw: namespaceNotes,
        yamlRaw: namespaceYaml,
        exampleSummary:
          'This manifest creates a namespace called dev-team to isolate team resources in the cluster.',
      },
    ],
  },
  {
    id: 'section-02-configuration',
    label: 'Section 02 - Configuration',
    concepts: [
      {
        id: 'env-variables',
        title: 'Environment Variables',
        notesRaw: envNotes,
        yamlRaw: envLiteralYaml,
        exampleSummary: 'Pod with two literal env vars (APP_COLOR and APP_MODE) defined inline in the container spec.',
      },
      {
        id: 'secrets',
        title: 'Secrets',
        notesRaw: secretsNotes,
        examples: [
          {
            title: 'Secret Resource',
            summary:
              'Defines an Opaque Secret named app-credentials with username and password keys via stringData.',
            yamlRaw: secretBasicYaml,
          },
          {
            title: 'Use Entire Secret In Pod',
            summary:
              'Imports all keys from app-credentials into the container environment using envFrom.secretRef.',
            yamlRaw: podSecretEntireYaml,
          },
          {
            title: 'Use Specific Secret Key In Pod',
            summary:
              'Injects only the username key from app-credentials into DB_USER using valueFrom.secretKeyRef.',
            yamlRaw: podSecretSpecificKeyYaml,
          },
        ],
      },
      {
        id: 'configmaps',
        title: 'ConfigMaps',
        notesRaw: configMapsNotes,
        examples: [
          {
            title: 'ConfigMap Resource',
            summary:
              'Defines a ConfigMap named app-settings with non-sensitive application settings stored under data.',
            yamlRaw: configMapBasicYaml,
          },
          {
            title: 'Use Entire ConfigMap In Pod',
            summary:
              'Imports all keys from app-settings into the container environment using envFrom.configMapRef.',
            yamlRaw: podConfigMapEntireYaml,
          },
          {
            title: 'Use Specific ConfigMap Key In Pod',
            summary:
              'Injects only the APP_COLOR key from app-settings into APP_COLOR using valueFrom.configMapKeyRef.',
            yamlRaw: podConfigMapSpecificKeyYaml,
          },
        ],
      },
      {
        id: 'security-context',
        title: 'Security Context',
        notesRaw: securityContextNotes,
        examples: [
          {
            title: 'Pod-Level runAsUser',
            summary:
              'Defines a Pod-level runAsUser value that acts as the default UID for containers in the Pod.',
            yamlRaw: podSecurityContextYaml,
          },
          {
            title: 'Container Override + Capabilities',
            summary:
              'Overrides pod-level runAsUser in one container and drops all Linux capabilities at container scope.',
            yamlRaw: podContainerSecurityOverrideYaml,
          },
        ],
      },
      {
        id: 'resource-requirements',
        title: 'Resource Requirements',
        notesRaw: resourceRequirementsNotes,
        examples: [
          {
            title: 'Single Container Requests and Limits',
            summary:
              'Defines CPU and memory requests for scheduling and limits for runtime enforcement in one nginx container.',
            yamlRaw: podRequestsLimitsYaml,
          },
          {
            title: 'Multi-Container Resource Sizing',
            summary:
              'Shows requests and limits per container in a sidecar Pod so scheduler decisions use the Pod-level sum.',
            yamlRaw: podMultiContainerResourcesYaml,
          },
        ],
      },
      {
        id: 'limitrange',
        title: 'LimitRange',
        notesRaw: limitRangeNotes,
        examples: [
          {
            title: 'Container Defaults and Bounds',
            summary:
              'Defines default requests/limits plus min and max resource boundaries for all containers in a namespace.',
            yamlRaw: limitRangeDefaultsYaml,
          },
          {
            title: 'Pod Without Explicit Resources',
            summary:
              'A Pod that omits resources so LimitRange admission defaults can be injected automatically.',
            yamlRaw: podWithoutResourcesYaml,
          },
        ],
      },
      {
        id: 'taints-and-tolerations',
        title: 'Taints and Tolerations',
        notesRaw: taintsAndTolerationsNotes,
        examples: [
          {
            title: 'Match a NoSchedule Taint',
            summary:
              'This Pod tolerates dedicated=batch:NoSchedule so the scheduler may place it on a node reserved for batch workloads.',
            yamlRaw: podToleratesNoScheduleYaml,
          },
          {
            title: 'Temporarily Tolerate NoExecute',
            summary:
              'This Pod uses operator Exists with tolerationSeconds so it can remain on a node for five minutes after a maintenance NoExecute taint is applied.',
            yamlRaw: podToleratesNoExecuteYaml,
          },
        ],
      },
      {
        id: 'node-selectors',
        title: 'Node Selectors',
        notesRaw: nodeSelectorsNotes,
        yamlRaw: podNodeSelectorYaml,
        exampleSummary:
          'This Pod uses nodeSelector to require both disktype=ssd and workload=api on the target node before scheduling can succeed.',
      },
    ],
  },
]
