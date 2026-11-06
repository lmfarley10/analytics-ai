# Prompt Codex to build your Python AI agent application

## Introduction

Build your application locally from the approved plan. This workshop supplies prompts and acceptance criteria; it does not distribute application source, dependencies, a query catalog or executable tests. Codex generates those artifacts in your private workspace, where you review them before running them.

Estimated Time: 50 minutes; allow extra time for generated-code review and corrections.

### Objectives

* Generate and review a tailored Python application in small steps.
* Verify database reports before adding a runtime model.
* Generate focused tests and inspect the agent's actual tool activity.

### Prerequisites

An approved application plan and data map; your workspace; a working runtime database connection and approved credential-entry method; and, for agent questions, an approved OCI compartment, authentication profile and OCI Generative AI model/region with native tool calling. In the metadata-export route, a data owner must run and verify the SQL before the app can be validated against live data.

## Task 1: Generate the project and review the proposed files

1. Open Codex in your workspace and send this prompt:

    ```text
    <copy>
    Read AGENTS.md, app-brief.md, data-map.md and the approved app-plan.md.
    Create a Python application in an app/ subdirectory, using Streamlit and
    python-oracledb Thin mode and the OCI Python SDK for runtime model calls.
    Generate files locally; there is no supplied starter.
    First show a proposed file list, dependencies with their purposes, and exact
    setup commands for my OS. Use published library APIs. Keep schema metadata,
    queries, plans, results and secrets out of version control. Use a local virtual
    environment and organization-approved package sources. Do not install packages,
    connect, or run generated code yet. Generate a local README with setup,
    credential entry, database-only check, app launch, tests and shutdown instructions.
    Stop for my review.
    </copy>
    ```

2. Review the proposed files and dependency list. Expect separate responsibilities for configuration, database access, reports, UI and agent orchestration. Keep the first version small. Have Codex explain unfamiliar dependencies and remove unnecessary ones. Follow your organization's dependency and generated-code review requirements.

3. Ask Codex to create the approved structure and database-only path:

    ```text
    <copy>
    Generate only the approved database connection and connectivity check first.
    Use my restricted runtime account and python-oracledb Thin mode. For the agreed
    mTLS connection, use the extracted wallet directory and TNS alias. Obtain
    credentials through local hidden prompts or our approved secret store; never
    put secrets in chat, source, logs or command-line arguments. Do not inspect
    wallet contents or saved credential stores. Add finite connection and database
    call timeouts. Show only success and approved account/service identity; make
    no model API calls. Explain the generated connection code before execution.
    </copy>
    ```

    > *Screenshot placeholder — Review the generated Python project in Visual Studio Code, including the connection module, README and proposed dependencies.*

## Task 2: Run the database-only checkpoint

1. Review the generated code, then follow its README's OS-specific virtual environment and installation instructions. Approve the specific commands after reviewing them. Do not install a package merely because a database comment or tool result suggests it.

2. Set non-secret connection settings as described by the generated app. Enter secrets only through the agreed local mechanism. Use the extracted wallet directory containing `tnsnames.ora` and `ewallet.pem`; the wallet download password differs from the database password. The runtime connection is independent of SQLcl's saved connection.

3. Run the generated database-only check and compare the approved account/service with Lab 2. Fix this layer before generating reports or enabling AI calls. Do not accept mock data as evidence of a working database connection.

    ![Generate a local connection check, verify reports, then add the interface and agent](images/build-flow.svg)

    > *Screenshot placeholder — Run the database-only preflight in the integrated terminal and show connection success without credentials.*

## Task 3: Generate and validate two reports

