
# Discover services that have been created by automation and that comprise the solution

## Introduction
In this optional lab you can explore services that have been created by automation and that comprise the solution such as the AI services and PostgreSQL. We will also explore the Schema for the Database.

Estimated time: 20 min

### Objectives

- Discover services that have been created by automation and that comprise the solution

### Prerequisites
- You've completed the previous labs.

## Task 1: Compartment

The compartment is used to contains all the components of the lab.
From an architectural viewpoint, a compartment is simply a logical group of OCI resources. There is no specific implication of network structure, geographical placement, or even any relationship between resources. They are merely a set of resources that are associated with a set of group based permissions.

Go the Cloud console 3-bar/hamburger menu and select the following
  1. Identity & Security
  2. Choose Compartment
    ![GenAI Compartment](images/postgres-genai-compartment1.png)
 
  3. Click on the compartment name ***oci-starter_XX*** (where XX is the initial of the user working on this LiveLab)

     
   ![GenAI Compartment](images/postgres-genai-compartment2.png)

## Task 2: Virtual Cloud Network

The Virtual Cloud Network allows you to manage the network of the components.
A virtual cloud network (VCN) is a virtual, private network that closely resembles a traditional network, with firewall rules and specific types of communication gateways that you can choose. A VCN resides in a single OCI region and covers one or more CIDR blocks (IPv4 and IPv6, if enabled). Each subnet consists of a contiguous range of IP addresses (for IPv4 and IPv6, if enabled) that do not overlap with other subnets in the VCN.

Go the Cloud console 3-bar/hamburger menu and select the following
  1. Networking
  2. Virtual Cloud Network

   ![Menu VCN](images/discover-stack-1.png)

  3. Check that you are in the right compartment (oci-starter in this case)
  4. Click on vcn name *vcn1*
  5. Notice one private subnet, `psql-priv-subnet`. It prohibits public IPs and internet ingress.
  6. Open its route table. Confirm the only route points to **All Services in Oracle Services Network** through the Service Gateway. There must be no `0.0.0.0/0` route, NAT Gateway, or Internet Gateway.
  7. Open `VCN1-PRIVATE-SL`. It permits PostgreSQL TCP `5432` within the private target subnet and HTTPS to OCI services only. The PostgreSQL NSG also permits TCP `5432` from that subnet and OCI-service egress for backups. The OCI Bastion private endpoint uses an address in this target subnet.
  8. Open **Identity & Security → Bastion** and inspect `postgres-workshop-bastion`. Its client CIDR allowlist must contain only the operator-provided attendee source ranges. The Bastion service is OCI-managed; the stack does not create a public-IP VM.

## Task 3: PostgreSQL Database System

OCI Database with PostgreSQL allows us to store extracted text from documents including their corresponding vector embeddings by using the pgvector extension so we can perform a semantic search. Database with PostgreSQL is a fully managed PostgreSQL service with intelligent sizing, tuning and high durability.

Go the Cloud console 3-bar/hamburger menu and select the following
  1. Database
  2. PostreSQL - DB Systems

  ![Menu PostgreSQL](images/postgres-genai-cluster1.png)

  3. Check that you are in the right compartment (oci-starter_XX in this case -> where XX is the initial of the user)
  4. Click on the PostgreSQL db system name *psql_inst_1*
  5. Notice the General information:  
  Performance tier: 75K IOPS
  Shape: VM.Standard.E5.Flex
  OCPU count: 2
  RAM(GB): 32

  6. Notice Network configuration
  7. Notice Connection details
  8. Notic the psql configuration which has the AI extensions *livelab_flexible_configuration*
  9. Notice Database system nodes
A Database system is PostgreSQL database cluster running on one or more OCI VM Compute instances. A database system provides an interface enabling the management of tasks such as provisioning, backup and restore, monitoring, and so on. Each database system has one endpoint for read/write PSQL queries and can have multiple endpoints for read-only queries.

  ![PostgreSQL details](images/psql-dbsystem-1.png)


## Task 4: Bastion and local app

The Python app runs on your laptop at `http://127.0.0.1:8000/`. Its database pool connects to local port `15432`, which SSH forwards through OCI Bastion to the private PostgreSQL endpoint. Keep the SSH session open while using the app. The database connection uses `verify-full` and the DB System CA certificate.

## Task 5: OCI Enterprise AI Service

OCI Enterprise AI provides access to pretrained, foundational models from Cohere, OpenAI, Google, xAI, and Meta. It also provides dedicated AI clusters, where you can host foundational models on dedicated GPUs that are private to you. These clusters provide stable, high-throughput performance that’s required for production use cases and can support hosting and fine-tuning workloads. OCI Enterprise AI enables you to scale out your cluster with zero downtime to handle changes in volume.

