# Provision private PostgreSQL and run the search app locally

## Introduction

This workshop uses OCI Resource Manager to create a **private** OCI Database with PostgreSQL system, an Object Storage bucket, and an OCI Bastion. The Python app runs on your laptop. Its PostgreSQL connection travels through a local SSH port forward. The VCN has an OCI Service Gateway route only: no NAT Gateway, Internet Gateway, app VM, or public IP on workshop resources.

Estimated time: 45–60 minutes, plus first-time laptop downloads.

## Before the workshop: operator checklist

1. Publish the tested `livelabs-local-app-bastion` Terraform stack and app changes together. Make the stack ZIP available to Resource Manager; do not use the older public-VM stack.
2. In the dedicated tenancy, give the temporary workshop group permission to launch and destroy the stack in its assigned compartment. An administrator must review the Resource Manager, PostgreSQL, Networking, Object Storage, and optional PostgreSQL configuration permissions for the actual compartment. The attendee group also needs these Bastion session policies (replace names and scope):

   ```text
   Allow group <attendee-group> to use bastion in compartment <workshop-compartment>
   Allow group <attendee-group> to manage bastion-session in compartment <workshop-compartment>
   Allow group <attendee-group> to read vcn in compartment <workshop-compartment>
   Allow group <attendee-group> to read subnets in compartment <workshop-compartment>
   Allow group <attendee-group> to read postgres-db-systems in compartment <workshop-compartment>
   ```

   Restrict `manage bastion-session` to this Bastion, port `5432`, and the DB private IP with [Bastion IAM conditions](https://docs.oracle.com/en-us/iaas/Content/Bastion/Reference/bastionpolicyreference.htm) after the stack has a stable Bastion OCID and DB IP. A separate policy must grant the user's API key access to OCI Generative AI inference in the chosen compartment. If `STORAGE_BACKEND=oci`, grant the user Object Storage object permissions for the upload bucket as well. Test every policy as a temporary attendee user.
3. Confirm the **public source IP CIDRs** that attendee laptops will use on Venetian Wi-Fi. Set `bastion_client_cidrs` to those restricted CIDRs. Never use `0.0.0.0/0`. Confirm outbound TCP `22` from event Wi-Fi to `host.bastion.<region>.oci.oraclecloud.com`. Laptop internet for downloads and OCI APIs is separate from OCI VCN egress.
4. Confirm the selected region, chat model OCID, capacity, and each temporary user's access to its inference endpoint. This workshop uses `us-chicago-1` unless the operator changes all region values together.
5. Validate that the final Terraform plan has no `oci_core_instance`, public subnet, Internet Gateway, NAT Gateway, public IP, or `0.0.0.0/0` route. The workshop stack creates its own private subnet so Terraform enforces this route policy.
6. Test the full workflow, including uploads and RAG, using a temporary user before the event. The app's pinned full build supports Apple Silicon macOS 14+ and its supported Linux bootstrap. Native Windows and Intel Mac builds are **not yet validated**; arrange supported laptops or finish and test those paths before the event.

## Task 1: Prepare your laptop

You need a supported laptop, a browser, Git, OpenSSH (`ssh` and `ssh-keygen`), and internet access for the app's pinned dependencies and model files. Allow sufficient disk space and download time. On macOS, install Apple Command Line Tools if Git is missing. Keep the terminal that runs the tunnel open throughout the lab.

Create a dedicated Bastion SSH key on your laptop:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/oci_workshop_bastion
```

Keep the private key on the laptop. You will upload only `~/.ssh/oci_workshop_bastion.pub` when creating a Bastion session.

Create an OCI API-signing key for your temporary user in the OCI Console, download its private PEM to your laptop, and set up `~/.oci/config` with `user`, `fingerprint`, `tenancy`, `region`, and `key_file`. Restrict the key file to your user (`chmod 600`). This key stays on the laptop. It authenticates OCI Generative AI and, if enabled, Object Storage. See [OCI SDK configuration](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm).

## Task 2: Launch the private stack

In Resource Manager, create a stack from the **operator-provided, tested ZIP** and select the assigned compartment. Set:

- `region`: `us-chicago-1` (or the operator's chosen region)
- `compartment_ocid`: your assigned compartment
- `psql_admin`: the assigned PostgreSQL admin name
- `bastion_client_cidrs`: the operator-provided venue source CIDRs
- The network and PostgreSQL system are created together; `create_compute` is **not present**

Create a plan, inspect it for the resources listed in the operator checklist, then apply. Record the `bastion_id`, `postgres_private_ip`, `uploads_bucket_name`, and the sensitive `psql_admin_pwd` output securely. The password output is stored in Terraform state; do not paste it into workshop chat or screenshots. From the DB System's **Connection details**, record its endpoint FQDN and download its CA certificate (`dbsystem.pub`) to your laptop. The FQDN is needed for TLS hostname verification even though the tunnel connects to `127.0.0.1`.

## Task 3: Create and start the Bastion tunnel

Open **Identity & Security → Bastion** in the same compartment. Open `postgres-workshop-bastion`, create an **SSH port forwarding** session, and enter:

- Target: the PostgreSQL **private IP** from the stack output
- Target port: `5432`
- SSH public key: `~/.ssh/oci_workshop_bastion.pub`
- Session lifetime: at most the Bastion's three-hour limit

Copy the session's SSH command. Replace `<privateKey>` with `~/.ssh/oci_workshop_bastion` and `<localPort>` with `15432`. Add `-N` so the terminal stays dedicated to forwarding. Run it on your laptop and leave it open. Use `-v` if troubleshooting. Oracle's [Bastion connection instructions](https://docs.oracle.com/en-us/iaas/Content/Bastion/Tasks/connect-port-forwarding.htm) show the command format.

If your venue source IP changes or the session expires, have the operator update the allowlist if needed, create a **new** port forwarding session, and restart the SSH command. Restart the app if its connection pool does not recover. Each session targets one private IP.

## Task 4: Install and configure the local app

Clone the **operator-published app revision** (the public repository's older revision may lack the tunnel settings), accept its license terms, and enter `PostgreSQL-AI/search-app`. Copy `.env.example` to `.env`. Set these values:

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
OCI_GENAI_MODEL_ID=<operator-provided model OCID>
OCI_CONFIG_FILE=<absolute path to ~/.oci/config>
OCI_CONFIG_PROFILE=DEFAULT
STORAGE_BACKEND=local
```

The generated Terraform password contains shell metacharacters, so keep its single quotes in `.env` (the generated character set excludes apostrophes). The app runner sources this file as shell input. Use a single-quote-safe value for the two local secrets too.

Use the selected region consistently. Keep `DATABASE_URL` unset: it overrides the individual DB values. The `DB_HOST` FQDN plus `DB_HOSTADDR=127.0.0.1` lets psycopg/libpq connect through the tunnel and verify the PostgreSQL certificate against the actual endpoint name. `STORAGE_BACKEND=local` keeps uploaded files on this laptop while the extracted text and vectors are stored in private PostgreSQL. To test Object Storage uploads, set `STORAGE_BACKEND=oci` and `OCI_OS_BUCKET_NAME=<uploads_bucket_name>` after the operator grants object permissions.

From `search-app`, run `./run.sh` on a supported macOS or Linux laptop. This bootstraps the app's pinned local runtime and dependencies using **laptop internet**, then starts the app. Open `http://127.0.0.1:8000/`. Do not bind the app to `0.0.0.0` on an attendee laptop.

For a quick database check, with a compatible `psql` client installed locally:

```bash
psql "host=<PostgreSQL endpoint FQDN> hostaddr=127.0.0.1 port=15432 sslmode=verify-full sslrootcert=<absolute path to dbsystem.pub> dbname=postgres user=<PostgreSQL admin user>" -c 'select 1'
```

Oracle documents [PostgreSQL over Bastion with `host` and `hostaddr`](https://docs.oracle.com/en-us/iaas/Content/postgresql/connect-to-db.htm). Proceed to Lab 2 only when both the database check and app startup succeed.

## Troubleshooting

- SSH cannot connect: check venue outbound TCP `22`, your current public IP against the Bastion allowlist, session state, key pair, and region.
- PostgreSQL times out: check the session target private IP and port `5432`, the private subnet ingress rule, and that the tunnel still runs.
- TLS verification fails: download the CA certificate from this DB System and use its exact endpoint FQDN in `DB_HOST`.
- OCI inference or bucket calls return `NotAuthorizedOrNotFound`: check the laptop's OCI config, key, region, model or bucket, and temporary-user IAM policy.

## Cleanup

Stop the app and SSH tunnel. Destroy the Resource Manager stack when the workshop is over; empty the upload bucket first if you used Object Storage. Remove the temporary user's API key from OCI and your laptop after the event according to operator policy.
