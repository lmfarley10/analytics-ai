# Troubleshooting

## Start Here

Run these checks before changing code:

```bash
node -v
npm -v
git --version
```

Confirm:

- Node.js is 20.19 or newer.
- `.env` exists in the reference implementation root.
- The app is started from `todo-app`.
- The AJD ACL includes your current public IP.
- The MongoDB API URL has no unencoded special characters in the password.

## Common Issues

| Symptom | Fast Fix |
|---|---|
| App cannot connect to MongoDB API | Update the AJD ACL with your current public IP. |
| `MONGO_API_URL is not set` | Put `.env` one level above `todo-app`, not inside `todo-app`. |
| Port 3000 is busy | Set `PORT=3001` in `.env`, then restart the app. |
| `node` or `npm` is missing | Install Node.js 20.19 or newer and open a new terminal. |
| Windows terminal changes `$external` | Use Git Bash in VS Code instead of PowerShell. |
| Password breaks the URL | URI-encode reserved characters, especially `@`, `#`, `%`, `&`, and `?`. |
| Tasks appear in the wrong database | Check the app's source/target selector and `.env` URLs. |
| Migration validates but target looks stale | Rerun with `--mode upsert` or `--mode replace` depending on the demo. |
| `--mode replace` deleted target extras | This is expected. Replace mode makes target match source exactly. |
| Oracle setup cannot resolve connect string | Check `TARGET_ORACLE_TNS_ADMIN` and `TARGET_ORACLE_CONNECT_STRING`. |
| Wallet path fails on Windows | Use an absolute path with forward slashes, such as `C:/Users/name/Downloads/Wallet_target`. |
| Secure Tasks result is unexpected | Create fresh tasks with explicit `ownerId` values for the demo users. |
| Flashback query fails | Use a recent valid timestamp and confirm SQL access to target AJD. |

## ACL Recovery

If a connection worked earlier but fails after moving locations or changing Wi-Fi, update the database access control list.

Get the current public IP:

```bash
curl -s ifconfig.me
```

Then add that IP to the AJD network access list in OCI.

## Windows Recovery

Use Git Bash for workshop commands.

In VS Code:

1. Open Command Palette.
2. Run **Terminal: Select Default Profile**.
3. Choose **Git Bash**.
4. Open a new terminal.

If Git Bash is missing, install Git for Windows and restart VS Code.

## Commander Dependency Issue

If an attendee built the migration CLI manually and sees `ERR_REQUIRE_ESM`, pin Commander to a CommonJS-friendly version:

```bash
npm install mongodb dotenv commander@12
```

The downloaded reference implementation can use its included package lock with:

```bash
npm ci
```

## Minimal Rescue Path

If setup is taking too long:

1. Confirm `node`, `npm`, and `git` work.
2. Confirm AJD ACL includes the attendee's public IP.
3. Use the reference implementation.
4. Configure only `MONGO_API_URL`, `SOURCE_MONGO_API_URL`, `TARGET_MONGO_API_URL`, and `PORT`.
5. Run:

```bash
cd todo-app
npm ci
npm start
```

Once the attendee has a working app, return to the original lab for explanation and context.
