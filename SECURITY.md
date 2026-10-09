# Security Policy

Packy packages an executable runtime with generated configuration and installer scripts. Security reports are taken seriously.

## Supported versions

Packy is in early development and does not yet publish a stable release-support policy. Security fixes are evaluated against the latest code on the default branch. Do not assume older commits or generated packages receive security updates.

## Reporting a vulnerability

Please **do not open a public GitHub issue** for a vulnerability that could expose users, secrets, systems, or package integrity.

Use GitHub's private vulnerability reporting for this repository if it is enabled. If private reporting is unavailable, contact the repository maintainer privately through GitHub and request a secure reporting channel. Avoid sharing exploit details, credentials, or personal information in public.

Include, when safe:

- A concise description of the issue and its potential impact.
- Affected commit, release, platform, or generated package.
- Reproduction steps or a minimal proof of concept.
- Any mitigations you believe may reduce risk.

Please give the maintainer a reasonable opportunity to investigate and prepare a fix before publicly disclosing the issue.

## Scope notes

Security-relevant areas include:

- Downloading and extracting upstream runtime archives.
- Paths and file contents included in generated packages.
- Installer and launcher scripts.
- Handling of model-provider credentials and MCP configuration.
- ZIP generation and package integrity.
- Dependency vulnerabilities in the web application or generated artifact.

Packy currently uses placeholder MCP URLs and does not bundle provider credentials. Do not put secrets into issues, pull requests, tests, sample configuration, or generated packages.
