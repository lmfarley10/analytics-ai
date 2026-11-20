# Connect Codex to the Oracle SQLcl MCP server

## Introduction

Codex launches SQLcl as a local stdio MCP subprocess. It uses the saved connection created in Lab 2. You do not need a public endpoint, an HTTP proxy, or a custom server.

Estimated Time: 20 minutes.

### Objectives

* Add a SQLcl MCP entry to Codex.
* Verify tools and the intended database identity.
* Keep database permissions as the enforcement boundary.

### Prerequisites

A fresh-process saved connection test has passed. Codex and SQLcl run under the same OS user and environment.

If client database access is not ready, use Lab 4's metadata-export route for initial discovery and planning. Skip this lab's connection tasks until access is available. The export route does not provide live query validation or remove the finished app's need for database access.

## Task 1: Register the local MCP server

1. In the desktop client, open **Settings → MCP servers → Add server**. Add a local **STDIO** server using the following values. Menu labels may vary by release; see the [official MCP setup guide](https://learn.chatgpt.com/docs/extend/mcp).

    | Field | Value |
    | --- | --- |
    | Name | `lab_db` |
    | Transport | STDIO |
    | Command on macOS | `/Users/YOUR_USER/tools/sqlcl/bin/sql` |
    | Command on Windows | `C:\Tools\sqlcl\bin\sql.exe` |
    | Arguments | `-mcp` |

    Use your actual absolute SQLcl executable path. Enter the command and argument separately; do not include shell quotes in the command field. Save the entry. SQLcl runs locally, so no server URL or API key is needed for this connection. Keep the same OS user and saved-connection store used in Lab 2.

2. Open your user Codex configuration in a text editor: `~/.codex/config.toml` on Mac or `%USERPROFILE%\.codex\config.toml` on Windows. Locate the `[mcp_servers.lab_db]` entry created by the desktop settings. If your release offers an **Open config.toml** control, you can use it. Back up existing configuration and merge only this entry; do not overwrite unrelated settings. Add the following options to its existing table:

    ```toml
    <copy>
    enabled_tools = ["connections_list", "connect", "disconnect", "sql_run", "schema_information"]
    startup_timeout_sec = 60
    tool_timeout_sec = 60
    </copy>
    ```

    An illustrative complete Mac entry is:

    ```toml
    [mcp_servers.lab_db]
    command = "/Users/YOUR_USER/tools/sqlcl/bin/sql"
    args = ["-mcp"]
    enabled_tools = ["connections_list", "connect", "disconnect", "sql_run", "schema_information"]
    startup_timeout_sec = 60
    tool_timeout_sec = 60
    ```

    For Windows, a TOML literal string avoids backslash escaping: `command = 'C:\Tools\sqlcl\bin\sql.exe'`. Confirm the actual advertised tool names for your SQLcl release. Excluding `sqlcl_run` reduces exposed capabilities, but `sql_run` can still execute writes or PL/SQL if the database permits them. The allowlist is not a read-only security control.

3. Save the configuration, return to **Settings → MCP servers**, and select **Restart** to apply the changes. Reopen the local `vibe-agent-lab` project chat. Enter `/mcp` in the desktop chat composer and confirm that `lab_db` is connected and the intended tools are listed. A configured entry alone is not proof of a successful server handshake.

    ![MCP registration, server handshake and database identity checkpoint](images/mcp-checkpoint.svg)

    > *Screenshot placeholder — Open the Codex MCP server list and show lab_db connected with its available tools.*

## Task 2: Verify the database identity

1. Send this prompt and approve only the intended tool operations:

    ```text
    <copy>
    Use only the lab_db MCP server. Connect only to the saved connection
    lab_reader. Verify SELECT USER and the current service name from DUAL.
    Show the connected account and service, then stop. Do not inspect other
    connections, read local secrets, or execute DDL, DML, PL/SQL or SQLcl commands.
    </copy>
    ```

2. Compare the identity with Lab 2. If it differs, disconnect and correct the saved connection. SQLcl's connection listing can expose the names of other saved connections. For this workshop, use a dedicated OS profile or SQLcl connection store containing only the approved lab connection, following your SQLcl release's supported configuration. The MCP alias is not a saved-connection allowlist.

    > *Screenshot placeholder — Show the approved account/service identity returned by the MCP check, with identifying values redacted.*

## Task 3: Confirm the project checkpoint

1. Stay in the same local `vibe-agent-lab` desktop project for the remaining prompts. Confirm that the MCP tools and the verified `lab_reader` identity are available in this chat before continuing to discovery.

2. The desktop client, CLI and IDE extension share MCP configuration when they use the same Codex host and configuration directory. You do not need to install the standalone CLI or register the same server a second time. Always verify the connection in the desktop chat used for this workshop. Never paste this local STDIO configuration into a hosted chat's remote MCP URL field.

## Learn More

* [Codex MCP registration and configuration](https://learn.chatgpt.com/docs/extend/mcp)
* [Oracle SQLcl MCP launch configuration](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/25.4/sqcug/starting-and-managing-sqlcl-mcp-server.html)
* [Oracle SQLcl MCP tool descriptions](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/25.4/sqcug/sqlcl-mcp-server-tools.html)

## Acknowledgements

* Prepared for the analytics-ai workshop maintainers.
* Last updated: November 6, 2026.
