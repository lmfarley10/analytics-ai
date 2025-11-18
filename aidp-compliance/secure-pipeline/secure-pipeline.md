# Secured Data Integration Pipeline with Lineage and Policy Enforcement

## Introduction

This lab showcases how OCI Data Integration can read governed assets from Data Catalog, enforce security policies, and retain data lineage. This ensures compliance as data moves from source to transformation, using the simulated HR Employee Dataset (with PII like Name, Email, Salary, SSN).

> **Estimated Time:** 45 minutes

---

### About OCI Data Integration

OCI Data Integration is a fully managed, serverless, native cloud service that helps you build, deploy, and manage data integration processes. It enables ETL (Extract, Transform, Load) operations with built-in support for governance, security, and lineage tracking.

---

### Objectives

In this lab, you will:
- Build a pipeline in OCI Data Integration
- Perform basic transformations
- Configure pipeline-level access control
- Execute the pipeline and store results
- View and export data lineage

---

### Prerequisites

This lab assumes you have:
* An Oracle Cloud account (or provided lab credentials)
* Access to OCI Data Integration, Data Catalog, and Object Storage
* Basic familiarity with web-based Oracle Cloud interfaces (helpful but not required)
* Completed the previous lab on data cataloging and classification
* The transformed HR Employee Dataset from previous steps

---

## Task 1: Build a Pipeline in OCI Data Integration

1. From the OCI Console home page, search for "Data Integration" under Analytics & AI > Data Integration.
2. In the Data Integration workspace, go to Pipelines and click "Create Pipeline".
3. Name the pipeline (e.g., HR-Secure-Pipeline) and select the cataloged HR dataset as the source (from Lab 1).
4. Configure the source: Specify the data asset, entity, and connection details to read the dataset.

   ![Create Pipeline](images/create-pipeline.png)
   *(Image description: Shows the pipeline creation wizard with source selection.)*

## Task 2: Perform Basic Transformations

1. In the pipeline editor, add an Integration Task or Expression operator.
2. For masking PII: Use functions like REPLACE or a masking expression, e.g., REPLACE(Name, SUBSTR(Name, 1, 1), 'X') to anonymize names.
3. For filtering: Add a Filter operator, e.g., condition Salary < 100000 or anonymize with CASE statements.
4. Ensure transformations respect Data Catalog classifications by referencing tagged columns.

   ![Apply Transformations](images/apply-transformations.png)
   *(Image description: Pipeline editor with transformation operators and expressions.)*

## Task 3: Configure Pipeline-Level Access Control

1. In the pipeline details, go to Permissions or Access Control.
2. Set restrictions: e.g., allow edit only for admins, run for authorized users/groups.
3. For IAM: Navigate to Identity > Policies, create a policy like "allow group DataUsers to use integration-pipelines in compartment WorkshopCompartment".

   ![Configure Access](images/configure-access.png)
   *(Image description: Access control settings with user/group permissions.)*

## Task 4: Execute the Pipeline and Store Results

1. In the pipeline editor, click "Publish" then "Run".
2. Configure output: Add a target operator to write to a new Object Storage bucket (e.g., transformed-hr-bucket) or Autonomous Database table.
3. Monitor the run status in the Executions tab.

   ![Execute Pipeline](images/execute-pipeline.png)
   *(Image description: Run configuration and monitoring dashboard.)*

## Task 5: View and Export Data Lineage

1. After execution, in Data Integration, go to the pipeline's Lineage tab.
2. Alternatively, in Data Catalog, search for the output entity and view lineage.
3. Trace flows: e.g., from source Salary column through transformations to output.
4. Export as PDF for audits.

   ![View Lineage](images/view-lineage.png)
   *(Image description: Lineage diagram showing data flows.)*

---

## Next Steps

The pipeline processes the HR dataset securely, with masking and filtering applied to sensitive data. Security policies are enforced, and lineage provides an auditable trail from source to output, supporting compliance requirements like GDPR or SOX.

Proceed to the next lab to inherit this governance in AIDP.

---

## Acknowledgements

**Authors**
* **Luke Farley**, Senior Cloud Engineer, ONA Data Platform

**Contributors**
* **Enjing Li**, Senior Cloud Engineer, ONA Data Platform

**Last Updated By/Date:**
* **Luke Farley**, Senior Cloud Engineer, ONA Data Platform, November 2025
