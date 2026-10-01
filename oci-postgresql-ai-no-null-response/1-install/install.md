# Install the components

## Introduction

In this lab, you will obtain the workshop code, provision private OCI PostgreSQL and Bastion, start an SSH tunnel, and run the search app on your laptop. PostgreSQL has no public IP. The database subnet has a route to OCI services only; OCI Bastion provides time-limited access to the private database.

Estimated time: 45–60 minutes, plus first-time laptop downloads.

### Before you start

- Sign in with the temporary OCI user and use the compartment assigned for this workshop. Keep the Console in the workshop region (normally `us-chicago-1`).
- Have a browser, Git, OpenSSH, and laptop internet access for the app's pinned dependencies. You will find your public IPv4 address online, choose the PostgreSQL admin username while creating the stack, and find an available chat model in your OCI tenancy.
- The current app runner supports Apple Silicon macOS 14+ and Linux. On Windows, Oracle Linux 9 under WSL 2 is recommended when available; Ubuntu is also an option for this public workshop. The WSL path has not yet had an end-to-end workshop test, and `run.sh` does not support native Windows.

### Check laptop commands

**macOS Terminal**

```bash
command -v git ssh ssh-keygen python3
```

If Git is missing, run `xcode-select --install` and complete the installer. macOS includes OpenSSH.

**Windows PowerShell**

```powershell
Get-Command git, ssh, ssh-keygen -ErrorAction SilentlyContinue
wsl --version
wsl --list --verbose
```

