# Plan Your Companion Implementation

## Introduction

This lab establishes the boundary between the public companion material and the separately distributed Enterprise AI Fabric implementation. You will also record the customer decisions that must be resolved before deployment begins.

Estimated Time: 20 minutes

### Objectives

In this lab, you will:

* Confirm the code-access and support path.
* Inventory the people, OCI services, tools, and credentials required by the selected scope.
* Choose a proof-of-value or production-planning outcome.
* Create an implementation brief that can be matched to a supported Fabric release.

## Task 1: Understand the delivery boundary

1. Record that this LiveLab is an architecture and implementation companion, not a source-code distribution.

2. Use the following contact when your team wants to evaluate or obtain the implementation package:

    [anup.ojah@oracle.com](mailto:anup.ojah@oracle.com)

3. Include these details in the request:

    * Customer or organization name.
    * Oracle account team and technical owner.
    * Target business use case.
    * Expected proof-of-value or production timeline.
    * OCI region and existing tenancy status.
    * Required integrations and systems of record.
    * Data classification and security constraints.

4. Do not request or exchange source code, wallets, passwords, API keys, private keys, access tokens, or customer data through the LiveLabs repository.

5. When Oracle provides an implementation package, record its release tag or approved commit identifier in the implementation brief. All commands and component runbooks must be validated against that version.

## Task 2: Choose the engagement outcome

1. Select one primary outcome.

    | Outcome | Recommended scope | Completion evidence |
    |---|---|---|
    | Architecture discovery | Component and control decisions only | Approved solution brief and responsibility matrix |
    | Proof of value | One recipe, one governed MCP boundary, non-production data | Demonstrated workflow and validation report |
    | Production planning | Customer-specific landing zone, identity, data, integrations, operations | Reviewed deployment and operational-readiness plan |

2. Use Smart Dispatch as the default reference recipe unless another supplied recipe maps more directly to the customer outcome.

3. Define what is out of scope. Common exclusions for an initial proof of value include high availability, disaster recovery, multiple systems of record, automated production writes, and customer-specific user-interface development.

## Task 3: Inventory prerequisites

1. Confirm the people required for the selected outcome.

    * Customer solution owner and business process owner.
    * OCI tenancy and network administrator.
    * Identity-domain administrator.
    * Oracle Database administrator and data owner.
    * AI/application engineering owner.
    * Security, privacy, and risk reviewers.
    * Oracle delivery contact.

2. Confirm the baseline tools described by the Fabric implementation:

    | Tool | Baseline | Purpose |
    |---|---|---|
    | Python | 3.13 or the version specified by the supplied release | Agent services, MCP servers, and shared libraries |
    | Node.js | 18 or the version specified by the supplied recipe | Reference React interfaces and Node.js gateways |
    | SQLcl | Current version approved by the customer | SQLcl MCP data access |
    | OCI CLI | Customer-approved current version | OCI authentication and resource operations |
    | Git | Customer-approved current version | Versioned implementation package |
    | Terraform | 1.5 or the version specified by the supplied release | Optional infrastructure and security automation |

3. Confirm the OCI dependencies for the selected design. The full Fabric may use Oracle Autonomous Database, OCI Generative AI, Object Storage, Vault, Logging, API Gateway, Container Registry, Container Instances or Oracle Kubernetes Engine, Oracle Integration, and GoldenGate. Include only the components required by the customer scope.

4. Record whether the customer already has a landing zone, VCN, private endpoints, DNS, certificates, identity federation, approved model access, and a database wallet process.

## Task 4: Create the implementation brief

1. Capture the following decisions in the customer project system:

    | Decision | Customer selection |
    |---|---|
    | Business outcome | To be completed |
    | Reference recipe | Smart Dispatch or another approved recipe |
    | Fabric release identifier | Supplied by Oracle |
    | OCI region and compartment | To be completed |
    | Identity pattern | Interactive OIDC, non-interactive token exchange, or both |
    | Primary MCP server | To be completed |
    | Data and memory store | To be completed |
    | Deployment target | Local evaluation, Container Instances, or OKE |
    | System-of-record integration | Read-only, human-approved write, or out of scope |
    | Required reviewers | To be completed |

2. Confirm that no implementation begins until data access, identity ownership, and consequential-action approval have named owners.

3. Carry this implementation brief into each remaining lab and update it as decisions are made.

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
