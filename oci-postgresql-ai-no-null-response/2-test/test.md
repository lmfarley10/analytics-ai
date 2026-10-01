
# Upload Files and Test the Search Application

## Introduction
In this lab, we will test what we created in Lab 1
Estimated time: 20 min

### Objectives

- Test the program

### Prerequisites
- The previous lab must have been completed.

## Task 1: Locate the RAG dataset
You will use the local repository cloned in Lab 1. Its `dataset` folder contains the sample files for this exercise:

````
PostgreSQL-AI/dataset/
````

Keep this local repository available while testing the application. On Windows with WSL 2, use `\\wsl$\<distribution-name>\home\<linux-user>\PostgreSQL-AI\dataset` in the browser file picker.

## Task 2: Upload the sample files to the search app

You will load a file into the search app which will be parsed, chunked, vector embeddings created & ingested into the OCI PostgreSQL database. 
     
1. Go to the application URL:

    ````
    http://127.0.0.1:8000/
    ````

    Keep the Bastion SSH tunnel and local app running. This URL opens the app on your laptop.

2. Login to the app, using the local app credentials set in Lab 1

    ![Login](images/app-login-1.png)

3. Click on Account

    ![Register](images/app-register-1.png)

    Scroll down, click "Create Account"

    ![Register](images/app-register-2.png)

    Register with your Email and set your password

    The Email can be a dummy email too.

    ![Register](images/app-register-3.png)

    
4. In the Upload section, browse to the *dataset* folder and select both the sample files, and then click *Upload*

    ![Upload Files](images/app-upload-us-files1.png)
    ![Upload Files](images/app-upload-us-files2.png)
    ![Upload Files](images/app-upload-us-files3.png)

5. Click on "Search Options", then ensure *RAG*  is selected as the Search Mode

    ![RAG](images/app-us-search-1.png) 
    ![RAG](images/app-us-search-2.png)   

6. Type "What are the key differences in coverage, costs, provider choice, and prescription-drug coverage between Original Medicare and Medicare Advantage?", and click on *Search*

    ![RAG](images/app-us-search-3.png)

    The References of the RAG Search are also listed.

    **Search Matches** come from PostgreSQL through your Bastion tunnel. **LLM Response** comes from OCI Generative AI when `LLM_PROVIDER=oci`; Ollama is not used for these answers. The two time badges measure the database search and model response separately. A long **LLM Response** time does not mean the database tunnel is slow.

    If you see references but **No LLM answer**, check `OCI_GENAI_MODEL_ID` in `search-app/.env`. An OCI model OCID starts with `ocid1.`; a model name must match the OCI Console exactly. Also check that the model, `OCI_REGION`, and `OCI_GENAI_ENDPOINT` use the same region. Restart the app after changing `.env`, then search again.

    ![RAG](images/app-us-search-4.png)
   
7. Type "What are the standard-deduction amounts for each filing status, and who may claim an additional deduction because of age or blindness?", then *Search*

    ![RAG](images/app-us-search-5.png)

    The References of the RAG Search are also listed.

    ![RAG](images/app-us-search-6.png) 
       
 
## Task 3: Optional - Test additional files
This is an optional test you can run with your own files. If you do this test, you will have more content in the database. If you're running short of time, then you can skip it or come back to it later.

**You may now proceed to the [next lab.](#next)**

## Known issues

None

## Acknowledgements

- **Author**:
    - Shadab Mohammad, Master Principal Cloud Architect, January 2026
- **Contributors**:
    - Kaushik Kundu, Master Principal Cloud Architect
    - Sasanka Abeysinghe, Principal Cloud Architect
    - Luke Farley, Senior Cloud Engineer
- **Last Updated By** - Luke Farley, Senior Cloud Engineer, September 2026
