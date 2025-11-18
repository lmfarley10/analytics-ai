# Inheriting Governance in AI Data Platform and Enforcing Security

## Introduction

This lab illustrates how Oracle AI Data Platform (AIDP) can leverage the cataloged and integrated data from previous labs, respect existing governance definitions, and implement additional security measures. Using the transformed HR Employee Dataset (with masked PII like Name, Email, Salary, SSN), you'll enforce role-based access and audit trails.

> **Estimated Time:** 45 minutes

---

### About Oracle AI Data Platform

Oracle AI Data Platform (AIDP) combines the scalability of data lakes with the performance and structure of data warehouses. AIDP leverages the power of Spark, Delta Lake, and Oracle Autonomous AI Lakehouse to make cloud-scale data engineering, advanced analytics, and AI approachable for every user.

---

### Objectives

In this lab, you will:
- Connect AIDP workspace to the cataloged and transformed data
- Demonstrate role-based access to data
- Apply additional tagging/ownership in AIDP
- Run a simple data transformation or ML experiment
- Trace lineage and audit data access

---

### Prerequisites

This lab assumes you have:
* An Oracle Cloud account (or provided lab credentials)
* Access to Oracle AI Data Platform, Data Catalog, and related services
* Basic familiarity with web-based Oracle Cloud interfaces (helpful but not required)
* Completed the previous labs on data cataloging and secure pipelines
* The transformed HR Employee Dataset from previous steps

---

## Task 1: Connect AIDP Workspace to the Cataloged and Transformed Data

1. From the OCI Console, search for "AI Data Platform" or navigate to Analytics & AI > AI Data Platform.
2. In your AIDP workspace, go to Connections and click "Create Connection".
3. Select the type (e.g., Object Storage or Database), and enter details like bucket name or DB credentials from Lab 2 output.
4. Test and save the connection.

   ![Connect to Data](images/connect-data.png)
   *(Image description: Connection creation form with type and credential fields.)*

## Task 2: Demonstrate Role-Based Access to Data

1. In AIDP, import the dataset using the new connection.
2. Simulate roles: Log in as different users or use role-switching if available (e.g., Data Scientist sees all columns; Analyst sees masked views via policies).
3. Verify restrictions: Attempt to query sensitive columns and confirm Data Catalog PII tags block unauthorized access.

   ![Role-Based Access](images/role-access.png)
   *(Image description: Dataset view with role-based restrictions applied.)*

## Task 3: Apply Additional Tagging/Ownership in AIDP

1. In the dataset details, go to Metadata or Tags section.
2. Add tags (e.g., "Compliance-Reviewed") or assign ownership (e.g., to group ComplianceTeam).
3. This step is optional but enhances governance if supported in your workspace.

   ![Apply Tags](images/apply-tags.png)
   *(Image description: Metadata editing interface for tags and ownership.)*

## Task 4: Run a Simple Data Transformation or ML Experiment

1. In AIDP, create a new Notebook or Job.
2. Use SQL or code to aggregate, e.g., SELECT Department, AVG(Salary) FROM hr_dataset GROUP BY Department.
3. Execute the job and review results, ensuring governance rules are applied.

   ![Run Experiment](images/run-experiment.png)
   *(Image description: Job creation and execution interface.)*

## Task 5: Trace Lineage and Audit Data Access

1. In AIDP, navigate to Lineage or Governance tab for the dataset/job.
2. Trace back to original HR dataset via Lab 2 pipeline.
3. Generate audit report: Go to Audits, filter by dataset, and export logs showing access and transformations.

   ![Trace Lineage](images/trace-lineage.png)
   *(Image description: Lineage view with audit log export option.)*

---

## Next Steps

AIDP inherits and enforces governance from upstream services, ensuring only authorized access to sensitive HR data. This creates an end-to-end secure workflow, with audit reports providing a clear "paper trail" for compliance, identifying who accessed, transformed, and analyzed data like employee salaries.

## Recap and Key Value Points

This workshop has shown how OCI Data Catalog, Data Integration, and AIDP interoperate for seamless, enterprise-grade governance.

- Centralized metadata, classification, and lineage create defensible audit trails and simplify regulatory compliance.
- Security controls are enforced at each service layer, with no compromise to collaboration or productivity.
- AIDP is positioned as a secure and governed participant in broader Oracle data architectures.

Congratulations! You've completed the workshop.

---

## Acknowledgements

**Authors**
* **Luke Farley**, Senior Cloud Engineer, ONA Data Platform

**Contributors**
* **Enjing Li**, Senior Cloud Engineer, ONA Data Platform

**Last Updated By/Date:**
* **Luke Farley**, Senior Cloud Engineer, ONA Data Platform, November 2025
