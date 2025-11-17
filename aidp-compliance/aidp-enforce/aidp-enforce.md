# Lab 3: Inheriting Governance in AI Data Platform and Enforcing Security

## Objective

Illustrate how Oracle AI Data Platform (AIDP) can leverage the cataloged and integrated data from previous labs, respect existing governance definitions, and implement additional security measures. Using the transformed HR Employee Dataset (with masked PII like Name, Email, Salary, SSN), you'll enforce role-based access and audit trails.

## Steps

1. **Connect AIDP Workspace to the Cataloged and Transformed Data**:
   - From the OCI Console, search for "AI Data Platform" or navigate to Analytics & AI > AI Data Platform.
   - In your AIDP workspace, go to Connections and click "Create Connection".
   - Select the type (e.g., Object Storage or Database), and enter details like bucket name or DB credentials from Lab 2 output.
   - Test and save the connection.

   ![Connect to Data](images/connect-data.png)
   *(Image description: Connection creation form with type and credential fields.)*

2. **Demonstrate Role-Based Access to Data**:
   - In AIDP, import the dataset using the new connection.
   - Simulate roles: Log in as different users or use role-switching if available (e.g., Data Scientist sees all columns; Analyst sees masked views via policies).
   - Verify restrictions: Attempt to query sensitive columns and confirm Data Catalog PII tags block unauthorized access.

   ![Role-Based Access](images/role-access.png)
   *(Image description: Dataset view with role-based restrictions applied.)*

3. **Apply Additional Tagging/Ownership in AIDP**:
   - In the dataset details, go to Metadata or Tags section.
   - Add tags (e.g., "Compliance-Reviewed") or assign ownership (e.g., to group ComplianceTeam).
   - This step is optional but enhances governance if supported in your workspace.

   ![Apply Tags](images/apply-tags.png)
   *(Image description: Metadata editing interface for tags and ownership.)*

4. **Run a Simple Data Transformation or ML Experiment**:
   - In AIDP, create a new Notebook or Job.
   - Use SQL or code to aggregate, e.g., SELECT Department, AVG(Salary) FROM hr_dataset GROUP BY Department.
   - Execute the job and review results, ensuring governance rules are applied.

   ![Run Experiment](images/run-experiment.png)
   *(Image description: Job creation and execution interface.)*

5. **Trace Lineage and Audit Data Access**:
   - In AIDP, navigate to Lineage or Governance tab for the dataset/job.
   - Trace back to original HR dataset via Lab 2 pipeline.
   - Generate audit report: Go to Audits, filter by dataset, and export logs showing access and transformations.

   ![Trace Lineage](images/trace-lineage.png)
   *(Image description: Lineage view with audit log export option.)*

## Expected Outcome

AIDP inherits and enforces governance from upstream services, ensuring only authorized access to sensitive HR data. This creates an end-to-end secure workflow, with audit reports providing a clear "paper trail" for compliance, identifying who accessed, transformed, and analyzed data like employee salaries.

## Troubleshooting Notes
- If connection fails, verify credentials and IAM policies for AIDP access to sources.
- For role-based access issues, check AIDP workspace policies and Data Catalog integrations.
- If lineage is incomplete, ensure all upstream jobs (from Labs 1-2) were successful and published.

## Recap and Key Value Points

This workshop has shown how OCI Data Catalog, Data Integration, and AIDP interoperate for seamless, enterprise-grade governance.

- Centralized metadata, classification, and lineage create defensible audit trails and simplify regulatory compliance.
- Security controls are enforced at each service layer, with no compromise to collaboration or productivity.
- AIDP is positioned as a secure and governed participant in broader Oracle data architectures.

Congratulations! You've completed the workshop.
