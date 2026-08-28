# Frame an Enterprise AI Use Case

## Introduction

Great enterprise AI solutions begin with a focused business decision, a clear user, and a governed path to trusted data and actions. In this lab, you will choose one of two reference scenarios and create a design canvas for an Inception-based solution.

Estimated Time: 20 minutes

### Objectives

In this lab, you will:

* Identify a business user, decision, and measurable outcome.
* Define the data, systems, and actions needed for an enterprise AI workflow.
* Select an appropriate level of agent autonomy and human approval.
* Carry a design canvas into the remaining labs.

## Task 1: Select a scenario

1. Choose the reference scenario that most closely matches the business problem you want to explore.

    | Scenario | Business user | Decision and trusted data | Required control | Example outcome |
    |---|---|---|---|---|
    | Loan Approval Reference Recipe | Loan applicant and Loan Officer | Product eligibility and application disposition using product terms, applicant information, and governed financial data | Deterministic approve/decline/refer policy; a Loan Officer decides referred cases | Faster intake with consistent policy application and an auditable referral path |
    | EBS Invoice Reconciliation Reference Recipe | AP Analyst and Finance Approver | Whether an invoice matches the supplier, governing agreement, purchase order, and received goods | Deterministic matching; exceptions go to review; reconciliation remains a draft until Finance approval | Faster reconciliation with fewer manual comparisons and no autonomous payment release |

2. If you choose another scenario, keep the same level of specificity: name the user, the decision, the trusted data, the downstream action, and one measurable outcome.

3. Establish the business baseline before proposing an agent. Record the current result, target, measurement source, accountable owner, review period, and any required segmentation by scenario, user group, or risk tier. Do not claim improvement without comparable evidence.

4. Write a one-sentence problem statement using this pattern:

    ```text
    Help <business user> make <decision> using <trusted data>, while ensuring <required control>.
    ```

## Task 2: Define the workflow boundary

1. Complete this design canvas for your scenario.

    | Design question | Your answer |
    |---|---|
    | Who starts the workflow? | To be completed |
    | What information must be collected? | To be completed |
    | Which facts must come from a trusted system? | To be completed |
    | What can the agent recommend? | To be completed |
    | What must a person approve? | To be completed |
    | What action must remain deterministic? | To be completed |
    | What must never be shown or changed? | To be completed |

2. Separate recommendation from execution. A model can help summarize, classify, route, and draft; authorization, high-stakes business rules, and system-of-record changes need explicit controls.

3. For the Loan Approval Reference Recipe, distinguish conversational assistance and underwriting research from the deterministic policy decision. For EBS Invoice Reconciliation, distinguish document extraction and exception explanation from the deterministic matching rules.

4. Identify the smallest useful scope. For a first experience, use one business user, one governed data source, one workflow, and one approval point.

5. Record an explicit scope contract: allowed actions, forbidden actions, approval requirements, escalation paths, and the safe failure behavior for every state-changing action. Assign a business owner to each consequential operation.

## Task 3: Select the participant outcome

1. Choose the outcome you want to explore during this workshop.

    | Outcome | Focus for the remaining labs |
    |---|---|
    | Architecture discovery | Understand Inception layers and choose the right building blocks |
    | Workflow design | Trace how agents, MCP tools, memory, and approvals work together |
    | Governance review | Identify identity, data, tool, and evaluation controls before a proof of value |
    | Production conversation | Discuss what a delivery team would need to validate and operate the solution |

2. Capture one question you want answered by the end of the workshop. Examples include: “Which data access should be exposed as an MCP tool?” or “Where should human approval be required?”

3. Do not attempt to define every integration or infrastructure component now. The remaining labs introduce the framework choices in the order needed to refine this canvas.

## Task 4: Share your design canvas

1. Review your canvas with another participant or group.

2. Ask the group to challenge three assumptions:

    * Is the business decision sufficiently narrow and measurable?
    * Is each data source necessary and trusted for this workflow?
    * Is the human-approval point placed before the consequential action?

3. Keep the canvas available as you work through the foundation, MCP, governance, and production-design labs.

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
