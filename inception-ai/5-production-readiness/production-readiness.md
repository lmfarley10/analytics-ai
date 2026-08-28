# Consider Production Readiness

## Introduction

This lab introduces the deployment and operational choices behind an enterprise AI solution. You will use the Inception reference architecture to discuss what a delivery team would need to validate, operate, and improve a production deployment.

Estimated Time: 25 minutes

### Objectives

In this lab, you will:

* Relate the reference deployment sequence to your use case.
* Compare runtime, network, secret, and release-management approaches.
* Identify production validation, rollback, and operational questions.
* Capture the decisions that require a delivery team.

## Task 1: Explore the deployment sequence

1. Use this reference order to understand how a production deployment is assembled:

    | Sequence | Layer | Typical components |
    |---|---|---|
    | 1 | Foundation | Landing zone, compartments, VCN, private endpoints, Vault, identity, certificates, policies, and logging |
    | 2 | Data and managed services | Autonomous Database, Object Storage, optional AI Data Platform, and approved data replication |
    | 3 | Agentic runtime | User interface, API boundary, agent backend, MCP servers, model access, memory, and observability |
    | 4 | Integration | Oracle Integration or another approved boundary, GoldenGate where required, and systems of record |
    | 5 | Operational controls | Evaluation gates, monitoring, alerts, backup, recovery, incident response, and release evidence |

2. For your scenario, identify the components that appear essential, optional, or out of scope.

3. Do not assume the complete reference architecture is the correct topology for every use case. Production design is tailored to data sensitivity, integration needs, availability expectations, and the delivery team's operating model.

## Task 2: Select the runtime and network model

1. Select the deployment target based on operational requirements.

    | Target | Appropriate use | Production consideration |
    |---|---|---|
    | Local isolated environment | Developer validation only | No production data; limited operational equivalence |
    | OCI Container Instances | Smaller service footprint and straightforward managed deployment | Private networking, image versioning, health checks, and scaling limits |
    | Oracle Kubernetes Engine | Multiple services, stronger orchestration, rollout, and scaling requirements | Cluster ownership, namespaces, ingress, policies, secrets, and platform operations |

2. Discuss where private subnets and private endpoints may be needed. Every public ingress or egress path needs an explicit reason and compensating control.

3. Place immutable images in the approved OCI Container Registry repository. Use versioned tags or digests; do not promote an unpinned `latest` image into production.

4. Inject secrets at runtime from OCI Vault or the approved secret service. Do not bake secrets into images or store them in deployment manifests.

## Task 3: Define release gates

1. Require these gates before production promotion:

    * Package provenance and supported Fabric release are recorded.
    * Source and dependency security review is complete in the approved delivery environment.
    * Infrastructure plan and policy changes are reviewed.
    * Unit, integration, MCP contract, recipe, and continuous-evaluation suites pass.
    * Security negative tests pass for identity, tools, memory, and approvals.
    * Performance and concurrency results meet the business target.
    * Logs, traces, metrics, alerts, dashboards, and runbooks are validated.
    * Backup, restore, rollback, and incident-response exercises are complete.

2. Preserve validation evidence with the release identifier, environment, test identity, configuration checksum, timestamp, and reviewer.

3. Prevent production promotion when a critical authorization, data-isolation, approval, or secret-exposure test fails.

4. Add release evidence for the selected reference recipe:

    | Recipe | Required release evidence |
    |---|---|
    | Loan Approval Reference Recipe | Versioned decision-policy matrix, threshold-boundary tests, applicant and Loan Officer authorization tests, referral-queue tests, and evidence that model output cannot override the deterministic result |
    | EBS Invoice Reconciliation Reference Recipe | Versioned extraction schema and matching rules, tolerance and duplicate tests, AP Analyst and Finance Approver authorization tests, exception-queue tests, and evidence that no autonomous EBS posting or payment release is exposed |

## Task 4: Plan operations and recovery

1. Assign operational ownership for the interface, API, agent workflow, MCP servers, database, integrations, identity applications, secrets, models, and observability services.

2. Define service-level indicators for availability, agent completion, tool-call success, latency, token usage, policy denials, human-approval age, and downstream integration health.

    Include recipe-specific indicators such as loan referral age and decision-policy failures, plus invoice extraction accuracy, match and exception rates, approval age, duplicate detection, and integration-draft failures.

3. Define recovery procedures for:

    * Failed application or MCP container deployment.
    * Database or memory unavailability.
    * Identity-domain or token-exchange failure.
    * Model endpoint degradation or behavior regression.
    * Compromised secret, wallet, token, or image.
    * Incorrect system-of-record action.

    For a loan workflow, recovery must preserve the authoritative policy result and the Loan Officer referral record. For invoice reconciliation, recovery must preserve the source document, match evidence, exception history, and Finance approval record without duplicating a downstream transaction.

4. Roll back application images to the last validated digest. Revert infrastructure through the approved infrastructure-as-code workflow and review the resulting plan before applying it.

5. Define data correction separately from application rollback. Reverting a container does not undo a completed business transaction.

## Task 5: Capture production-design questions

1. Capture the information a delivery team will eventually need:

    * Use-case-specific architecture and data-flow diagrams.
    * Component, configuration, secret, and dependency inventories.
    * Identity applications, scopes, dynamic groups, policies, and database roles.
    * Deployment, validation, rollback, recovery, and incident runbooks.
    * Tool registry and system-of-record action catalog.
    * Evaluation cases, thresholds, results, and known limitations.
    * Support ownership and escalation contacts.
    * Fabric package version and upgrade process.

2. Discuss which teams would own deployment, diagnosis of a failed MCP call, secret rotation, agent-trace review, and release rollback.

3. In a production program, convert any incident or near miss into a permanent regression case.

## Acknowledgements

* **Authors**
    * [Anup Ojah](https://github.com/aojah1), Oracle
    * [Luke Farley](https://github.com/lmfarley10), Oracle
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
