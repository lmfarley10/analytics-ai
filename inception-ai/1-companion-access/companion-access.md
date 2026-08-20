# Frame an Enterprise AI Use Case

## Introduction

Great enterprise AI solutions begin with a focused business decision, a clear user, and a governed path to trusted data and actions. In this lab, you will use a realistic field-service scenario to create a design canvas for an Inception-based solution.

Estimated Time: 20 minutes

### Objectives

In this lab, you will:

* Identify a business user, decision, and measurable outcome.
* Define the data, systems, and actions needed for an enterprise AI workflow.
* Select an appropriate level of agent autonomy and human approval.
* Carry a design canvas into the remaining labs.

## Task 1: Select a scenario

1. Start with the Smart Dispatch scenario, or substitute a familiar enterprise process from your industry.

    | Scenario element | Smart Dispatch example |
    |---|---|
    | Business user | Contact-center representative or field-service coordinator |
    | User need | Diagnose a device issue and recommend the appropriate next step |
    | Trusted data | Service history, contracts, entitlements, knowledge articles, and technician availability |
    | Decision | Is a dispatch appropriate, and what should be proposed? |
    | Consequential action | Create or update a dispatch only after explicit approval |
    | Measurable outcome | Faster, more consistent intake and reduced unnecessary dispatches |

2. If you choose another scenario, keep the same level of specificity: name the user, the decision, the trusted data, the downstream action, and one measurable outcome.

3. Write a one-sentence problem statement using this pattern:

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

3. Identify the smallest useful scope. For a first experience, use one business user, one governed data source, one workflow, and one approval point.

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
