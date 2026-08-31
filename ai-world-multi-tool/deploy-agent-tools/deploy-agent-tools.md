# Lab 2: Deploy Agent Tools

## Introduction

This lab configures the OCI Generative AI Agent tools. You will confirm the RAG tool created in Lab 1, configure an Autonomous AI Database and Database Tools connection for SQL, add a Weather tool, and test the multi-tool agent.

The following agent tools will be configured: 
* General LLM Chat (Built-in)
* Weather
* RAG 
* SQL

Estimated Time: 45 minutes

### Objectives

In this lab, you will:
* Create Vault to store DB secret
* Define agent tools in the OCI console
* Provision an Oracle Autonomous AI Database
* Create DB Tools Connection

### Prerequisites

This lab assumes you have:

* An Oracle account
* All previous labs successfully completed

> **Important:** Before enabling SQL execution or SQL self-correction, ensure that the Generative AI Agent runtime has permission to use the Database Tools connection and read its password secret. See [SQL Tool Guidelines for Generative AI Agents](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/sqltool-guidelines.htm).

For the compartment that contains the Database Tools connection and secret, the agent runtime requires policies equivalent to:

```text
<copy>
Allow any-user to use database-tools-connections in compartment <compartment-name> where request.principal.type='genaiagent'
Allow any-user to read database-tools-family in compartment <compartment-name> where request.principal.type='genaiagent'
Allow any-user to read secret-family in compartment <compartment-name> where request.principal.type='genaiagent'
</copy>
```

## Task 1: Add Agent Routing Instructions and Confirm RAG Tool Configuration

1. Navigate to your GenAI Agent created in the previous lab 

![Screenshot showing how to navigate to the Agents service from the main menu](./images/console/agents-service-navigation.png)

2. Edit your agent and add the following routing instructions: 

    ```text
     <copy>
      You are a helpful assistant. If a user asks about design considerations for generative AI applications, use the rag tool. If a user asks about employees, use atomlivelab-sql tool. If a user asks about the weather, use the weather tool. If a user asks a general question, use your general knowledge, no tools.
     </copy>
    ```

    > **Note** The RAG tool is grounded in *Design Considerations for GenAI Apps.pdf*. The routing instruction uses this document's subject so the agent selects the RAG tool for relevant questions.

3. Select your agent and confirm it has a RAG tool as configured in the previous lab. If not, create a new tool.

![Create RAG Tool](./images/rag/create-rag-tool.png)

4. Confirm the description of the tool and the knowledge base you created in the previous lab 

![Configure RAG Tool](./images/rag/config-rag.png)

5. Navigate to the agent endpoint and launch the chat. You should now be able to ask questions about design considerations for generative AI applications.

![Test RAG Tool](./images/rag/test-rag.png)

## Task 2: Create Vault to store database secrets

This task will help you to create vault which would be used to save secrets for the database. The secrets are used for the agent to connect to your database with the db tool connection.

1. Locate Vault under Key Management & Secret Management. Provide Name and click on Create Vault.

    ![Vault](images/adb/create_vault.png)

2. Go to the newly created Vault. Click on Create Key.

3. Provide Name and leave rest as default. Choose Protection Mode as HSM and click on Create Key.

    ![Create Key](images/adb/create_key.png)

## Task 3: Create Autonomous Database

This task involves creating Autonomous Database 26ai.

1. Locate Autonomous Databases under Oracle Databases. Click on Create Autonomous Database.

    ![Create ADB](images/adb/create_adb.png)

2. Provide information for Compartment, Display name, Database name. Choose workload type as Transaction Processing. Choose deployment type as Serverless. Choose database version as 26ai and give it a password of your preference.

    ![Create ATP](images/atp/create-atp-1.png)

3. For **Network access**, select **Secure access from everywhere** to create a public endpoint. Keep **Require mutual TLS (mTLS) authentication** enabled. This workshop uses only sample data; do not use this public-endpoint configuration for production data.

4. Finally click on Create Autonomous Database.

## Task 4: Create Database Tools Connection

This task involves creating a Database Tools Connection which will be used to query the database using SQL Worksheet.

1. Locate Database Tools Connections under Developer Services. Click on Create connection.

    ![Create conn](images/adb/dbconn.png)

2. Provide Name and Compartment information. Choose **Oracle Autonomous Database** as the Database cloud service, select the Autonomous Database you created in Task 3, and provide the username `ADMIN`.

3. Click **Create password secret**. Provide a name, the Vault and key created in Task 2, and the same password used when you created the Autonomous Database.

    ![Create Password](images/adb/dbconn_pass.png)

4. Use the newly created password secret as **User password secret**.

5. Under **Secure connection details**, choose **SSO wallet (for example, `cwallet.sso`)** for Wallet format. Select **Create Key Store Content Secret** and store the wallet in the Vault created in Task 2. If the console offers **Retrieve regional auto login wallet from Autonomous Database**, use it; otherwise download the auto-login wallet from the Autonomous Database **Database connection** page and upload `cwallet.sso`.

6. The connection string is populated when you select the Autonomous Database. Do not modify it to use a private IP address.

7. Do not select **Access database via a private network** or a Database Tools private endpoint.

8. Click **Create** to create the Database Tools connection.

9. Open the newly created Database Tools connection and select **Validate**.

