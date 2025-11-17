# Lab 1: Centralized Data Cataloging & Classification for Compliance

## Objective

Introduce users to data registration, classification, and tagging for compliance using OCI Data Catalog. This establishes strong governance from the ingestion stage, ensuring sensitive data is identified and managed early.

You'll use the simulated HR Employee Dataset (e.g., a CSV file in Object Storage containing columns like Name, Email, Department, Salary, SSN) to demonstrate classifying PII and financial data.

## Steps

1. **Register a New Data Asset**:
   - From the OCI Console home page, search for "Data Catalog" under Analytics & AI > Data Catalog.
   - In Data Catalog, go to Data Assets and click "Create Data Asset".
   - Select the source type (e.g., Object Storage).
   - Provide details: Enter a name (e.g., HR-Dataset-Asset), the bucket name (from prerequisites), and object path (e.g., hr_employee_dataset.csv).
   - Save the asset. If you encounter errors, check your IAM permissions.

   ![Register Data Asset](images/register-asset.png)
   *(Image description: Shows the Create Data Asset form with fields for name, type, and connection details.)*

2. **Scan and Harvest Metadata**:
   - Navigate to the newly created data asset's details page.
   - Click "Harvest" or "Create Job" to initiate a metadata harvest job.
   - Configure the job: Select the asset, choose full harvest, and run it.
   - Monitor the job status until complete. This pulls in schema info like column names (e.g., Name, Email, Salary) and data types.

   ![Harvest Metadata](images/harvest-metadata.png)
   *(Image description: Displays the harvest job configuration and status page.)*

3. **Apply Business Glossary Terms, Classify Sensitive Columns, and Add Tags**:
   - From the data asset, browse to Entities > Select the HR dataset entity.
   - For each sensitive column (e.g., Name and Email as PII, Salary as financial):
     - Edit the column properties.
     - Apply classifications like "Sensitive" or "PII" from the classification dropdown.
   - Add custom tags such as "GDPR-Regulated" or "Confidential" in the tags section.
   - Optionally, link to a business glossary: Go to Glossary, create/link a term like "Employee Data".

   ![Classify Columns](images/classify-columns.png)
   *(Image description: Shows column editing interface with classification and tag options.)*

4. **Demonstrate Catalog Search**:
   - In Data Catalog, use the search bar at the top.
   - Query for sensitive data, e.g., search by tag "PII" or classification "Sensitive".
   - Verify results show the HR dataset's columns like Name and Email.

   ![Catalog Search](images/catalog-search.png)
   *(Image description: Search results page listing tagged entities.)*

## Expected Outcome

You now have centralized governance and discoverability for the HR dataset. The classifications and tags provide a foundation for downstream security and compliance controls, making it easy to locate and protect sensitive information like employee salaries and personal details.

## Troubleshooting Notes
- If harvest job fails, check network connectivity, IAM policies (e.g., allow reading from Object Storage), or file format issues.
- Ensure the dataset CSV has a header row for proper schema detection.
- If tags/classifications don't appear, refresh the page or re-harvest.

Proceed to Lab 2 for building a secure data integration pipeline.
