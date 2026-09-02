# ONE AI client integration

This public repository packages ONE's hosted OAuth MCP integration for Codex, Claude, Cursor, and OpenCode. The remote MCP server is the authoritative tool and authorization boundary. Each interactive connection is filtered and authorized from the person's current ONE role, board grants, project grants, sharing state, and module access.

Codex Desktop connects directly to ONE through the plugin's remote MCP declaration. A personal ChatGPT Plus or Pro account can install the plugin and authorize its own ONE account without a ChatGPT Team or Enterprise workspace, an API key, or a terminal command. ChatGPT web remains outside this release while the registered ONE app awaits separate OpenAI approval.

The 90-day Member MCP templates under `plugins/one/api-key/` remain an advanced fallback for clients without working OAuth and for controlled local workflows. ChatGPT web cannot load those direct templates. Service keys remain a separate option for explicitly provisioned automation, CI, scheduled agents, and migrations.

## Supported clients

| Client | Package surface | Connection behavior |
|---|---|---|
| Codex Desktop | `.codex-plugin/plugin.json` plus `.mcp.json` | Installs one remote MCP server and starts direct per-user ONE OAuth. |
| ChatGPT web | Future registered app package under `platforms/chatgpt/` | Deferred until the ONE app is approved by OpenAI. |
| Claude Desktop and Claude Code | `.claude-plugin/plugin.json` plus Claude marketplace | Loads one remote HTTP MCP connector and the shared ONE skill. |
| Cursor | `.cursor-plugin/plugin.json` plus Cursor marketplace | Loads one remote MCP server and the shared ONE skill. |
| OpenCode | `opencode.json` | Uses OpenCode's native remote MCP OAuth support and the shared ONE instructions. |

All four target the shared production endpoint `https://one.geotech.one/api/mcp`. Dedicated ONE deployments can use the same package guidance with their own HTTPS MCP resource and OAuth issuer.

## Install

Detailed client-specific instructions are in [plugins/one/README.md](plugins/one/README.md).

For Codex Desktop, add the marketplace `Geodesic-Games/ONE_Codex` from the Plugins interface, install **ONE**, and select **Authenticate**. Codex discovers ONE's OAuth server, opens the ONE sign-in page, and stores the resulting OAuth session. Restart Codex and start a new task after authorization. No terminal command or `ONE_MCP_API_KEY` environment variable is required.

Before using the plugin, remove or disable any manually configured user-level `one` MCP connection, as well as any `one-api-key`, `one_api_key`, or `one-amazon-import` connection. Keep only the plugin-managed `one` connection so ONE's tools and OAuth identity are loaded exactly once.

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
plugins/one/.mcp.json                     Direct Codex remote MCP connection
plugins/one/.codex-plugin/plugin.json     Codex Desktop plugin
plugins/one/.claude-plugin/plugin.json    Claude plugin
plugins/one/.cursor-plugin/plugin.json    Cursor plugin
plugins/one/opencode.json                 OpenCode remote MCP template
plugins/one/skills/one/SKILL.md           Shared customer-facing workflow
platforms/chatgpt/.app.json               Future approved ChatGPT app mapping
tests/plugin-contract.test.mjs            Cross-client package contract
```

Run `node tests/plugin-contract.test.mjs` before publishing a package change. Direct Codex OAuth, ChatGPT app approval, marketplace submission, production registration, and deployment are separate approval gates.
