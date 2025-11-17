# Enterprise Data Security & Compliance with OCI Data Catalog, Data Integration, and AI Data Platform

## Workshop Overview

This workshop demonstrates how to achieve enterprise-grade data security and compliance using OCI Data Catalog for metadata management, OCI Data Integration for secure pipelines, and Oracle AI Data Platform (AIDP) for governed AI workflows. You'll work with a simulated HR Employee Dataset containing sensitive personally identifiable information (PII) such as names, emails, departments, salaries, and SSNs. The labs guide you through classifying sensitive data, building secure integration pipelines, and enforcing governance in AIDP, ensuring compliance with regulations like GDPR or SOX.

The workshop is designed to be straightforward, focusing on key concepts without unnecessary complexity. Each lab builds on the previous one, providing clear steps and expected outcomes.

## Prerequisites

- Oracle Cloud Account with access to:
  - OCI Console (including Data Catalog, Data Integration, Object Storage, IAM)
  - Oracle AI Data Platform (AIDP) workspace with appropriate user roles (e.g., Data Catalog User, Data Integration Administrator, AIDP Workspace Administrator)
- Simulated HR Employee Dataset (with PII, e.g., Name, Email, Dept., Salary, SSN). This can be a CSV file uploaded to Object Storage or sourced from an Autonomous Data Warehouse. If not pre-provisioned, upload the provided hr_employee_dataset.csv to an Object Storage bucket:
  1. Navigate to Storage > Object Storage in OCI Console.
  2. Create or select a bucket (e.g., hr-data-bucket).
  3. Upload hr_employee_dataset.csv.
  4. Note the bucket name and object path for use in labs.
- Basic familiarity with OCI navigation, storage concepts, and AIDP workspace access.
- LiveLab Preparation: Pre-provision resources (Object Storage buckets, user roles, and appropriate policies for fast onboarding). Ensure IAM policies allow access to required services, e.g., allow group WorkshopUsers to manage data-catalog-family in tenancy.


## Setup and Troubleshooting Notes
- If you encounter permission errors, verify your IAM policies and roles.
- Ensure the AIDP workspace is created and accessible before starting.
- All labs reference images; if images are missing, refer to text descriptions for UI guidance.

Proceed to Lab 1 to start with data cataloging and classification.
