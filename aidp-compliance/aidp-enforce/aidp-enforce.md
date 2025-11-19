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

1. Log in to your cloud tenancy and navigate to Oracle AI Database > Autonomous AI Database

   ![AI Database](images/ai-database.png)

2. Select Create Autonomous AI Database 

3. Give it a name (e.g. **aidp-db**) and select workload type as Lakehouse. Select database version 26ai and leave other options as default. 

   ![Create AI Database](images/create-aidp-db.png)

4. Provide a password and set Access Type to 'Secure access from everywhere' 

   ![Create AI Database](images/create-aidp-db-2.png)

**NOTE** If you would like to use a private database, a DB Tools Connection will need to be created to use SQL Developer web. This is outside the scope of this lab. For details, see [Create Database Tools Connection](https://docs.oracle.com/en-us/iaas/database-tools/doc/using-oracle-cloud-infrastructure-console.html).

5. Create the AI Database. The provisioning process will take a few minutes.

6. Once provisioned, navigate to Database actions > SQL. This will open SQL Developer as admin user. 

   ![SQL Developer](images/sql-developer.png)

7. Create a Gold Schema (User) in Autonomous Data Lakehouse. Replace "strong_password" with your own password.

   ```sql
   <copy>
   CREATE USER gold IDENTIFIED BY "strong_password";
   </copy>
   ```

8. Grant Required Roles/Privileges to Gold Schema

   ```sql
   <copy>
   -- Data privileges
   GRANT CONNECT, RESOURCE TO gold;

   -- Allow creation of tables, views, and other objects
   GRANT CREATE SESSION TO gold;
   GRANT CREATE TABLE TO gold;
   GRANT CREATE VIEW TO gold;
   GRANT CREATE SEQUENCE TO gold;
   GRANT CREATE PROCEDURE TO gold;
   GRANT UNLIMITED TABLESPACE TO gold;

   -- Enable DBMS_CLOUD 
   GRANT EXECUTE ON DBMS_CLOUD TO gold;

   -- Grant access to data_pump_dir (used for saveAsTable operation in spark)
   GRANT READ, WRITE ON DIRECTORY DATA_PUMP_DIR TO gold;
   </copy>
   ```

9. Log out of admin schema once gold schema is created.

10. Enable REST for GOLD Schema: If unable to sign in directly as gold schema, navigate to AI DB > database actions > database users > search for 'gold' > select three dots > enable rest > log in to sql developer web as gold

    ![Enable REST](images/enable-rest-gold.png)

11. Log in to SQL Developer as GOLD Schema: Navigate back to AI DB > database actions > SQL > Once in SQL Developer select ADMIN (top right) > Sign Out. Provide gold as username and give password as defined. Sign in. 

    ![Sign in Gold Schema](images/sign-in-gold.png)

**NOTE** If still unable to log in, try navigating back to database user page and click the following link - 

    ![Access REST Gold](images/access-rest-gold.png)

12. Navigate to Development > SQL and create the HR_TRANSFORMED table for DI output:

    ```sql
    <copy>
    CREATE TABLE GOLD.HR_TRANSFORMED (
      NAME VARCHAR2(100),
      EMAIL VARCHAR2(100),
      DEPARTMENT VARCHAR2(50),
      SALARY NUMBER,
      SSN VARCHAR2(11)
    );
    </copy>
    ```

13. Once set up, in AIDP workspace, go to Connections and click "Create Connection".
14. Select type "Oracle Database" for ADW, enter details (wallet, user 'gold', password, service name).
15. Test and save. Terms from Catalog guide DI design manually; in AIDP, they propagate via ADW connection (tags for RBAC/queries).

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
3. View full chain: source > DI > AIDP, with audit logs on term-based access (terms from Catalog propagate via metadata/lineage despite no direct DI config).
4. Generate audit report: Go to Audits, filter by dataset, and export logs showing access and transformations.

   ![Trace Lineage](images/trace-lineage.png)
   *(Image description: Lineage view with audit log export option.)*

### Troubleshooting
For common issues in Data Integration (e.g., expression errors), see the Troubleshooting section in secure-pipeline.md.

---

## Next Steps

AIDP inherits and enforces governance from upstream services, ensuring only authorized access to sensitive HR data. This creates an end-to-end secure workflow, with audit reports providing a clear "paper trail" for compliance, identifying who accessed, transformed, and analyzed data like employee salaries.

## Recap and Key Value Points

This workshop has shown how OCI Data Catalog, Data Integration, and AIDP interoperate for seamless, enterprise-grade governance, with ADW as the bridge between DI output and AIDP source. Terms from Catalog guide DI design manually and persist via metadata/lineage despite no direct DI config.

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
