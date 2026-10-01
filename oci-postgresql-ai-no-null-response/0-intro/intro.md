
# Introduction

## About This Workshop
We will create a Enterprise AI / Hybrid Search web application, using Terraform. This application will search documents using OCI Database with PostgreSQL and the pgvector extension. pgvector will turn our OCI Database with PostgreSQL into a vector database where we can natively store and manage vector embeddings while handling unstructured data like pdf documents and html files.

We’ll be able to search documents like:
- PDF with text 
- HTML files
- Text Files
- CSV files
- XML files

![Screenshot](images/app-demo-screenshot.png)

The website created during the workshop has several ways to search:
- Full Text Search: Based on *Words* in the documents
- Semantic Search: Based on the *Meaning* (Vector Search)
- Hybrid: Based on the 2 above search
- RAG (Retrieval Augmented Generation): Answer questions based on documents

This event uses temporary users in a dedicated OCI tenancy. The operator provides the workshop compartment, tested stack ZIP, model details, and Bastion source-IP allowlist.

Estimated Workshop Time: 90 minutes

### Architecture

It works like this:
1. A document is uploaded in the Search App
2. The document is converted, parsed & cleaned.
3. Using an embedding model, vector embeddings are created and stored in OCI PostgreSQL database
4. You can now ask natural language questions in the App to retrieve results using a combination of semantic search using pgvector and OCI Enterprise AI service LLM.


This picture shows the ingestion, embeddings and RAG pipeline workflow.

![Workflow](images/ai-workflow-1.png)

![Workflow](images/ai-workflow-3.png)


### Objectives

- Provision the services needed for the system
    - Compartment, private VCN, OCI Bastion, PostgreSQL, and OCI Generative AI services. The web app runs on your laptop.

## Prerequisites
### Cloud Account
You need the temporary OCI user and compartment assigned by the workshop operator. The user must have the Resource Manager, Bastion session, PostgreSQL, and OCI Generative AI permissions described in Lab 1. Do not use a personal free-trial tenancy for the green-button test.

### Laptop
The current full app build supports Apple Silicon macOS 14+ and its supported Linux bootstrap. You need a browser, Git, OpenSSH, and laptop internet for the pinned app dependencies. Native Windows and Intel macOS builds still require validation.

### Region
This workshop is validated in the **US Midwest (Chicago)** region (`us-chicago-1`) and uses it by default. Ashburn can be used only if you deliberately change the Console region, Terraform region, OCI Generative AI endpoint, and model OCID so that they all use the same region.

The operator must make the selected region available in the dedicated tenancy before the event.


**Please proceed to the [next lab.](#next)**

## Acknowledgements 

- **Author**:
    - Shadab Mohammad, Master Principal Cloud Architect, January 2026
- **Contributors**:
    - Kaushik Kundu, Master Principal Cloud Architect
    - Sasanka Abeysinghe, Principal Cloud Architect
    - Luke Farley, Senior Cloud Engineer
- **Last Updated By** - Luke Farley, Senior Cloud Engineer, September 2026
