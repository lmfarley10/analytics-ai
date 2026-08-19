# Choose Your Next Step

## Introduction

You have completed the Enterprise AI Fabric companion workflow. This lab helps you convert the implementation brief into an Oracle-supported customer engagement while keeping private implementation assets out of the public LiveLabs repository.

Estimated Time: 10 minutes

### Objectives

In this lab, you will:

* Review the companion implementation deliverables.
* Select a reference recipe or reusable pattern.
* Request the appropriate implementation package from Oracle.
* Define versioning and ongoing validation expectations.

## Task 1: Review your implementation brief

1. Confirm that the brief contains:

    * Business outcome, measurable success criteria, and out-of-scope items.
    * Selected recipe, agent pattern, MCP boundary, and tool allowlist.
    * Data, identity, memory, model, governance, and approval decisions.
    * OCI service, network, configuration, and secret inventories.
    * Deployment sequence, release gates, validation evidence, and operational owners.

2. Mark every unresolved data, identity, system-of-record, or consequential-action decision as a blocker.

## Task 2: Select the starting asset

1. Choose the closest starting point from the supplied Fabric release:

    | Starting asset | Use when |
    |---|---|
    | Smart Dispatch recipe | The use case needs guided intake, database research, memory, and a human-approved action |
    | Invoice Automation recipe | The use case needs document processing, classification, exception review, and governed financial workflow |
    | Meridian Bank recipe | The use case needs peer-agent handoff with a deterministic high-stakes decision boundary |
    | EBS Invoice Reconciliation recipe | The use case needs document extraction and deterministic three-way matching behind an integration boundary |
    | Agentic accelerator | The customer needs a reusable workflow pattern instead of a complete interface and backend |
    | Application stub | The solution needs a clean production-oriented API, CLI, agent, tool, prompt, and configuration scaffold |

2. Treat every recipe as a reference implementation. Replace business rules, prompts, tools, schemas, identity mappings, and interfaces through the customer's approved engineering and review process.

## Task 3: Request implementation access

1. Contact [anup.ojah@oracle.com](mailto:anup.ojah@oracle.com) to discuss access to the separately distributed Enterprise AI Fabric implementation.

2. Use this request outline:

    ```text
    Subject: Enterprise AI Fabric implementation request - <customer or project>

    Customer/project:
    Oracle account team:
    Business use case and expected outcome:
    Selected reference recipe or pattern:
    OCI region and tenancy status:
    Required data sources and systems of record:
    Identity and security constraints:
    Proof-of-value or production timeline:
    Technical and business owners:
    ```

3. Oracle will determine the appropriate access, licensing, support, and delivery mechanism. Do not upload the package or private repository contents to this public LiveLabs repository.

## Task 4: Maintain the companion relationship

1. Pin every customer implementation to an approved Fabric release, tag, or commit identifier.

2. Revalidate the implementation when the Fabric release, model, agent prompts, tool registry, database policy, identity configuration, or system-of-record action changes.

3. Keep the companion LiveLab conceptual and customer-safe. Place version-specific source commands, private endpoints, credentials, customer diagrams, and detailed incident evidence only in the approved delivery system.

4. Contribute customer-safe clarifications and sanitized visuals back to the LiveLab through the standard Oracle LiveLabs review process.

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
