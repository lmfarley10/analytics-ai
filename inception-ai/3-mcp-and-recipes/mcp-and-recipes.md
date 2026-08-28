# Select MCP Servers and Compare Reference Recipes

## Introduction

Project Inception uses MCP servers as explicit, authenticated tool boundaries. Recipes combine those tools with agents, memory, APIs, interfaces, deterministic business rules, and human review. In this lab, you will choose the smallest tool surface for your scenario and compare two governed reference workflows.

Estimated Time: 30 minutes

### Objectives

In this lab, you will:

* Understand the standard MCP server structure and authentication modes.
* Select the MCP server and permitted tools for your use case.
* Trace the Loan Approval and EBS Invoice Reconciliation reference workflows.
* Identify the validation outcomes a delivery team should demonstrate.

## Task 1: Define the MCP boundary

1. Use the Fabric's standard separation of responsibilities:

    | Module responsibility | Purpose |
    |---|---|
    | Server bootstrap | Load approved configuration, configure authentication, and start the transport |
    | Tool registry | Define the complete set of callable tools |
    | Tool implementation | Validate inputs and perform the permitted Oracle or OCI operation |

2. Treat the registry as a security control. A function that is present in the package but absent from the explicit registry must not be callable by an agent.

3. Choose the authentication mode required by each client:

    | Client | Mode | Typical use |
    |---|---|---|
    | Browser-assisted developer or administrator | Interactive OIDC | Authorized inspection and guided testing |
    | Agent backend or command-line workflow | Bearer token/JWT | Per-request authenticated tool calls |

4. Validate the bearer token on every request. Do not rely on a long-lived authenticated MCP session after a token expires.

## Task 2: Select the server and tools

1. Select only the MCP boundary required by the recipe.

    | MCP server | Primary purpose | Example approved operations |
    |---|---|---|
    | SQLcl MCP | Oracle Database query and schema inspection through SQLcl | Execute approved SQL, inspect schema, test connection, identify caller |
    | Object Storage MCP | OCI Object Storage access | Read namespace, list or upload approved objects, identify caller |
    | ADW MCP | Direct Autonomous Database access with propagated identity | Read approved data and, where explicitly designed, perform constrained DML |
    | OCI Database MCP | OCI Database control-plane operations | List approved database resource information and identify caller |

2. Record the exact tool allowlist, input constraints, data classification, required identity, logging fields, timeout, retry behavior, and error response for every selected operation.

3. Keep data-plane and control-plane responsibilities separate. Querying rows in a schema is different from administering or listing OCI database resources.

4. For a proof of value, begin with one read-only MCP server unless the business outcome requires more.

## Task 3: Compare the reference recipes

1. Compare the two participant-safe recipe foundations.

    | Design dimension | Loan Approval Reference Recipe | EBS Invoice Reconciliation Reference Recipe |
    |---|---|---|
    | Primary actors | Applicant and Loan Officer | AP Analyst and Finance Approver |
    | Workflow style | Peer-agent handoff into a governed application workflow | Ordered extraction, lookup, deterministic matching, exception handling, and draft approval |
    | Agent patterns | Swarm or routing, memory, research, and human-in-the-loop | Prompt chaining, structured output, routing, and human-in-the-loop |
    | Trusted data | Product terms, applicant profile, application state, and decision history | Invoice, supplier, governing agreement, purchase order, goods receipts, and reconciliation state |
    | Tool boundaries | Governed database access and approved application services | Object Storage, document extraction, governed database access, and an approved integration boundary |
    | Deterministic control | Policy logic classifies approve, decline, or refer | Matching logic evaluates supplier, agreement, duplicate, receipt, quantity, price, and total checks |
    | Human control | Loan Officer decides referred cases | AP Analyst reviews exceptions; Finance approves the reconciliation draft |
    | Prohibited autonomous action | A model cannot make or override the final lending policy decision | The workflow cannot post to EBS or release payment autonomously |

2. Trace the Loan Approval Reference Recipe:

    1. A concierge capability handles general questions and identifies whether the applicant needs product information or wants to apply.
    2. Product questions route to a specialist with read-only access to approved product terms.
    3. An application path collects required information and uses governed data for research and underwriting context.
    4. Deterministic policy logic classifies the outcome as approve, decline, or refer.
    5. Referred cases enter a Loan Officer queue with the application context and conversation trail.
    6. The Loan Officer makes the consequential decision; the model cannot bypass that boundary.

3. Trace the EBS Invoice Reconciliation Reference Recipe:

    1. Approved invoice, agreement, and receipt documents enter controlled Object Storage locations.
    2. Extraction and structured normalization produce typed business fields while reporting missing data instead of guessing.
    3. Governed lookups retrieve the supplier, agreement, purchase-order, and receipt evidence required for matching.
    4. Deterministic rules evaluate all relevant match conditions and record pass, fail, or skipped evidence.
    5. Variances route to an AP Analyst; valid matches produce a reconciliation draft.
    6. Finance approval is required before an approved integration boundary can perform a downstream action. The reference recipe does not post directly to EBS or release payment.

4. Select the closer foundation for your design canvas. Record which concepts transfer and which interfaces, business rules, data sources, identities, or integration boundaries must change.

## Task 4: Practice component validation

1. Put the selected MCP boundary into the context of a complete reference implementation.

2. Discuss the order a delivery team would validate components. The purpose is to understand the dependency chain, not to deploy software in this workshop.

3. Trace the expected dependency order:

    1. Core runtime libraries import successfully in an isolated environment.
    2. The selected model and database connections pass their component probes.
    3. The MCP server starts with its approved registry and authentication mode.
    4. An authorized identity can list and invoke only the expected tools.
    5. An unauthorized or expired identity receives a controlled denial.
    6. The recipe backend reaches the MCP endpoint and persists the expected state.
    7. Deterministic business rules produce the expected outcome from known inputs.
    8. The interface completes one golden path and one human-review or exception path.

4. Explain why each stage must pass before the next begins. For example, a recipe cannot safely use a tool if the MCP server has not proved its registry and authentication behavior.

## Task 5: Define recipe acceptance criteria

1. Use the following outcomes to evaluate the Loan Approval Reference Recipe:

    * Peer-agent handoff preserves the user's request and conversation context.
    * Product information comes only from the approved read-only data boundary.
    * The deterministic policy produces the expected approve, decline, or refer result from known inputs.
    * A referred case remains pending until a Loan Officer acts.
    * The audit trail identifies the applicant session, workflow path, policy result, and human decision without exposing restricted data.

2. Use the following outcomes to evaluate the EBS Invoice Reconciliation Reference Recipe:

    * Missing or uncertain extracted fields are reported rather than invented.
    * Matching rules produce the expected result for clean, duplicate, missing-receipt, quantity, price, and total-variance cases.
    * A failed rule cannot be converted into a successful match by instructions embedded in document text.
    * An exception remains pending for AP Analyst review.
    * A successful match produces only a draft, and no downstream action occurs without Finance approval.
    * Logs correlate the document, workflow, rule outcomes, tool calls, and approval without exposing document contents or secrets.

3. Add edge, adversarial, and regression cases for missing information, ambiguous approval, prompt injection, expired identity, tool timeout, duplicate requests, and unavailable downstream systems.

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