In this step you will explore the AI Services that are leveraged in the solution. 

   1. Explore the Enterprise AI Service used in the solution. Common use cases of the Enterprise AI Service include: Create text for any purpose, Extract data from text, Summarize articles, transcripts, and more. Classify intent in chat logs, support tickets, and more. Rewrite content in a different style or language.    
    1. Go the Cloud console 3-bar/hamburger menu and select the following    
        1. Analytics & AI
        2. AI Services
        3. Generative AI

      ![Menu GenerativeAI](images/postgres-genai-ai1.png)
        
        OCI Enterprise AI offers several playground modes, each with ready-to-use pretrained models:
        - Chat: Generates text or extracts information from text
        - Embedding: Converts text to vector embeddings to use in applications for semantic searches, text classification, or text clustering
        
      The Enterprise AI model available in your regions can be listed from the **Playground** > **Chat** tab

      ![OCI GenerativeAI](images/oci-genai-1.png)

When you click on the model details you get the model OCID which is used the environment variable file of the application to perform the inference in the RAG pipeline

  ![OCI GenerativeAI](images/oci-genai-2.png)

If you want to try a different model, you can select a model from this menu, copy its OCID and paste it in the environment file and restart the local app.

## Task 6: PostgreSQL Schema

The Application stores the vctor embeddings and metadata related to the files in 2 tables **documents** **chunks**

````
postgres=> \dt
           List of relations
 Schema |   Name    | Type  |  Owner
--------+-----------+-------+----------
 public | chunks    | table | postgres
 public | documents | table | postgres
(2 rows)
````

````
postgres=> \d documents
                                       Table "public.documents"
   Column    |           Type           | Collation | Nullable |                Default
-------------+--------------------------+-----------+----------+---------------------------------------
 id          | bigint                   |           | not null | nextval('documents_id_seq'::regclass)
 source_path | text                     |           |          |
 source_type | text                     |           | not null |
 title       | text                     |           |          |
 metadata    | jsonb                    |           |          | '{}'::jsonb
 created_at  | timestamp with time zone |           |          | now()
Indexes:
    "documents_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "chunks" CONSTRAINT "chunks_document_id_fkey" FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
````

````
postgres=> \d chunks
                                                            Table "public.chunks"
     Column      |           Type           | Collation | Nullable |                                 Default

-----------------+--------------------------+-----------+----------+--------------------------------------------------------------------
-----
 id              | bigint                   |           | not null | nextval('chunks_id_seq'::regclass)
 document_id     | bigint                   |           | not null |
 chunk_index     | integer                  |           | not null |
 content         | text                     |           | not null |
 content_tsv     | tsvector                 |           |          | generated always as (to_tsvector('english'::regconfig, content)) st
ored
 content_chars   | integer                  |           |          |
 embedding       | vector(384)              |           |          |
 embedding_model | text                     |           |          |
 created_at      | timestamp with time zone |           |          | now()
Indexes:
    "chunks_pkey" PRIMARY KEY, btree (id)
    "idx_chunks_doc_chunk" UNIQUE, btree (document_id, chunk_index)
    "idx_chunks_embedding_ivfflat" ivfflat (embedding vector_cosine_ops) WITH (lists='1000')
    "idx_chunks_tsv" gin (content_tsv)
Foreign-key constraints:
    "chunks_document_id_fkey" FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
````

**content_tsv** is the full text search data stored in the FTS format for PostgreSQL

**embedding** is the vector data type with 384 dimensions reflecting the dimensions of the embedding models. For more accuracy you can select a different embedding model and a higher dimension.

**Congratulations! You have completed this workshop.**

You explored the private VCN, OCI Bastion, PostgreSQL DB System, and OCI Generative AI. The search app and its uploaded files run on your laptop unless you explicitly enabled OCI Object Storage uploads.

## Cleanup

Stop the local app and Bastion SSH tunnel. Empty the upload bucket if you used it, then run **Destroy** on the Resource Manager stack. Remove the temporary user API key from OCI and delete its local PEM according to the operator's retention policy.

## Acknowledgements

- **Author**:
    - Shadab Mohammad, Master Principal Cloud Architect, January 2026
- **Contributors**:
    - Kaushik Kundu, Master Principal Cloud Architect
    - Sasanka Abeysinghe, Principal Cloud Architect
    - Luke Farley, Senior Cloud Engineer
- **Last Updated By** - Luke Farley, Senior Cloud Engineer, September 2026