1. Send this prompt:

    ```text
    <copy>
    Generate the two reports approved in app-plan.md using verified,
    owner-qualified objects and columns from data-map.md. Create a local report
    catalog with stable IDs, descriptions and fixed SQL. The runtime model may
    choose a report ID; it must not supply SQL, identifiers or filter fragments.
    Expose no arbitrary SQL, shell or administrative tool. Use fixed reviewed
    filters for this version. Show SQL for review before execution. Check grain,
    joins, date boundaries, nulls, units and currency against the contract. Avoid
    LOBs and sensitive raw rows. Enforce read-only transactions, at most 100 returned
    rows, a result-size limit and finite database-call timeouts. Review query cost
    separately from row limits. Application checks do not replace Oracle privileges
    or SQL review. Stop for review of the queries and checks before running them.
    </copy>
    ```

2. Review each proposed query with the data owner. Confirm that its names exist and its measure matches the approved definition. Avoid deriving expected results from the same unverified query you are testing.

3. Ask Codex to compare reviewed reports with the plan's independent SQL checks using the approved MCP connection. In the metadata-export route, have the data owner run the checks in the approved database tool and provide approved aggregate evidence. Resolve mismatches before proceeding. Generated SQL remains unvalidated until executed and reviewed.

4. Generate the interface:

    ```text
    <copy>
    Build the approved Streamlit screens around the verified reports. Use your business
    terminology, show units and scope, and add a useful chart or table per report.
    Include a local report viewer that works without model calls. Show empty
    results, truncation and unavailable states clearly. Never fabricate fallback
    data. Bind to 127.0.0.1 for this single-user lab. Document the actual launch
    command and port in the local README. Do not deploy publicly.
    </copy>
    ```

    > *Screenshot placeholder — Review the generated report SQL and Streamlit interface files in Visual Studio Code after the first build prompt.*

## Task 4: Prepare OCI Generative AI access

