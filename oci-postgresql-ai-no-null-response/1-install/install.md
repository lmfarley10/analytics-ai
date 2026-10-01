# Install the components

## Introduction

In this lab, you will obtain the workshop code, provision private OCI PostgreSQL and Bastion, start an SSH tunnel, and run the search app on your laptop. Your OCI workshop resources have no public IPs. The database subnet has a route to OCI services only.

Estimated time: 45–60 minutes, plus first-time laptop downloads.

### Before you start

- Sign in with the temporary OCI user and use the compartment assigned for this workshop. Keep the Console in the workshop region (normally `us-chicago-1`).
- Have a browser, Git, OpenSSH, and laptop internet access for the app's pinned dependencies. Ask an instructor for the approved Bastion source-IP CIDR, PostgreSQL admin name, and OCI Generative AI model OCID.
- The current app runner supports Apple Silicon macOS 14+ and Linux. The Windows path uses WSL 2 and needs an event-laptop validation before it can be considered supported. Native Windows is not supported by `run.sh`.

### Check laptop commands

**macOS Terminal**

```bash
command -v git ssh ssh-keygen
```

If Git is missing, run `xcode-select --install` and complete the installer. macOS includes OpenSSH.

**Windows PowerShell**

```powershell
Get-Command git, ssh, ssh-keygen -ErrorAction SilentlyContinue
wsl --version
```

