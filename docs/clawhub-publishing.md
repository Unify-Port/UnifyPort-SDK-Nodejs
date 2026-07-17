# Publishing the SDK Skill to ClawHub

[English](clawhub-publishing.md) | [简体中文](zh-CN/clawhub-publishing.md)

## Decisions

- The ClawHub release is owned by the GitHub user account `@unifyport`. `CLAWHUB_TOKEN` must represent
  that account, and the release workflow verifies `clawhub whoami` before publishing. Publish commands
  intentionally omit `--owner` and the `owner` input.
- Every ClawHub Skill release uses the platform-required MIT-0 license. This applies to the published
  Skill bundle and does not change the MIT license of `@unifyport/sdk-node` or the repository.

## Publication boundary

Only `skills/unifyport-node-sdk` is published to ClawHub.

`skills/unifyport-mcp` remains repository-local because `@unifyport/mcp-server` is still a private
package without a public installation channel. Do not publish the whole `skills/` directory or run an
unrestricted sync command.

The published SDK Skill is a development and integration guide. It does not bundle the SDK runtime,
install an MCP server, expose Device API operations as OpenClaw tools, or contain credentials. Projects
install the runtime separately from npm as `@unifyport/sdk-node`.

## Prerequisites

1. Install a current ClawHub CLI and authenticate the `@unifyport` publisher account:

   ```bash
   npm install --global clawhub
   clawhub login
   clawhub whoami
   ```

2. For GitHub Actions, create the repository secret `CLAWHUB_TOKEN` from the same `@unifyport` account.
   Never commit or print the token.
3. Review the current ClawHub
   [Skill format](https://docs.openclaw.ai/clawhub/skill-format),
   [publishing](https://docs.openclaw.ai/clawhub/publishing), and
   [security audit](https://docs.openclaw.ai/clawhub/security-audits) documentation before the first
   release or after a material platform change.

The GitHub web importer is not part of this workflow. Local CLI and GitHub Actions publishing work from
the checked-out Skill folder and preserve the explicit publication boundary.

## Local preflight

Run the repository gates first:

```bash
pnpm clawhub:check
pnpm docs:check
pnpm format:check
pnpm public:check
pnpm check
```

Then run the authoritative ClawHub dry-run from the repository root:

```bash
clawhub skill publish ./skills/unifyport-node-sdk \
  --slug unifyport-node-sdk \
  --name "UnifyPort Node.js SDK" \
  --dry-run \
  --json
```

The command intentionally omits `--owner`. The unauthenticated dry-run validates the bundle, while the
real workflow verifies that `clawhub whoami` resolves to `unifyport` before uploading. Dry-run must
complete without uploading before a real release is approved.

## GitHub Actions flow

`.github/workflows/clawhub-skill-publish.yml` has two paths:

- pull requests run the pinned ClawHub CLI with `--dry-run` and no publishing token;
- `workflow_dispatch` verifies that `CLAWHUB_TOKEN` belongs to `@unifyport`, then performs the real
  release from `main`.

Both paths pass the exact `skills/unifyport-node-sdk` folder and the display name `UnifyPort Node.js
SDK`. The CLI version is pinned to the version validated by this repository so upstream changes and
automatic title casing cannot silently change the publication. There is no push or tag trigger, so an
SDK npm release cannot publish a Skill implicitly.

A new ClawHub Skill starts at `1.0.0`; later changed bundles default to the next patch version. Skill
versioning is independent from the npm SDK version and must not be forced to match it.

## Release verification

After the manual workflow succeeds, verify the exact `@unifyport` release:

```bash
clawhub inspect @unifyport/unifyport-node-sdk --versions --files --json
clawhub scan --slug unifyport-node-sdk --version 1.0.0 --json
openclaw skills install @unifyport/unifyport-node-sdk
```

Confirm the published file list, MIT-0 license, version, source attribution, and security audit status.
Perform the install smoke test in a disposable workspace without production credentials or a live API
request.

If the release is incorrect, prefer publishing a corrected patch. Hide or delete a release only after
reviewing ClawHub's current retention and slug-reservation behavior.
