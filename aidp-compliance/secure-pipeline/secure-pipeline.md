# Lab 2: Secured Data Integration Pipeline with Lineage and Policy Enforcement

## Objective

Showcase how OCI Data Integration can read governed assets from Data Catalog, enforce security policies, and retain data lineage. This ensures compliance as data moves from source to transformation, using the simulated HR Employee Dataset (with PII like Name, Email, Salary, SSN).

## Steps

1. **Build a Pipeline in OCI Data Integration**:
   - From the OCI Console home page, search for "Data Integration" under Analytics & AI > Data Integration.
   - In the Data Integration workspace, go to Pipelines and click "Create Pipeline".
   - Name the pipeline (e.g., HR-Secure-Pipeline) and select the cataloged HR dataset as the source (from Lab 1).
   - Configure the source: Specify the data asset, entity, and connection details to read the dataset.

   ![Create Pipeline](images/create-pipeline.png)
   *(Image description: Shows the pipeline creation wizard with source selection.)*

2. **Perform Basic Transformations**:
   - In the pipeline editor, add an Integration Task or Expression operator.
   - For masking PII: Use functions like REPLACE or a masking expression, e.g., REPLACE(Name, SUBSTR(Name, 1, 1), 'X') to anonymize names.
   - For filtering: Add a Filter operator, e.g., condition Salary < 100000 or anonymize with CASE statements.
   - Ensure transformations respect Data Catalog classifications by referencing tagged columns.

   ![Apply Transformations](images/apply-transformations.png)
   *(Image description: Pipeline editor with transformation operators and expressions.)*

3. **Configure Pipeline-Level Access Control**:
   - In the pipeline details, go to Permissions or Access Control.
   - Set restrictions: e.g., allow edit only for admins, run for authorized users/groups.
   - For IAM: Navigate to Identity > Policies, create a policy like "allow group DataUsers to use integration-pipelines in compartment WorkshopCompartment".

   ![Configure Access](images/configure-access.png)
   *(Image description: Access control settings with user/group permissions.)*

4. **Execute the Pipeline and Store Results**:
   - In the pipeline editor, click "Publish" then "Run".
   - Configure output: Add a target operator to write to a new Object Storage bucket (e.g., transformed-hr-bucket) or Autonomous Database table.
   - Monitor the run status in the Executions tab.

   ![Execute Pipeline](images/execute-pipeline.png)
   *(Image description: Run configuration and monitoring dashboard.)*

5. **View and Export Data Lineage**:
   - After execution, in Data Integration, go to the pipeline's Lineage tab.
   - Alternatively, in Data Catalog, search for the output entity and view lineage.
   - Trace flows: e.g., from source Salary column through transformations to output.
   - Export as PDF for audits.

   ![View Lineage](images/view-lineage.png)
   *(Image description: Lineage diagram showing data flows.)*

## Expected Outcome

The pipeline processes the HR dataset securely, with masking and filtering applied to sensitive data. Security policies are enforced, and lineage provides an auditable trail from source to output, supporting compliance requirements like GDPR or SOX.

## Troubleshooting Notes
- If pipeline run fails, check logs for errors (e.g., connection issues) and verify Data Catalog integration.
- Ensure Lab 1 classifications are visible; re-harvest if needed.
- For IAM issues, confirm policies allow manage integration-instances.

Proceed to Lab 3 to inherit this governance in AIDP.
