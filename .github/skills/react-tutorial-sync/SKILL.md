---
name: react-tutorial-sync
description: 'Update the k8s-tutorial-app React tutorial when Kubernetes topics are added or changed. Use for syncing CKAD notes and YAML into UI with minimal, non-breaking edits that preserve the current structure and styling.'
argument-hint: 'Describe the content change, e.g. add section, add concept, update notes, or add multiple YAML examples'
user-invocable: true
---

# React Tutorial Sync

## Purpose
Keep the existing React tutorial app aligned with repository Kubernetes learning content while preserving current architecture, UI behavior, and style.

## Use When
- A new Kubernetes concept folder is added under ckad.
- Existing notes.md or YAML manifests are updated and app content must reflect the change.
- A concept needs one or more example manifests shown in the app.
- You want safe, minimal app updates without refactoring unrelated code.

## Primary Targets
- k8s-tutorial-app/src/contentData.js
- k8s-tutorial-app/src/App.jsx
- k8s-tutorial-app/src/index.css
- ckad/**/notes.md
- ckad/**/*.yaml

## Workflow

### 1. Discover Content Delta
1. Identify which section and concept changed in ckad.
2. Confirm required source files exist:
   - notes.md
   - one or more YAML manifests
3. Reuse existing naming and folder conventions.

### 2. Choose Data Shape (Decision Point)
1. If concept has exactly one YAML example:
   - Use fields: yamlRaw and exampleSummary.
2. If concept has multiple YAML examples:
   - Use examples array with objects: title, summary, yamlRaw.
3. If only notes changed and YAML unchanged:
   - Keep the existing data shape and only update affected imports/content.

### 3. Update Content Wiring
1. Add or adjust raw imports in contentData.js using ?raw.
2. Update the correct section entry in tutorialSections.
3. For new concepts:
   - Append a concept object in the right section concepts list.
4. For new sections:
   - Add a new section object with id, label, and concepts.

### 4. Keep Rendering Backward-Compatible
1. Preserve existing App.jsx rendering paths for:
   - Single example concepts
   - Multi-example concepts
2. Avoid changing parser behavior unless required by new note format.
3. If note format differs, make the smallest tolerant regex adjustment.

### 5. Style Only If Needed
1. Add CSS only for newly introduced markup classes.
2. Do not restyle existing layout, palette, spacing system, or typography unless requested.

### 6. Safety Validation
1. Run build:
   - cd k8s-tutorial-app
   - npm run build
2. Confirm no compile/runtime errors.
3. Verify target concept appears under the correct section tab.
4. Verify existing concepts still render:
   - What is it
   - Key Characteristics
   - Commands
   - YAML example block(s)

## Completion Criteria
- New/updated Kubernetes topic is visible in app navigation and content pane.
- Existing concepts still render correctly.
- No unrelated code paths changed.
- Build succeeds without new errors.

## Guardrails
- Prefer minimal edits over refactors.
- Preserve current file structure and data model conventions.
- Do not remove existing concept fields unless replacing with compatible multi-example support.
- Avoid introducing new dependencies for content syncing.
