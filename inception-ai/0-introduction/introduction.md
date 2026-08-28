# Project Inception: Enterprise AI Fabric Companion LiveLab

## About this workshop

Project Inception is an agentic framework for Oracle Cloud Infrastructure (OCI). It provides reusable building blocks for enterprise AI applications: a shared runtime library, agentic patterns, Model Context Protocol (MCP) servers, solution accelerators, reference recipes, and deployment automation.

This is a **companion LiveLab** for an in-person or virtual enablement experience. You will use a realistic enterprise AI scenario to explore architecture choices, agent patterns, governed tool access, and production-readiness decisions. It does not require you to deploy a solution or publish source code.

![Project Inception code accelerators, from reusable runtime libraries through customer recipes](images/code-accelerators.png)

Estimated Workshop Time: 2 hours 15 minutes

### Objectives

In this workshop, you will:

* Explain the layers and reusable assets in the Project Inception framework.
* Apply those assets to a realistic enterprise AI use case.
* Compare a governed loan-approval workflow with an EBS invoice-reconciliation workflow.
* Discuss security, governance, observability, evaluation, and production-readiness choices.
* Apply a 15-practice Agentic Engineering review framework from scope definition through business-outcome measurement.
* Identify a practical next step for further learning or approved implementation work.

### Intended audience

This workshop is for solution architects, AI engineers, application developers, security architects, database teams, and business leaders exploring enterprise agentic solutions on OCI.

### What the companion LiveLab includes

The workshop contains participant-safe guided exercises and reference material:

* Architecture and component responsibilities.
* A use-case design canvas for users, decisions, data, and controls.
* Selection guidance for agent patterns, MCP servers, and reference recipes.
* Identity, security, observability, evaluation, and deployment considerations.
* Discussion prompts for a proof of value or production-design conversation.

The separately distributed implementation package contains source code, environment templates, tests, deployment assets, and component-specific runbooks. This LiveLab is intentionally useful without that package; it does not grant access to, or a license for, the package.

## Project Inception architecture

The Fabric is organized into five interoperable layers:

| Layer | Responsibility |
|---|---|
| Application and API | React interfaces, API consumers, FastAPI services, Node.js gateways, and command-line entry points |
| Agent orchestration | LangGraph workflows, routing, deep-agent patterns, human approval, and memory-aware execution |
| LLM and MCP tools | Pluggable model providers and explicitly registered tools for Oracle data and OCI services |
| Data, memory, and policy | Oracle Autonomous Database, checkpointing, shared memory, guardrails, IAM/OIDC, and database policy |
| Deployment and operations | Containers, Terraform, networking, secrets, logging, tracing, evaluation, and release validation |

A typical governed request follows this sequence:

1. A user signs in through an approved identity flow.
2. The application passes the user request and identity context to the agent workflow.
3. Input guardrails and audit tracing start before model execution.
4. The workflow selects an approved agent and, when needed, an explicitly registered MCP tool.
5. The MCP boundary validates the bearer token and accesses the permitted Oracle data or OCI service.
6. Database and application policies constrain the returned data and allowed actions.
7. Output guardrails run, the trace closes, and conversation state is checkpointed.
8. The application returns a governed response or pauses for human approval.

## Reusable agent patterns

Project Inception provides 15 runnable agent patterns so that a customer solution can choose the least autonomous design that satisfies the business requirement.

| Pattern family | Available patterns |
|---|---|
| Foundations | Basic ReAct Agent, Augmented LLM, Structured Output, and Code Interpretation |
| Memory | Short-Term Memory, Long-Term Memory, Memory Store, and Memory-Aware Deep Agent |
| Coordination | Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, and Swarm |
| Control and quality | Human-in-the-Loop and Evaluator-Optimizer |

Start with deterministic workflows and add model-directed routing only where it creates measurable value. Human approval should guard consequential actions such as approving a referred loan, releasing a reconciliation draft, or changing a system of record.

Agent patterns describe how work is organized. Agentic Engineering practices describe how the resulting system is scoped, secured, tested, deployed, operated, and measured. This workshop uses both: the pattern catalog helps shape the workflow, while the `AE-01` through `AE-15` review framework provides production guardrails.

## Workshop result

At the end of the workshop, you will have an Inception design canvas containing:

* Selected use case, users, and measurable business outcome.
* Candidate reference recipe and agent pattern.
* Proposed data, tool, identity, memory, and governance boundaries.
* Production-readiness questions to resolve with the delivery team.
* A practical next learning or implementation step.

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