If Git is missing, install [Git for Windows](https://git-scm.com/install/windows) or run `winget install --id Git.Git -e --source winget`. If OpenSSH is missing, run the following in Administrator PowerShell, then reopen PowerShell:

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

For the local app, install WSL 2 with Ubuntu in Administrator PowerShell if it is not already available:

```powershell
wsl --install -d Ubuntu
```

Restart Windows if prompted, open Ubuntu, and install its basic command-line tools:

```bash
sudo apt update
sudo apt install -y git curl ca-certificates iproute2 util-linux
systemctl status
```

The app's Linux bootstrap requires systemd. Follow the **macOS/Linux Terminal** commands below *inside Ubuntu* for the clone, keys, tunnel, and app. [Microsoft's WSL systemd guide](https://learn.microsoft.com/en-us/windows/wsl/systemd) explains how to enable it if your Ubuntu installation does not start it automatically. Before the event, confirm this full WSL path with an instructor; it has not yet had an end-to-end workshop test.

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

The cloned repository contains both `oci_postgres_tf_stack` and `search-app`. Run the revealed clone command in Terminal or, on Windows, in Ubuntu under WSL 2. Keep this local copy for Lab 2's sample files. If `search-app/.env.example` does not mention `DB_HOSTADDR`, the workshop revision has not been published yet; ask an instructor before provisioning.

## Task 2: Prepare your SSH and OCI API keys

Use **two different keys**: a Bastion SSH key for the tunnel and an OCI API-signing key for Generative AI and optional Object Storage calls. Keep both private keys on your laptop.

**macOS/Linux Terminal** (Windows attendees: Ubuntu under WSL 2)

```bash
mkdir -p ~/.ssh ~/.oci
ssh-keygen -t ed25519 -f ~/.ssh/oci_workshop_bastion
```

Only the `.pub` file is uploaded when you create a Bastion session. Do not upload or share the SSH private key.

In the OCI Console, open your **User Settings → Tokens & Keys → Add API Key**. Generate and download the API-signing private key. Save it in `~/.oci/`, restrict it with `chmod 600`, and create `~/.oci/config` from the Console's configuration snippet. Confirm that it contains `user`, `fingerprint`, `tenancy`, `region`, and `key_file`. On Windows, copy the downloaded PEM from Windows Downloads into Ubuntu and restrict it there:

```bash
cp /mnt/c/Users/<Windows-user>/Downloads/oci_api_key.pem ~/.oci/oci_api_key.pem
chmod 600 ~/.oci/oci_api_key.pem
```

Create the OCI config inside Ubuntu so the app can read it. For macOS or Linux, move the downloaded PEM into `~/.oci/` and run the same `chmod 600` command. See [OCI SDK configuration](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm).

## Task 3: Provision the private stack

In the OCI Console, open **Developer Services → Resource Manager → Stacks → Create stack**. Choose **My configuration**, then select the `oci_postgres_tf_stack` folder from your local clone. OCI Resource Manager accepts a local Terraform folder or ZIP as the configuration source. Select your assigned compartment. On Windows, the File Explorer path to a WSL clone is `\\wsl$\Ubuntu\home\<linux-user>\PostgreSQL-AI\oci_postgres_tf_stack`.

Set `region`, `compartment_ocid`, `psql_admin`, and `bastion_client_cidrs` to the workshop values. Use the approved venue CIDR from your instructor; do not enter `0.0.0.0/0`. The stack creates PostgreSQL, its private VCN, an Object Storage bucket, and OCI Bastion. It does not create an app VM.

Run **Plan**, review it, then run **Apply**. Save the outputs `bastion_id`, `postgres_private_ip`, `uploads_bucket_name`, and sensitive `psql_admin_pwd` securely. Do not paste the password into chat or screenshots. On the PostgreSQL DB System's **Connection details** page, record the endpoint FQDN and download its CA certificate (`dbsystem.pub`) to your laptop. Windows attendees should copy it from Windows Downloads into Ubuntu, for example `cp /mnt/c/Users/<Windows-user>/Downloads/dbsystem.pub ~/.oci/dbsystem.pub`, then use `/home/<linux-user>/.oci/dbsystem.pub` for `DB_SSLROOTCERT`.

## Task 4: Open the Bastion tunnel

In **Identity & Security → Bastion**, open `postgres-workshop-bastion` in the workshop compartment. Create an **SSH port forwarding** session with:

- Target private IP: the `postgres_private_ip` stack output
- Target port: `5432`
- SSH public key: `~/.ssh/oci_workshop_bastion.pub`

Copy the session's SSH command. Replace `<privateKey>` with `~/.ssh/oci_workshop_bastion` and `<localPort>` with `15432`. Add `-N` to keep the terminal dedicated to forwarding, and run it. On Windows, create and run the command inside Ubuntu under WSL 2, where the app will run. Keep this terminal open. Oracle's [Bastion instructions](https://docs.oracle.com/en-us/iaas/Content/Bastion/Tasks/connect-port-forwarding.htm) show the command format.

A session expires after at most three hours. If it expires, create a new session and restart the SSH command. If you move networks and your public source IP changes, ask an instructor to update the Bastion allowlist.

## Task 5: Configure and start the search app

In a second Terminal (or Ubuntu) window, create the app settings file:

```bash
cd ~/PostgreSQL-AI/search-app
cp .env.example .env
chmod 600 .env
```

Edit `.env` with your workshop values:

```ini
HOST=127.0.0.1
DB_HOST=<PostgreSQL endpoint FQDN>
DB_HOSTADDR=127.0.0.1
DB_PORT=15432
DB_NAME=postgres
DB_USER=<PostgreSQL admin user>
DB_PASSWORD='<PostgreSQL admin password>'
DB_SSLMODE=verify-full
DB_SSLROOTCERT=<absolute path to dbsystem.pub>
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD='<separate local app password>'
SECRET_KEY='<unique random local secret>'
LLM_PROVIDER=oci
OCI_REGION=us-chicago-1
OCI_COMPARTMENT_OCID=<assigned compartment OCID>
OCI_GENAI_ENDPOINT=https://inference.generativeai.us-chicago-1.oci.oraclecloud.com
OCI_GENAI_MODEL_ID=<instructor-provided model OCID>
OCI_CONFIG_FILE=<absolute path to ~/.oci/config>
OCI_CONFIG_PROFILE=DEFAULT
STORAGE_BACKEND=local
```

Use the selected region consistently. Keep `DATABASE_URL` unset because it overrides the individual DB values. Keep single quotes around the generated database password: the app runner reads `.env` as a shell file, and the generated password may contain shell characters. The generated character set excludes apostrophes. Use single-quote-safe values for the two local secrets as well.

The endpoint FQDN in `DB_HOST` is checked against the server certificate. `DB_HOSTADDR=127.0.0.1` sends the actual connection through the Bastion tunnel, and `DB_SSLMODE=verify-full` plus `DB_SSLROOTCERT` verifies TLS. This is the [connection pattern documented by Oracle](https://docs.oracle.com/en-us/iaas/Content/postgresql/connect-to-db.htm).

Run the app from `search-app`:

```bash
./run.sh
```

The first run downloads pinned dependencies using **your laptop's internet connection**. Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser. `STORAGE_BACKEND=local` keeps uploaded files on your laptop; extracted text and vectors go into private PostgreSQL. Proceed to Lab 2 after the app opens and the tunnel remains connected.

## If something does not connect

- SSH tunnel: check that the session is active, the right `.pub` key was uploaded, your current public IP is allowlisted, and the venue network permits outbound TCP `22`.
- PostgreSQL: check the target private IP, port `5432`, and that the tunnel window is still open. A TLS error usually means the FQDN or downloaded CA certificate is wrong.
- OCI AI: check your local `~/.oci/config`, the region, model OCID, and your temporary-user permissions.

## Cleanup

Stop the local app and SSH tunnel. Destroy your Resource Manager stack when the workshop is over. Remove the temporary OCI API key from your user settings and laptop according to instructor guidance.