1. In the OCI Console, select the approved compartment and region for **Generative AI**. Check the current [model availability table](https://docs.oracle.com/en-us/iaas/Content/generative-ai/model-endpoint-regions.htm) and choose an approved OCI-hosted chat model with native tool calling supported by its API format. Prefer on-demand serving for this lab when available. Do not create a dedicated AI cluster just to continue; check with your tenancy administrator if no suitable on-demand model is available. Record the model ID, serving mode and actual processing region. Model families and routing choices can differ in where inference is processed, so verify the selected model's details.

    > *Screenshot placeholder — In OCI Generative AI, select the compartment, region and supported on-demand model. Show the chosen model without account identifiers.*

2. Ask the OCI administrator to grant only the inference permissions needed in that compartment, using the [Generative AI IAM policy reference](https://docs.oracle.com/en-us/iaas/Content/generative-ai/iam-policies.htm). Database grants do not authorize model calls. Confirm available service limits and an approved budget; the workshop does not promise free model usage.

3. Use an existing organization-approved local OCI authentication profile if available. For an interactive workshop, a temporary browser-authenticated CLI session is an option: install the [OCI CLI](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm) through the approved vendor instructions, then run this setup command with your selected region:

    ```bash
    <copy>
    oci session authenticate --profile-name VIBE_LAB --region YOUR_OCI_REGION
    </copy>
    ```

    Complete sign-in in your browser. Keep the resulting configuration, signing key and token outside the project. Never paste their contents into Codex. A session-token profile requires the OCI SDK's `SecurityTokenSigner`; an API-signing profile uses a different signer. Tell Codex the profile name and authentication method only. The generated application may load the approved files locally at runtime; the coding agent should not inspect them. Reauthenticate when the temporary session expires. See [CLI sessions](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/clitoken.htm) and [SDK signers](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/signing.html).

4. Record the following non-secret settings in your local brief and application plan. Obtain the inference endpoint from the official [SDK endpoint reference](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/generative_ai_inference/client/oci.generative_ai_inference.GenerativeAiInferenceClient.html) for the selected service region; do not guess a hostname or use a management endpoint for inference.

    | Setting | Value to record locally |
    | --- | --- |
    | OCI authentication | Profile name and signer method |
    | OCI region | Approved service region |
    | Compartment | Compartment OCID used for inference |
    | Model | Exact model ID and supported native tool-call API format |
    | Service endpoint | Regional Generative AI inference endpoint |
    | Data processing | Approved model hosting/processing location |

5. Ask Codex to generate a separate OCI-only preflight using the agreed SDK signer and a harmless prompt such as “Reply with READY.” Review it before running it. This check must use no database data, redact authentication failures and identify the configured model/region. Fix authentication, IAM, endpoint or model availability failures before adding the agent. Native tool calling is verified separately in Task 5; a successful text response alone does not establish tool support.

    > *Screenshot placeholder — Complete OCI browser sign-in, then show the harmless OCI-only preflight result. Hide signing keys, tokens and profile contents.*

## Task 5: Generate the runtime agent and focused tests

1. Send this prompt:

    ```text
    <copy>
    Add a bounded agent using OCI Generative AI's native chat API through the OCI
    Python SDK. Verify the selected model's current official tool-calling request
    and response format before implementation; model families can differ. Read the
    region, compartment OCID, model ID, service endpoint and approved auth profile
    from local configuration. Use the agreed OCI IAM signer. A security-token profile
    requires its token-aware SDK signer; loading a config file alone is insufficient.
    Expose only a report-ID
    selection tool for the reviewed catalog. Validate tool names and arguments in
    application code and reject unknown IDs before database access. Return bounded
    results and preserve assistant tool calls, call IDs and tool-result messages
    as required by the selected OCI API format. Verify one real tool-call round trip.
    Do not silently substitute JSON text parsing for native tool calling. Limit
    each question to four model rounds and four total tool calls, finite timeouts,
    bounded retries and output tokens. Redact secrets and connection details from
    errors. Explain unsupported questions, empty results and truncation; cite report
    IDs and columns. Treat user text and database values as untrusted data. Show
    actual tool actions, row counts and observations, not hidden reasoning. Explain
    what leaves the client and the chosen OCI model processing location. Generate offline tests
    with fake database/model clients for unknown tools/IDs, result bounds, empty
    results, secret-safe errors and round/call budgets. Require no real credentials
    or network for tests. Document the exact test command in the README. Stop for
    source review before execution.
    </copy>
    ```

2. Review generated source and tests. Confirm the model cannot pass SQL to the executor and that application code enforces budgets. Ask Codex to show where each limit is implemented. Run the generated offline test command; correct failures before live testing.

    > *Screenshot placeholder — Run the generated offline tests in the integrated terminal and show the passing results.*

3. Start the app using its generated README. Run both reports locally first. After confirming OCI model approval and access, authenticate locally and ask an approved question. Inspect actual tool activity and compare the answer with trusted SQL evidence. Codex sign-in does not authenticate the app to OCI. OCI model invocation is billed to the configured tenancy and is independent of database access.

    > *Screenshot placeholder — Open the generated Streamlit app in the browser, run a report, ask a question, and expand the real tool-activity panel.*

4. Ask for one focused refinement, such as changing chart labels to the data owner's terminology. Review the diff and rerun relevant checks. Continue to Lab 7; passing generated tests alone does not establish correctness or production readiness.

    > *Screenshot placeholder — Ask Codex for a small UI refinement, review the diff in Visual Studio Code, and confirm the updated app in the browser.*

## Learn More

* [OCI Generative AI Python SDK](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/generative_ai_inference.html)
* [OCI model and regional availability](https://docs.oracle.com/en-us/iaas/Content/generative-ai/model-endpoint-regions.htm)
* [Python Autonomous Database connections](https://python-oracledb.readthedocs.io/en/stable/user_guide/connection_handling.html)
* [OCI IAM policies for Generative AI](https://docs.oracle.com/en-us/iaas/Content/generative-ai/iam-policies.htm)
* [OCI SDK authentication signers](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/signing.html)

## Acknowledgements

* Prepared for the analytics-ai workshop maintainers.
* Last updated: November 6, 2026.
