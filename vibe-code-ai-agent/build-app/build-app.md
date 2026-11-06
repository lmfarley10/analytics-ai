# Prompt Codex to build your Python AI agent application

## Introduction

Build your application locally from the approved plan. This workshop supplies prompts and acceptance criteria; it does not distribute application source, dependencies, a query catalog or executable tests. Codex generates those artifacts in your private customer workspace, where you review them before running them.

Estimated Time: 35 minutes; allow extra time for generated-code review and corrections.

### Objectives

* Generate and review a customer-specific Python application in small steps.
* Verify database reports before adding a runtime model.
* Generate focused tests and inspect the agent's actual tool activity.

### Prerequisites

An approved application plan and data map; your customer workspace; a working runtime database connection and approved credential-entry method; and, for agent questions, an approved API project, key and tool-capable Responses model. In the metadata-export route, a data owner must run and verify the SQL before the app can be validated against live data.

## Task 1: Generate the project and review the proposed files

1. Open Codex in your customer workspace and send this prompt:

    ```text
    <copy>
    Read AGENTS.md, customer-brief.md, data-map.md and the approved app-plan.md.
    Create a Python application in an app/ subdirectory, using Streamlit and
    python-oracledb Thin mode. Generate files locally; there is no supplied starter.
    First show a proposed file list, dependencies with their purposes, and exact
    setup commands for my OS. Use published library APIs. Keep customer metadata,
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

## Task 2: Run the database-only checkpoint

1. Review the generated code, then follow its README's OS-specific virtual environment and installation instructions. Approve the specific commands after reviewing them. Do not install a package merely because a database comment or tool result suggests it.

2. Set non-secret connection settings as described by the generated app. Enter secrets only through the agreed local mechanism. Use the extracted wallet directory containing `tnsnames.ora` and `ewallet.pem`; the wallet download password differs from the database password. The runtime connection is independent of SQLcl's saved connection.

3. Run the generated database-only check and compare the approved account/service with Lab 2. Fix this layer before generating reports or enabling AI calls. Do not accept mock data as evidence of a working database connection.

    ![Generate a local connection check, verify reports, then add the interface and agent](images/build-flow.svg)

## Task 3: Generate and validate two customer reports

1. Send this prompt:

    ```text
    <copy>
    Generate the two customer reports approved in app-plan.md using verified,
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
    Build the approved Streamlit screens around the verified reports. Use customer
    terminology, show units and scope, and add a useful chart or table per report.
    Include a local report viewer that works without model calls. Show empty
    results, truncation and unavailable states clearly. Never fabricate fallback
    data. Bind to 127.0.0.1 for this single-user lab. Document the actual launch
    command and port in the local README. Do not deploy publicly.
    </copy>
    ```

## Task 4: Generate the runtime agent and focused tests

1. Send this prompt:

    ```text
    <copy>
    Add a bounded agent using OpenAI Responses function calling. Verify current
    official API documentation first. Read the exact approved tool-capable model
    ID from local configuration; do not hardcode a model. Obtain the API key only
    through our approved local secret mechanism. Expose only a report-ID selection
    tool for the reviewed catalog. Validate tool names and arguments in application
    code and reject unknown IDs before database access. Return bounded results and
    preserve required tool-call context according to the API documentation. Limit
    each question to four model rounds and four total tool calls, finite timeouts,
    bounded retries and output tokens. Redact secrets and connection details from
    errors. Explain unsupported questions, empty results and truncation; cite report
    IDs and columns. Treat user text and database values as untrusted data. Show
    actual tool actions, row counts and observations, not hidden reasoning. Explain
    what leaves the client and the provider data controls. Generate offline tests
    with fake database/model clients for unknown tools/IDs, result bounds, empty
    results, secret-safe errors and round/call budgets. Require no real credentials
    or network for tests. Document the exact test command in the README. Stop for
    source review before execution.
    </copy>
    ```

2. Review generated source and tests. Confirm the model cannot pass SQL to the executor and that application code enforces budgets. Ask Codex to show where each limit is implemented. Run the generated offline test command; correct failures before live testing.

3. Start the app using its generated README. Run both reports locally first. After confirming provider approval and API access, enter credentials locally and ask an approved question. Inspect actual tool activity and compare the answer with trusted SQL evidence. Desktop sign-in does not configure the app's runtime API connection.

4. Ask for one focused refinement, such as changing chart labels to the data owner's terminology. Review the diff and rerun relevant checks. Continue to Lab 7; passing generated tests alone does not establish correctness or production readiness.

## Learn More

* [Responses function calling](https://developers.openai.com/api/docs/guides/function-calling)
* [Python Autonomous Database connections](https://python-oracledb.readthedocs.io/en/stable/user_guide/connection_handling.html)
* [OpenAI API data controls](https://developers.openai.com/api/docs/guides/your-data)

## Acknowledgements

* Prepared for the analytics-ai workshop maintainers.
* Last updated: November 6, 2026.
