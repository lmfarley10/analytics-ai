# Companion LiveLab Asset Inventory

## Introduction

This author-only inventory records the provenance and publication review of visual assets used by the Project Inception companion LiveLab. It is not referenced by the workshop manifest.

Estimated Time: 5 minutes

### Objectives

This inventory helps workshop maintainers:

* Preserve traceability to the separately maintained Fabric project.
* Confirm that published visuals contain no obvious tokens, credentials, OCIDs, customer URLs, or restricted markings.
* Prefer Fabric-native visuals over images from unrelated LiveLabs.

## Included assets

| Companion destination | Fabric package source | Review note |
|---|---|---|
| `0-introduction/images/code-accelerators.png` | `docs/images/code_accelerator.png` | Conceptual accelerator overview; no visible customer identifiers or secrets |
| `0-introduction/images/agent-patterns.png` | `inception_core/accelerators/patterns_agentic/src/agent_pattern.png` | Conceptual pattern catalog; no visible customer identifiers or secrets |
| `2-foundation/images/code-accelerators.png` | `docs/images/code_accelerator.png` | Same approved conceptual overview reused to keep each lab self-contained |
| `2-foundation/images/agent-patterns.png` | `inception_core/accelerators/patterns_agentic/src/agent_pattern.png` | Same approved pattern catalog reused to keep each lab self-contained |
| `3-mcp-and-recipes/images/smart-dispatch-architecture.png` | `inception_recipes/smart_dispatch/docs/image.png` | Customer-safe solution architecture; no visible credentials or environment identifiers |
| `4-governance-and-security/images/mcp-oauth-settings.png` | `inception_mcp_servers/mcp_os/mcpinterceptorwithoidc.png` | OAuth settings screen uses localhost and displays no token |

## Excluded assets

| Fabric package source | Reason excluded |
|---|---|
| `inception_mcp_servers/mcp_os/mcpinterceptorwithtoken.png` | Displays a bearer token fragment and must not be published |
| `inception_devops/deploy_runbook/step-readme/images/deployment-architecture.png` | Contains internal annotations and requires separate publication clearance |
| `inception_devops/deploy_runbook/step-readme/images/deployment-architecture-integration.png` | Contains a restricted-use marking and must not be published |
| `inception_recipes/invoice_automation/invoice_automation_ui/frontend/IAM-Arch.png` | Contains internal prototype and application names; use only after owner review and sanitization |
| `docs/deployment/business_media/media/*` | Mixed screenshot set containing environment-specific values; review individually before future use |

## Maintenance rules

* Fabric resources are the first source for all new workshop visuals and implementation explanations.
* Other LiveLabs may be used only for LiveLabs structure or a generic OCI step that the Fabric documentation does not provide.
* Every new screenshot requires visual inspection and a text-level secret scan before publication.
* Copy approved files into the companion lab so the published workshop never depends on the private repository path.
* Re-review an image whenever the source asset changes.

## Acknowledgements

* **Authors** - [Anup Ojah](https://github.com/aojah1) and [Luke Farley](https://github.com/lmfarley10), Oracle
* **Contributors**
    * [adrianjalba](https://github.com/adrianjalba)
    * [Andre Correa](https://github.com/andrecorreaneto)
    * [Anup Ojah](https://github.com/aojah1)
    * [Chandrak1907](https://github.com/Chandrak1907)
    * [dawsonmaverick](https://github.com/dawsonmaverick)
    * [Gilson Melo](https://github.com/gilsonmelo)
    * [Greg Keys](https://github.com/gregkeysquest)
    * [JB Anderson](https://github.com/JBAnderson5)
    * [Johannes Murmann](https://github.com/jomurmann)
    * [Kiran Thakkar](https://github.com/kiranthakkar)
    * [mantis](https://github.com/mantis-place)
    * [Noah Paul](https://github.com/npaul64)
    * [Oscar T.](https://github.com/OT16)
    * [praveenkothari](https://github.com/praveenkothari)
    * [rajesharora99](https://github.com/rajesharora99)
    * [Richard Piantini Cid](https://github.com/richardpiantini)
    * [Sania Bolla](https://github.com/sania-bolla)
* **Last Updated By/Date** - Project Inception Team, August 2026