If Git is missing, install [Git for Windows](https://git-scm.com/install/windows) or run `winget install --id Git.Git -e --source winget`. If OpenSSH is missing, run `Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0` in Administrator PowerShell, then reopen it.

For the app, use a WSL 2 Linux distribution. [Oracle Linux 9 is available in the Microsoft Store](https://apps.microsoft.com/detail/9MXQ65HLMC27) and is recommended. If Ubuntu is already installed, it is acceptable for this public workshop. If WSL itself is missing, run `wsl --install --no-distribution` in Administrator PowerShell, then install and launch a distribution. A Windows restart may be required. In the Linux terminal, check `id -u` (the app must run as a non-root user) and `systemctl status` (the app bootstrap requires systemd). [Microsoft documents enabling systemd in WSL](https://learn.microsoft.com/en-us/windows/wsl/systemd).

Install the basic tools inside the selected Linux distribution:

```bash
# Oracle Linux 9
sudo dnf install -y git curl python3 openssh-clients iproute procps-ng util-linux
```

```bash
# Ubuntu, if that is the distribution already on your laptop
sudo apt update
sudo apt install -y git curl python3 openssh-client ca-certificates iproute2 util-linux
```

Use the Linux terminal for the clone, keys, tunnel, ZIP creation, and app commands below. If WSL setup or the app bootstrap stalls during this 90-minute lab, ask an instructor for help in the room. You can use another supported laptop if available.

## Task 1: Review the license and clone the code

Review the Oracle Technology Network License Agreement in Appendix 1 before cloning the workshop code. Select **Accept License Agreement** to reveal the command.

<div class="sample-code-license-gate" data-license-gate>
  <p>Review the Oracle Technology Network License Agreement in Appendix 1, then select <strong>Accept License Agreement</strong> to reveal the download command.</p>
  <button type="button" class="license-gate-review" data-license-gate-review>Review License Agreement</button>
  <p class="license-gate-status" data-license-gate-status aria-live="polite"></p>
</div>

<div class="sample-code-clone license-gate-is-hidden" data-license-gated-clone aria-hidden="true">
  <p>Source: <a href="https://github.com/kaushik-kundu/PostgreSQL-AI">PostgreSQL-AI on GitHub</a></p>
  <pre><code>git clone https://github.com/kaushik-kundu/PostgreSQL-AI.git</code></pre>
</div>

The cloned repository contains both `oci_postgres_tf_stack` and `search-app`. Run the revealed clone command in Terminal or, on Windows, in your WSL 2 Linux terminal. Keep this local copy for Lab 2's sample files. Before provisioning, check that `search-app/.env.example` contains `DB_HOSTADDR=127.0.0.1` and `oci_postgres_tf_stack/network.tf` contains an `oci_bastion_bastion` resource. If either is missing, the workshop revision has not been published yet; ask an instructor for the current code.

## Task 2: Prepare your SSH and OCI API keys

Use **two different keys**: a Bastion SSH key for the tunnel and an OCI API-signing key for Generative AI and optional Object Storage calls. Keep both private keys on your laptop.

**macOS/Linux Terminal** (Windows attendees: your WSL 2 Linux terminal)

```bash
mkdir -p ~/.ssh ~/.oci
ssh-keygen -t ed25519 -f ~/.ssh/oci_workshop_bastion
```

Only the `.pub` file is uploaded when you create a Bastion session. Do not upload or share the SSH private key.

In the OCI Console, open your **User Settings → Tokens & Keys → Add API Key**. Generate and download the API-signing private key. Save it in `~/.oci/`, restrict it with `chmod 600`, and create `~/.oci/config` from the Console's configuration snippet. Confirm that it contains `user`, `fingerprint`, `tenancy`, `region`, and `key_file`. On Windows, copy the downloaded PEM from Windows Downloads into WSL Linux and restrict it there:

```bash
cp /mnt/c/Users/<Windows-user>/Downloads/oci_api_key.pem ~/.oci/oci_api_key.pem
chmod 600 ~/.oci/oci_api_key.pem
```

Create the OCI config inside WSL Linux so the app can read it. For macOS or Linux, move the downloaded PEM into `~/.oci/` and run the same `chmod 600` command. The profile's `key_file` must be the exact path to the PEM; do not add an inline comment such as `# TODO` after the path. Set `OCI_CONFIG_PROFILE` in `.env` to the profile name between square brackets in the config file. See [OCI SDK configuration](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm).

## Task 3: Provision the private stack

First, make a clean ZIP from the Terraform source files. Run this in your local Terminal or WSL Linux terminal from the cloned repository:

```bash
cd ~/PostgreSQL-AI/oci_postgres_tf_stack
python3 -m zipfile -c ../postgres-workshop-stack.zip *.tf
python3 -m zipfile -l ../postgres-workshop-stack.zip
```

Upload **`PostgreSQL-AI/postgres-workshop-stack.zip`** in **Developer Services → Resource Manager → Stacks → Create stack → My configuration → .Zip file**. The ZIP contains only Terraform `.tf` files at its root. Do not select the `oci_postgres_tf_stack` folder directly: if it contains a local `.terraform` directory from Terraform CLI, Resource Manager rejects it with “An invalid .terraform directory was found.” The clean ZIP avoids that error without changing your local Terraform installation. On Windows, use `\\wsl$\<distribution-name>\home\<linux-user>\PostgreSQL-AI\postgres-workshop-stack.zip` in File Explorer; get the exact distribution name with `wsl --list --verbose`.

Select your assigned compartment and set the stack variables:

- `region`: use the Console region shown for this workshop, normally `us-chicago-1`.
- `compartment_ocid`: copy the OCID from **Identity & Security → Compartments → your assigned compartment**.
- `psql_admin`: **choose** the administrator username now (for example, `workshop_admin`) and record it. This DB System does not exist yet, so there is no username to look up until after provisioning. You can confirm it later on the DB System details page.
- `bastion_client_cidrs`: on the same laptop and network you will use for the SSH tunnel, open [api.ipify.org](https://api.ipify.org) in a browser and note the public **IPv4** address. Add `/32`, for example `203.0.113.10/32`. In the Resource Manager Console's list item field, enter **only** `203.0.113.10/32` with your real address: no square brackets, quotation marks, spaces, or angle brackets. Do not copy the example address. You can also run `curl -4 https://api.ipify.org` in Terminal or WSL. Do not use the private IP shown by `ipconfig` or `ip addr`. If your network changes, this value must be updated on the Bastion.

If a corporate proxy hides or changes your SSH source IP, the workshop stack also permits `0.0.0.0/0` as a temporary Bastion allowlist fallback. This allows connection attempts from any public IPv4 address; SSH still requires your Bastion session and private key. [Oracle recommends a limited CIDR range](https://docs.oracle.com/en-us/iaas/Content/Security/Reference/bastion_security.htm), so use your `/32` when it works and destroy the stack at the end of the workshop. An open allowlist does **not** bypass a network that blocks outbound SSH on TCP `22`.

The stack creates PostgreSQL, its private VCN, an Object Storage bucket, and OCI Bastion. It does not create an app VM.

Run **Plan**, review it, then run **Apply**. Save the outputs `bastion_id`, `postgres_private_ip`, `uploads_bucket_name`, and sensitive `psql_admin_pwd` securely. Do not paste the password into chat or screenshots. On the PostgreSQL DB System's **Connection details** page, record the endpoint FQDN and download its CA certificate (`dbsystem.pub`) to your laptop. Save the certificate as `~/.oci/dbsystem.pub`; on macOS/Linux, if your browser saved it in Downloads, run `cp ~/Downloads/dbsystem.pub ~/.oci/dbsystem.pub`. Windows attendees should copy it from Windows Downloads into WSL Linux, for example `cp /mnt/c/Users/<Windows-user>/Downloads/dbsystem.pub ~/.oci/dbsystem.pub`. Then run `chmod 600 ~/.oci/dbsystem.pub` in Terminal or WSL Linux.

## Task 4: Open the Bastion tunnel

In **Identity & Security → Bastion**, open `postgres-workshop-bastion` in the workshop compartment. Create an **SSH port forwarding** session with:

- Target private IP: the `postgres_private_ip` stack output
- Target port: `5432`
- SSH public key: `~/.ssh/oci_workshop_bastion.pub`

Creating the OCI session authorizes port forwarding, but does **not** start the tunnel on your laptop. On the session's Actions menu, select **Copy SSH command**. In a separate Terminal or WSL Linux window, replace `<privateKey>` with `~/.ssh/oci_workshop_bastion` and `<localPort>` with `15432`. The command should forward local port `15432` to the PostgreSQL private IP on port `5432`. Add `-N` to keep the terminal dedicated to forwarding, and run it. Keep this terminal open while using the app. Oracle's [Bastion instructions](https://docs.oracle.com/en-us/iaas/Content/Bastion/Tasks/connect-port-forwarding.htm) show the command format.

Before starting the app, check that the local tunnel is listening. On macOS, run `lsof -nP -iTCP:15432 -sTCP:LISTEN`; on Linux or WSL, run `ss -lnt | grep ':15432'`. You should see an SSH listener on local port `15432`. If no listener appears, return to the SSH command and its terminal window.

A session expires after at most three hours. If it expires, create a new session and restart the SSH command. If you move networks and your public source IP changes, ask an instructor to update the Bastion allowlist.

## Task 5: Configure and start the search app

In a second Terminal (or WSL Linux) window, create the app settings file:

```bash
cd ~/PostgreSQL-AI/search-app
test -f .env || cp .env.example .env
chmod 600 .env
```

If you already have a `.env`, this command preserves it. Compare its tunnel, TLS, and OCI settings with `.env.example` before starting the app.

Find the chat model identifier in the same OCI region before editing `.env`: open **Analytics & AI → AI Services → Generative AI → Playground → Chat**, select an on-demand chat model available to your account, and open its model details. Copy the displayed model OCID or OCI model name into `OCI_GENAI_MODEL_ID`. If you use an OCID, check that it begins with `ocid1.`; a missing first character prevented a workshop test from getting an answer. Current OCI pretrained models may use a model name instead of an OCID. Keep the region in the Console, endpoint, and `.env` consistent. [Oracle's model instructions](https://docs.oracle.com/en-us/iaas/Content/generative-ai/create-endpoint.htm) explain both identifier forms.

The workshop template already sets the local web server, tunnel port and address, TLS verification, CA certificate path, OCI config path, Chicago endpoint, and local upload storage. Replace only these values in `.env` with values from your stack and OCI tenancy:

```ini
DB_HOST=<PostgreSQL endpoint FQDN>
DB_USER=<the psql_admin username you chose>
DB_PASSWORD='<PostgreSQL admin password>'
BASIC_AUTH_PASSWORD='<separate local app password>'
OCI_COMPARTMENT_OCID=<assigned compartment OCID>
OCI_GENAI_MODEL_ID=<chat model ID from OCI Generative AI>
```

Replace the existing `REPLACE_WITH_...` values; do not append duplicate keys. If your assigned region is not Chicago, also change `OCI_REGION` and `OCI_GENAI_ENDPOINT` to that region. Keep `DATABASE_URL` unset because it overrides the individual DB values. Keep single quotes around the generated database password: the app runner reads `.env` as a shell file, and the generated password may contain shell characters. The generated character set excludes apostrophes. Use a single-quote-safe value for the local app password as well. Before running the app, confirm that `~/.oci/dbsystem.pub` and `~/.oci/config` both exist, and that `OCI_CONFIG_PROFILE` names a profile whose `key_file` exists in your Linux or macOS filesystem.

`HOST` is the address where the local web app listens, so `127.0.0.1` keeps it on your laptop. `DB_HOST` must be the PostgreSQL endpoint FQDN from OCI; it is checked against the database certificate. `DB_HOSTADDR=127.0.0.1` sends the actual database connection through the Bastion tunnel. `DB_SSLROOTCERT` points to the downloaded CA certificate, and `DB_SSLMODE=verify-full` enables certificate and hostname verification. This is the [connection pattern documented by Oracle](https://docs.oracle.com/en-us/iaas/Content/postgresql/connect-to-db.htm).

Run the app from `search-app`:

```bash
./run.sh
```

The first run downloads pinned dependencies and model weights using **your laptop's internet connection**; the image model alone can be a large download. The current bootstrap may also install Ollama on your laptop, but `LLM_PROVIDER=oci` sends RAG answer generation to OCI Generative AI. These downloads happen on the laptop, not from the OCI private subnet. Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser. `STORAGE_BACKEND=local` keeps uploaded files on your laptop; extracted text and vectors go into private PostgreSQL. Proceed to Lab 2 after the app opens and the tunnel remains connected.

## If something does not connect

- SSH tunnel: check that the session is active, the right `.pub` key was uploaded, your current public IP is allowlisted, and the venue network permits outbound TCP `22`.
- PostgreSQL: check the target private IP, port `5432`, and that the tunnel window is still open. A TLS error usually means the FQDN or downloaded CA certificate is wrong.
- OCI AI: check your local `~/.oci/config`, the region, model identifier, and your temporary-user permissions.

## Cleanup

Stop the local app and SSH tunnel. Destroy your Resource Manager stack when the workshop is over. Remove the temporary OCI API key from your user settings and laptop according to instructor guidance.
