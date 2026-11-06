# Vibe code your own AI Agent Application on Autonomous AI Database

Estimated Time: 3 hours 15 minutes, plus prerequisite installation and customer access provisioning.

### Objectives

Deliver a reusable bring-your-own-data LiveLab: install ChatGPT/Codex on Windows or Mac, connect Codex to Oracle SQLcl MCP, discover an approved schema, agree an application plan, and build a Python application with a bounded report agent.

## Preview

From the repository root, run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the workshop launcher](http://127.0.0.1:8000/vibe-code-ai-agent/workshops/tenancy/index.html). The launcher uses Oracle's standard LiveLabs renderer and template, loading assets from the Oracle LiveLabs `common` GitHub Pages site because the legacy CDN `main.min.js` URL returned 404. Its deferred Markdown, highlighting and FreeSQL loader URLs use that same vendor-hosted source. No library code is bundled. Internet access is required. This workshop assumes an existing customer database; no sandbox provisioning is promised.

## GitHub Pages preview on the author fork

The repository is too large to publish in full to GitHub Pages. The fork-specific workflow `.github/workflows/vibe-code-pages.yml` stages only this workshop under `_site/vibe-code-ai-agent`, preserving the existing workshop URL and relative links. It runs only on `lmfarley10/analytics-ai`, branch `adb-vibe-code`; it does not publish the upstream repository or other workshops.

To enable it, open the fork's **Settings → Pages → Build and deployment**, change **Source** to **GitHub Actions**, and save if prompted. Commit and push the workflow and workshop changes to `adb-vibe-code`. Watch **Actions → Publish Vibe Code LiveLab preview**. If environment protection blocks deployment, review the `github-pages` environment's allowed deployment branches and allow `adb-vibe-code` for this preview. Once the workflow exists on the default branch, it can also be run manually with that feature branch selected.

After a successful deployment, open [the hosted workshop](https://lmfarley10.github.io/analytics-ai/vibe-code-ai-agent/workshops/tenancy/index.html). This workflow publishes a workshop-only site, replacing the fork's prior Pages content. Other workshop URLs will not be served by this preview. Use a separate hosting destination if the fork needs to retain a broader published site.

## Contents

| Section | Outcome | Minutes |
| --- | --- | --- |
| [Introduction](introduction/introduction.md) | Understand scope, prerequisites and data flow | 10 |
| [Lab 1](client-setup/client-setup.md) | Install desktop client and Codex CLI on Mac or Windows | 25 |
| [Lab 2](database-access/database-access.md) | Prepare a restricted database account and wallet | 25 |
| [Lab 3](connect-mcp/connect-mcp.md) | Register and verify SQLcl MCP in Codex | 20 |
| [Lab 4](discover-data/discover-data.md) | Discover tables and approve a reusable data contract | 25 |
| [Lab 5](plan-app/plan-app.md) | Approve a customer-specific Python app plan | 15 |
| [Lab 6](build-app/build-app.md) | Generate and run the tailored application with OCI Generative AI | 50 |
| [Lab 7](validate-cleanup/validate-cleanup.md) | Validate results, troubleshoot and disconnect | 25 |

## Customer adaptation

Keep the workshop prompts, diagrams and planning templates. Each learner generates their application, report catalog, dependency list and tests locally from their approved data map. Use an isolated working directory and approved database account per customer. Keep customer metadata and generated artifacts out of this public workshop.

No application source, executable tests, dependency manifest or sample query catalog is distributed. Lab 6 supplies staged natural-language prompts with review checkpoints. There is no dependency on a particular customer schema. SQLcl provides the existing MCP server; a custom server is unnecessary. A metadata-export fallback supports initial discovery when a live MCP connection is unavailable.

The runtime design uses OCI Generative AI through the OCI Python SDK, OCI IAM authentication and approved report tools. Learners generate and verify that implementation; no OpenAI API key is required. Codex uses MCP during development, while the generated app connects independently to Autonomous AI Database and OCI Generative AI. Approved report results go to the selected OCI model/processing region. Codex still handles development prompts, metadata and any approved validation results through its own service; choosing OCI for the app does not move Codex itself into OCI. Confirm both data-sharing scopes with the customer.

## Checks and publication status

```bash
bash .github/scripts/validate-livelabs-markdown.sh vibe-code-ai-agent
```

Maintainers should also check manifest targets, local links, image dimensions and balanced prompt fences/copy tags. Learners generate and run application tests in their private workspace; there is no supplied executable test suite.

The diagrams are original, labeled illustrations, including both installation flows; they are not product screenshots. See [the publication checklist](references/references.md) for genuine screenshot capture points and platform/database acceptance tests. Desktop capture was unavailable during authoring. Live Mac/Windows setup, CDN rendering, SQLcl wallet persistence, and a real customer database/API run remain publication gates. No live credentials were used to author this workshop.

Have learners review dependencies before installation and record exact tested versions in their private workspace. Facilitator rehearsal should verify that the prompts produce a working app on both supported platforms. This prompt-led design does not establish an exemption from publication policy: the publishing owner must still review the retained setup commands, SQLcl/configuration examples, standard renderer and third-party tooling references. Do not distribute generated customer code or a dependency lock as part of the lab without the applicable review.

## Acknowledgements

* Prepared for the analytics-ai workshop maintainers.
* Last updated: November 6, 2026.
