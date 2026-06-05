#!/usr/bin/env python3
from pathlib import Path
import re


HOME = Path.home()
DBTOOLS = HOME / ".dbtools"
CONNECTIONS = DBTOOLS / "connections"
ALIASES = DBTOOLS / "sqlcl" / "aliases.xml"
FOLDERS = DBTOOLS / "connection_folders" / "folders.json"

SECRET_KEY_PATTERN = re.compile(
    r"password|passwd|pwd|secret|token|credential|private|key", re.IGNORECASE
)

INTERESTING_KEY_PATTERN = re.compile(
    r"name|user|type|role|url|connect|tns|service|host|port|wallet|cloud|db|schema|alias|driver",
    re.IGNORECASE,
)


def redact_value(key: str, value: str) -> str:
    if SECRET_KEY_PATTERN.search(key):
        return "<REDACTED>"

    # Avoid dumping opaque blobs or very long values.
    if len(value) > 180:
        return value[:80] + "...<TRUNCATED>"

    return value


def parse_properties(path: Path) -> dict[str, str]:
    props: dict[str, str] = {}

    if not path.exists():
        return props

    for raw_line in path.read_text(errors="replace").splitlines():
        line = raw_line.strip()

        if not line or line.startswith("#"):
            continue

        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        props[key.strip()] = value.strip()

    return props


def print_properties(title: str, props: dict[str, str]) -> None:
    if not props:
        print(f"  {title}: <missing or empty>")
        return

    print(f"  {title}:")

    printed = False
    for key in sorted(props):
        value = props[key]

        if SECRET_KEY_PATTERN.search(key) or INTERESTING_KEY_PATTERN.search(key):
            print(f"    {key}={redact_value(key, value)}")
            printed = True

    if not printed:
        print("    <no interesting non-secret keys matched>")


def main() -> None:
    print(f"DB Tools root: {DBTOOLS}")
    print(f"Connections dir exists: {CONNECTIONS.exists()}")
    print()

    if not CONNECTIONS.exists():
        return

    connection_dirs = sorted(path for path in CONNECTIONS.iterdir() if path.is_dir())
    print(f"Connection directories found: {len(connection_dirs)}")

    for connection_dir in connection_dirs:
        print()
        print(f"## Connection folder: {connection_dir.name}")
        dbtools_props = parse_properties(connection_dir / "dbtools.properties")
        ojdbc_props = parse_properties(connection_dir / "ojdbc.properties")

        print_properties("dbtools.properties", dbtools_props)
        print_properties("ojdbc.properties", ojdbc_props)

    print()
    print(f"SQLcl aliases file exists: {ALIASES.exists()} ({ALIASES})")
    if ALIASES.exists():
        aliases_text = ALIASES.read_text(errors="replace")
        aliases_text = re.sub(
            r"(?i)(password|pwd|token|secret|key)([^\n<]*)",
            r"\1=<REDACTED>",
            aliases_text,
        )
        print("SQLcl aliases preview:")
        for line in aliases_text.splitlines()[:80]:
            print(f"  {line}")

    print()
    print(f"Connection folders file exists: {FOLDERS.exists()} ({FOLDERS})")
    if FOLDERS.exists():
        folders_text = FOLDERS.read_text(errors="replace")
        folders_text = re.sub(
            r"(?i)(password|pwd|token|secret|key)([^\n,}]*)",
            r"\1=<REDACTED>",
            folders_text,
        )
        print("Connection folders preview:")
        for line in folders_text.splitlines()[:80]:
            print(f"  {line}")


if __name__ == "__main__":
    main()