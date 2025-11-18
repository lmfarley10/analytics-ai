# Centralized Data Cataloging & Classification for Compliance

## Introduction

This lab introduces you to data registration, classification, and tagging for compliance using OCI Data Catalog. This establishes strong governance from the ingestion stage, ensuring sensitive data is identified and managed early.

> **Estimated Time:** 30 minutes

---

### About OCI Data Catalog

OCI Data Catalog is a metadata management service that helps organizations discover, organize, and enrich data assets. It provides a centralized repository for metadata, enabling data governance, classification, and search capabilities to support compliance and data management.

---

### Objectives

In this lab, you will:
- Register a new data asset in OCI Data Catalog
- Scan and harvest metadata from the data asset
- Apply business glossary terms, classify sensitive columns, and add tags
- Demonstrate catalog search for sensitive data

---

### Prerequisites

This lab assumes you have:
* An Oracle Cloud account (or provided lab credentials)
* Access to OCI Data Catalog and Object Storage
* Basic familiarity with web-based Oracle Cloud interfaces (helpful but not required)
* A simulated HR Employee Dataset (e.g., a CSV file in Object Storage containing columns like Name, Email, Department, Salary, SSN)

---

## Task 1: Register a New Data Asset

1. From the OCI Console home page, search for "Data Catalog" under Analytics & AI > Data Catalog.
2. In Data Catalog, go to Data Assets and click "Create Data Asset".
3. Select the source type (e.g., Object Storage).
4. Provide details: Enter a name (e.g., HR-Dataset-Asset), the bucket name (from prerequisites), and object path (e.g., hr_employee_dataset.csv).
5. Save the asset. If you encounter errors, check your IAM permissions.

   ![Register Data Asset](images/register-asset.png)
   *(Image description: Shows the Create Data Asset form with fields for name, type, and connection details.)*

## Task 2: Scan and Harvest Metadata

1. Navigate to the newly created data asset's details page.
2. Click "Harvest" or "Create Job" to initiate a metadata harvest job.
3. Configure the job: Select the asset, choose full harvest, and run it.
4. Monitor the job status until complete. This pulls in schema info like column names (e.g., Name, Email, Salary) and data types.

   ![Harvest Metadata](images/harvest-metadata.png)
   *(Image description: Displays the harvest job configuration and status page.)*

## Task 3: Apply Business Glossary Terms, Classify Sensitive Columns, and Add Tags

1. From the data asset, browse to Entities > Select the HR dataset entity.
2. For each sensitive column (e.g., Name and Email as PII, Salary as financial):
   - Edit the column properties.
   - Apply classifications like "Sensitive" or "PII" from the classification dropdown.
3. Add custom tags such as "GDPR-Regulated" or "Confidential" in the tags section.
4. Optionally, link to a business glossary: Go to Glossary, create/link a term like "Employee Data".

   ![Classify Columns](images/classify-columns.png)
   *(Image description: Shows column editing interface with classification and tag options.)*

## Task 4: Demonstrate Catalog Search

1. In Data Catalog, use the search bar at the top.
2. Query for sensitive data, e.g., search by tag "PII" or classification "Sensitive".
3. Verify results show the HR dataset's columns like Name and Email.

   ![Catalog Search](images/catalog-search.png)
   *(Image description: Search results page listing tagged entities.)*

---

## Next Steps

You now have centralized governance and discoverability for the HR dataset. The classifications and tags provide a foundation for downstream security and compliance controls, making it easy to locate and protect sensitive information like employee salaries and personal details.

Proceed to the next lab for building a secure data integration pipeline.

---

## Acknowledgements

**Authors**
* **Luke Farley**, Senior Cloud Engineer, ONA Data Platform

**Contributors**
* **Enjing Li**, Senior Cloud Engineer, ONA Data Platform

**Last Updated By/Date:**
* **Luke Farley**, Senior Cloud Engineer, ONA Data Platform, November 2025
