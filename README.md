# kube-playground

A hands-on Kubernetes practice environment with structured notes for CKAD exam preparation.

> **Disclaimer:** This repository is a work in progress. Not all CKAD topics are covered yet — new sections and concepts will be added over time.

---

## Getting Started

This repo includes a [Dev Container](https://containers.dev/) that runs a full Kubernetes cluster inside Docker — no local Kubernetes installation needed.

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Setup

1. Open the VS Code command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
   **`Dev Containers: Clone Repository in Container Volume`**
2. Paste the repository URL and let VS Code clone it and build the container automatically.
3. Once the container starts, start the local Kubernetes cluster:
   ```bash
   minikube start
   ```
4. Then use `kubectl` as normal:
   ```bash
   kubectl get nodes
   ```

---

## Repository Structure

Currently the repository contains a `ckad/` folder with notes and manifests for CKAD exam preparation:

- Organized into **sections** by topic (e.g. Core Concepts, Configuration, Networking)
- Each section contains one folder per **concept**
- Every concept folder includes:
  - `notes.md` — definition, key characteristics, and useful `kubectl` commands
  - One or more `*.yaml` — annotated example manifests

The repository also includes a React tutorial website in `k8s-tutorial-app/` that visualizes CKAD notes and YAML examples.

### Tutorial Website (React)

```bash
cd k8s-tutorial-app
npm install
npm run dev
```

---

## CKAD Study Notes

### Section 01 — Core Concepts

| # | Topic | Notes |
|---|-------|-------|
| 01 | Pods | [notes.md](ckad/section_01_core_concepts/01_pods/notes.md) |
| 02 | ReplicaSets | [notes.md](ckad/section_01_core_concepts/02_replicasets/notes.md) |
| 03 | Deployments | [notes.md](ckad/section_01_core_concepts/03_deployments/notes.md) |
| 04 | Namespaces | [notes.md](ckad/section_01_core_concepts/04_namespaces/notes.md) |

### Section 02 — Configuration

| # | Topic | Notes |
|---|-------|-------|
| 01 | Environment Variables | [notes.md](ckad/section_02_configuration/01_env_variables/notes.md) |
| 02 | Secrets | [notes.md](ckad/section_02_configuration/02_secrets/notes.md) |
| 03 | ConfigMaps | [notes.md](ckad/section_02_configuration/03_configmaps/notes.md) |
| 04 | Security Context | [notes.md](ckad/section_02_configuration/04_security_context/notes.md) |
| 05 | Resource Requirements | [notes.md](ckad/section_02_configuration/05_resource_requirements/notes.md) |
| 06 | LimitRange | [notes.md](ckad/section_02_configuration/06_limitrange/notes.md) |
| 07 | Taints and Tolerations | [notes.md](ckad/section_02_configuration/07_taints_and_tolerations/notes.md) |
| 08 | Node Selectors | [notes.md](ckad/section_02_configuration/08_node_selectors/notes.md) |

> More sections covering the full CKAD syllabus (multi-container pods, observability, services & networking, state persistence, configuration, security, and more) will be added progressively.

---

## References

- [VS Code Dev Container Template: Kubernetes, Helm & Minikube](https://github.com/devcontainers/templates/tree/main/src/kubernetes-helm-minikube) — the base dev container template used by this repository, maintained by the VS Code team.
