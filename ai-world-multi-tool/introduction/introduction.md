# Introduction

## About this Workshop

In this 90-minute hands-on workshop, you build an OCI Generative AI Agent that selects the right tool for a question. The agent uses a knowledge base for retrieval-augmented generation (RAG), an Oracle AI Database SQL tool for employee questions, a custom Weather tool, and its built-in general chat capability.

The workshop focuses on the backend agent and its tools. It does not include Oracle Digital Assistant, Visual Builder, or document-understanding integration.

Estimated Time: 90 minutes

### Objectives

By the end of this workshop, you will be able to:

* Create an Object Storage bucket and Knowledge Base for a RAG tool.
* Provision an OCI Generative AI Agent and attach the RAG tool.
* Create and populate an employee database, then connect it to a SQL tool.
* Add a custom Weather tool and agent routing instructions.
* Test that the agent selects the appropriate tool for RAG, SQL, Weather, and general-chat questions.

### Prerequisites

* An OCI tenancy with access to the US Midwest (Chicago) region.
* Permissions to use Generative AI Agents, Object Storage, Autonomous Database, Database Tools, Vault, Networking, and IAM policies. An administrator account is recommended for the workshop.

## Workshop Structure

* **Lab 1: Provision and Configure GenAI Agent** (45 minutes) — create the RAG source, Knowledge Base, and agent.
* **Lab 2: Deploy Agent Tools** (45 minutes) — configure routing, SQL, and Weather tools, then test the multi-tool agent.

## Learn More

* [Overview of Generative AI Agent Service](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/overview.htm)
* [SQL Tool Guidelines for Generative AI Agents](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/sqltool-guidelines.htm)

## Acknowledgements

**Author**

* **Luke Farley**, Senior Cloud Engineer, NACIE

**Contributors**

* **Kaushik Kundu**, Master Principal Cloud Architect, NACIE
* **Abhinav Jain**, Senior Cloud Engineer, NACIE

**Last Updated By/Date:** Luke Farley, August 2026