> **Production note:** A production database should use private endpoint access, a Database Tools private endpoint, least-privilege network rules, and production data controls. This public-endpoint configuration is intentionally limited to the disposable workshop database and sample data.

## Task 5: Create and Populate Employee Table

1. Navigate to the SQL Worksheet of your newly created ADB and run the following statements: 

> **Note** You can create or use your own tables here; we provided the table below for illustration purposes. 

```text
<copy>
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DepartmentID INT,
    HireDate DATE NOT NULL
);
</copy>
```

- Populate your table with the following data 

```text
<copy>
INSERT ALL
INTO Employees (EmployeeID, Name, DepartmentID, HireDate) VALUES (1, 'John Doe', 1, TO_DATE('2020-01-01', 'YYYY-MM-DD'))
INTO Employees (EmployeeID, Name, DepartmentID, HireDate) VALUES (2, 'Jane Smith', 2, TO_DATE('2020-02-01', 'YYYY-MM-DD'))
INTO Employees (EmployeeID, Name, DepartmentID, HireDate) VALUES (3, 'Bob Johnson', 1, TO_DATE('2020-03-01', 'YYYY-MM-DD'))
INTO Employees (EmployeeID, Name, DepartmentID, HireDate) VALUES (4, 'Alice Brown', 3, TO_DATE('2020-04-01', 'YYYY-MM-DD'))
INTO Employees (EmployeeID, Name, DepartmentID, HireDate) VALUES (5, 'Mike Davis', 2, TO_DATE('2020-05-01', 'YYYY-MM-DD'))
SELECT * FROM dual;
</copy>
```

  > **Note** If you use your own table, large queries can cause timeouts in the agent service & ODA. Try filtering your results to avoid timeouts.

## Task 6: Create SQL Tool
1. In the console navigate to your agent and create a new SQL Tool

  ![Navigate to Agent](./images/console/agents-service-navigation.png)

2. Enter name e.g. atomlivelab-sql and description, along with the database schema 

> **Note** Make sure to use the same schema defined from the previous task.

```text
<copy>
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DepartmentID INT,
    HireDate DATE NOT NULL
);
</copy>
```

> **Note** If using your own table, to get a better idea of the schema run

```sql
DESC table_name;
```
 
in SQL Developer. 

![Create SQL Tool](images/sqltool/create-tool.png)

3. Select Oracle SQL as the dialect and select the database tool connection configured in the previous task. Enable SQL Execution and self correction. 
4. Test the connection 

![Test Connection](images/sqltool/tool-connection.png)

5. Create the tool 

6. Navigate to your endpoint and launch the chat. Ask a question such as "Give me list of employees". The agent should invoke the SQL Tool and convert the query to Oracle SQL, then return the result - 

  ![Test SQL Tool](./images/sql/test-sql-tool.png)

  ![Test SQL Tool](./images/sql/test-sql-tool-2.png)

  > * **Note** If the sql tool is not returning the correct response, it can be helpful to provide an in-line example to the tool. Also see [SQL Tool Guidelines](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/sqltool-guidelines.htm#sqltool-iclexamples)

  > * **Note** Also make sure the agent is using the correct tool for the job. If the agent is using the wrong tool, make sure to add a more detailed description and/or routing instructions.

## Task 7: Create a Weather Tool

  1. Navigate to the agent tools and create a new custom function tool called "get_weather" 

  - Give the following description - 

    ```text
    <copy>
      Get the weather for a given location
    </copy>
    ```

  - Paste the following function parameters - 
    ```text
    <copy>
    {"type":"object","properties":{"location":{"type":"string"}},"required":"['location']"}
    </copy>
    ```

  2. Create the tool 


## Task 8: Chat with your Agent

- You should now have all tools configured. Ask questions and your agent should determine which tools to use based on your query.

## Task 9: Clean Up Workshop Resources

1. When you finish the workshop and no longer need the environment, remove the SQL tool from the agent, then delete the Database Tools connection and the Autonomous Database.

2. After the database and connection are deleted, delete the password secret and wallet-content secret. Delete the Vault key and Vault only when they are not used by another resource.

3. If you do not plan to continue experimenting, delete the agent endpoint, agent, knowledge base, and Object Storage bucket created for the workshop. Do not delete shared or organization-managed resources.

4. Verify that the public workshop database no longer appears on the Autonomous Databases page.

## Learn More

* [SQL Tool Guidelines for Generative AI Agents](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/sqltool-guidelines.htm)
* [Database Tools - ADB Shared with Public IP](https://docs.oracle.com/en-us/iaas/database-tools/doc/oracle-database-use-cases.html#OCDBT-GUID-87796740-BAE4-4805-BF6D-C75A02A3D1D4)
* [RAG Tool Oracle Database Guidelines for Generative AI Agents](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/oracle-db-guidelines.htm)

## Acknowledgements

**Author** 
  * **Luke Farley**, Senior Cloud Engineer, NACIE

**Contributors**
  * **Kaushik Kundu**, Master Principal Cloud Architect, NACIE
  * **Abhinav Jain**, Senior Cloud Engineer, NACIE
  * **Ale Casas**, Senior Principal Product Marketing
  * **Raj Arora**, Master Principal Analytics Cloud Architect

**Last Updated By/Date**
* **Luke Farley**, Senior Cloud Engineer, NACIE, August 2026
