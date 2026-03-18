import podNotes from '../../ckad/section_01_core_concepts/01_pods/notes.md?raw'
import envNotes from '../../ckad/section_02_configuration/01_env_variables/notes.md?raw'
import envLiteralYaml from '../../ckad/section_02_configuration/01_env_variables/01_env_literal.yaml?raw'
import secretsNotes from '../../ckad/section_02_configuration/02_secrets/notes.md?raw'
import secretBasicYaml from '../../ckad/section_02_configuration/02_secrets/01_secret_basic.yaml?raw'
import podSecretEntireYaml from '../../ckad/section_02_configuration/02_secrets/02_pod_secret_entire.yaml?raw'
import podSecretSpecificKeyYaml from '../../ckad/section_02_configuration/02_secrets/03_pod_secret_specific_key.yaml?raw'
import podYaml from '../../ckad/section_01_core_concepts/01_pods/01_pod_basic.yaml?raw'
import replicaSetNotes from '../../ckad/section_01_core_concepts/02_replicasets/notes.md?raw'
import replicaSetYaml from '../../ckad/section_01_core_concepts/02_replicasets/01_replicaset_basic.yaml?raw'
import deploymentNotes from '../../ckad/section_01_core_concepts/03_deployments/notes.md?raw'
import deploymentYaml from '../../ckad/section_01_core_concepts/03_deployments/01_deployment_basic.yaml?raw'
import deploymentRecreateYaml from '../../ckad/section_01_core_concepts/03_deployments/02_deployment_recreate.yaml?raw'
import namespaceNotes from '../../ckad/section_01_core_concepts/04_namespaces/notes.md?raw'
import namespaceYaml from '../../ckad/section_01_core_concepts/04_namespaces/01_namespace_basic.yaml?raw'

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
    ],
  },
]
