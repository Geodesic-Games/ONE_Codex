# ONE AI client integration

This public repository packages ONE's hosted OAuth MCP integration for ChatGPT/Codex, Claude, Cursor, and OpenCode. The remote MCP server is the authoritative tool and authorization boundary. Each interactive user signs in to ONE; every tool call is filtered and authorized from that user's current ONE role, board grants, project grants, sharing state, and module access.

No API key, shell environment variable, local server, or private ONE application checkout is required for interactive use. Service keys remain a separate option for explicitly provisioned automation, CI, scheduled agents, and migrations.

## Supported clients

| Client | Package surface | Connection behavior |
|---|---|---|
| ChatGPT and Codex | `.codex-plugin/plugin.json` plus required `.app.json` | Installs the registered ONE app and starts native per-user OAuth. |
| Claude Desktop and Claude Code | `.claude-plugin/plugin.json` plus Claude marketplace | Loads one remote HTTP MCP connector and the shared ONE skill. |
| Cursor | `.cursor-plugin/plugin.json` plus Cursor marketplace | Loads one remote MCP server and the shared ONE skill. |
| OpenCode | `opencode.json` | Uses OpenCode's native remote MCP OAuth support and the shared ONE instructions. |

All four target the shared production endpoint `https://one.geotech.one/api/mcp`. Dedicated ONE deployments can use the same package guidance with their own HTTPS MCP resource and OAuth issuer.

## Install

Detailed client-specific instructions are in [plugins/one/README.md](plugins/one/README.md).

For Codex desktop, add the marketplace `Geodesic-Games/ONE_Codex`, install `ONE`, and choose **Connect**. The registered app is required on install, so the client presents ONE's OAuth flow without asking for a credential.

For Claude Code, add this repository as a marketplace and install the plugin:

```text
/plugin marketplace add Geodesic-Games/ONE_Codex
/plugin install one@geotech-one
```

For Cursor, load `plugins/one` as a local plugin while developing, or import the repository's Cursor marketplace after it has been approved for the intended organization. Cursor discovers OAuth from the MCP endpoint.

For OpenCode, merge the `mcp.one` entry from [plugins/one/opencode.json](plugins/one/opencode.json) into the user's existing configuration, then authenticate `one` from OpenCode's MCP connection flow. Do not overwrite unrelated OpenCode settings.

## Safety contract

The shared skill resolves accessible boards and projects before mutation, confirms exact targets, uses fresh revisions and immutable import keys for tracker imports, and verifies results in ONE. It is organization-neutral and has no Calliope dependency. Brand guidance is loaded only when the user intentionally invokes the connected organization's ONE-published branding.

ONE never accepts a tenant ID as a tool argument. Dedicated customer deployments derive tenant and issuer context from server configuration, and the server re-evaluates access on each request.

## Repository layout

```text
.agents/plugins/marketplace.json          OpenAI/Codex marketplace
.claude-plugin/marketplace.json           Claude marketplace
.cursor-plugin/marketplace.json           Cursor marketplace
plugins/one/.app.json                     Registered OpenAI ONE app
plugins/one/.codex-plugin/plugin.json     ChatGPT/Codex plugin
plugins/one/.claude-plugin/plugin.json    Claude plugin
plugins/one/.cursor-plugin/plugin.json    Cursor plugin
plugins/one/opencode.json                 OpenCode remote MCP template
plugins/one/skills/one/SKILL.md           Shared customer-facing workflow
tests/plugin-contract.test.mjs            Cross-client package contract
```

Run `node tests/plugin-contract.test.mjs` before publishing a package change. Marketplace submission, production registration, and deployment are separate approval gates.
