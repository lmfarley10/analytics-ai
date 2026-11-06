# References and publication checklist

## Introduction

Use the official references when rehearsing or updating a workshop release. Product names, installers, UI labels, Java requirements, account eligibility and MCP configuration can change.

Estimated Time: 10 minutes for reference review; allow additional time for both platform rehearsals.

### Objectives

* Keep setup guidance linked to current official sources.
* Rehearse schema adaptation and capture genuine screenshots.
* Distinguish offline checks from live acceptance evidence.

## Official sources

Documentation reviewed November 6, 2026. Reverify before publication.

| Topic | Primary reference | Workshop use |
| --- | --- | --- |
| Desktop experience | [OpenAI desktop guide](https://learn.chatgpt.com/docs/app) | Current download and local project entry points |
| Windows | [OpenAI Windows guide](https://learn.chatgpt.com/docs/windows/windows-app) | Native Windows setup |
| Codex CLI | [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) | Installation and sign-in |
| MCP configuration | [OpenAI MCP guide](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) | stdio command, tools and timeouts |
| SQLcl prerequisites | [Original MCP prerequisites](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/25.2/sqcug/preparing-your-environment.html) | MCP introduced in 25.2; release-specific Java verification needed |
| SQLcl launch | [Oracle MCP launch](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/25.4/sqcug/starting-and-managing-sqlcl-mcp-server.html) | Local SQLcl process with `-mcp` |
| SQLcl tools | [Oracle MCP tools](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/25.4/sqcug/sqlcl-mcp-server-tools.html) | Tool names and capabilities |
| Saved connections | [Oracle MCP connections](https://docs.oracle.com/en/database/oracle/sql-developer-vscode/26.3/sqdnx/configuring-database-connections.html) | Saved password and connection store |
| Wallet connection | [Oracle SQLcl mTLS](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/connect-sqlcl.html) | SQLcl cloud configuration and wallet ZIP |
| Python connection | [python-oracledb connection guide](https://python-oracledb.readthedocs.io/en/stable/user_guide/connection_handling.html) | Thin mode, extracted wallet and connection arguments |
| Runtime model | [OCI Generative AI SDK](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/generative_ai_inference.html) | Native chat and tool request/response classes |
| Model capability | [GenericChatRequest](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/generative_ai_inference/models/oci.generative_ai_inference.models.GenericChatRequest.html) | Tool definitions for compatible model families; check the chosen family |
| Region and hosting | [OCI model availability](https://docs.oracle.com/en-us/iaas/Content/generative-ai/model-endpoint-regions.htm) | Approved model, serving mode and processing region |
| Runtime permissions | [OCI Generative AI IAM](https://docs.oracle.com/en-us/iaas/Content/generative-ai/iam-policies.htm) | Scoped inference access |
| Local authentication | [OCI CLI sessions](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/clitoken.htm), [SDK signers](https://docs.oracle.com/en-us/iaas/tools/python/latest/api/signing.html) | Local authentication profile and matching SDK signer |

## Images and screenshot capture plan

All current SVGs are original instructional illustrations, explicitly labeled inside the image. They show actions and boundaries rather than imitating a vendor UI. They contain no real accounts or application data. The file dimensions are at most 1200 × 720 pixels.

Genuine screenshots from the isolated Mac rehearsal appear beside selected tasks. Remaining italic screenshot placeholders identify captures still needed; they are not mock product images. Screenshots show one example project, while the prompts remain reusable across approved schemas.

For a publication-ready screenshot edition, capture the following on a clean supported Mac and Windows machine. Use genuine screenshots from the tested releases, redact locally, keep each dimension at or below 1280 pixels, record product versions/date, and insert the image beside the corresponding task. Do not relabel the current illustrations as screenshots.

| Lab/task | Screenshot to capture | Verify/redact |
| --- | --- | --- |
| Lab 1 Mac | Official download, installer, sign-in landing and selected local project | Verify hardware requirements; redact account and home path |
| Lab 1 Windows | Download, installer completion, local project and terminal version checks | Verify native environment; redact account/path |
| Lab 2 | OCI Database connection page and successful saved reconnect | Redact database identifiers, wallet location and credentials |
| Lab 3 | MCP server entry, active tools and identity result | Use a disposable sanitized connection |
| Lab 4 | Metadata-only discovery and completed data map | Use approved metadata |
| Lab 5 | Reviewed plan and two report definitions | Use sanitized business terminology |
| Lab 6 | Reports, answer and real tool activity | Show only approved aggregate outputs |
| Lab 7 | Acceptance evidence and disconnect | No identifying information or secrets |

## Recorded QA evidence

The November 6, 2026 isolated Mac rehearsal used Codex 0.167.0, SQLcl 26.1.2, Java 17.0.12, Python 3.13.5, python-oracledb 26.1.0, OCI SDK 2.190.0 and Streamlit 1.67.0. Python used a virtual environment on an existing installation; Java and SQLcl were temporary copies. This was a functional rehearsal, not a fresh operating-system installation test.

Verified: saved SQLcl reconnect in a fresh process; actual MCP tool discovery and scoped metadata; Codex-generated project instructions, data map and plan; ten offline app tests; OCI text inference and a native tool-call/result round trip with Llama 4 Scout in Chicago; direct Python wallet connection; and two fixed aggregate reports matching independently written SQL and total counts; and a browser question answered through a real report tool call with matching evidence. Model availability is specific to that rehearsal and must be checked again for each environment.

The rehearsal ended by logging out the isolated Codex profile, terminating the temporary OCI session, stopping QA-owned processes and removing the temporary tools, wallet copy and generated app. Metadata checks (size, modification time and inode) for the normal Codex/OCI configuration, shell startup files and SQLcl store directory were unchanged. The original local wallet remains excluded from Git.

SQLcl releases advertise different tool names. The tested release used underscore names such as `sql_run`. Its schema-information response did not establish nullability or constraints reliably; confirm those facts with bounded, owner/object-filtered dictionary queries. Keep all private logs, credentials, generated application files and dependency locks outside the workshop.

## Publication gates

* Run the repository Markdown validator and check manifest targets, local links, prompt fences, copy tags and SVG dimensions. Confirm that no application source, executable tests or dependency manifests are included in the distributed workshop.
* Preview the tenancy launcher through HTTP with the Oracle CDN available; check image sizing, task navigation and copy buttons.
* Rehearse installation, CLI sign-in, SQLcl startup and saved-wallet reconnect on both operating systems. Record exact versions and installer requirements.
* Confirm the desktop MCP route separately if teaching it; otherwise teach the CLI baseline.
* Run against at least two different approved schemas, including one cross-schema view-only account. Confirm no hardcoded schema object names remain in reusable files.
* Confirm the direct Python connection and two report SQL reports before enabling API calls.
* Verify OCI IAM access, the selected SDK signer, model/region availability, a harmless OCI-only inference call, and a real native tool-call round trip. Test temporary-session expiry. Verify that runtime requests use the approved OCI endpoint.
* Run Lab 7 with a real approved model and database, checking answer accuracy, empty results, injection, errors and limits.
* Have learners record tested dependency versions locally. Do not add generated application code, executable tests or dependency locks to the distributed workshop without the applicable publication review.
* Capture and review the genuine screenshots above. Review acknowledgements, help routing and workshop title with the publishing owner.
* Review the remaining setup/configuration snippets and standard LiveLabs launcher under the current publication rules. A prompt-led format does not itself establish a policy exemption. Keep the confidential internal policy out of the public workshop.

## Acknowledgements

* Prepared for the analytics-ai workshop maintainers.
* Last updated: November 6, 2026.
