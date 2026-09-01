# ONE plugin and remote MCP

ONE is a hosted operational workspace exposed to compatible AI clients through a remote Streamable HTTP MCP server. OAuth is the preferred interactive connection. While a native app connection is unavailable, Codex, Claude, Cursor, and OpenCode may use a temporary Member MCP key; ONE still reloads the key owner's live role and grants on every request.

## Direct Member MCP key fallback

Create **Member MCP access — 90 days** from ONE's Agent Keys dialog. Store the one-time secret in an approved credential manager, expose it to the client only as `ONE_MCP_API_KEY`, and merge the matching file under `api-key/` into that client's existing configuration. Never commit the secret or paste it into a prompt, screenshot, issue, or configuration file.

The examples intentionally register `one-api-key`, not `one`. Disable the OAuth `one` connection while using this fallback so the same tools are not installed twice. A Member MCP key follows the owner's current ONE permissions and expires after 90 days. Revocation, user deactivation, or removal of a board, project, sharing, or module grant takes effect on the next call.

The fallback excludes administration, connected-app and access-grant management, mailbox scans, Google Drive authorization/transfers, protected backup payload export, and Hiring. ChatGPT web does not accept these local direct-MCP templates; use the approved ONE app there when available.

Before troubleshooting, confirm only that `ONE_MCP_API_KEY` is present in the client process; never print its value. After testing, revoke the key in ONE, remove the `one-api-key` entry, clear the environment variable, and re-enable the OAuth `one` connection.

## ChatGPT and Codex

The OpenAI package uses `.codex-plugin/plugin.json` and a single required registered app in `.app.json`. It intentionally does not include `.mcp.json`, because a second raw MCP declaration would compete with the native app connection.

In Codex desktop:

1. Open **Plugins → Create → Add plugin marketplace**.
2. Add `Geodesic-Games/ONE_Codex` from `main`.
3. Install **ONE** from the `geotech-one` marketplace.
4. Select **Connect**, complete ONE sign-in, restart Codex, and start a new task.

CLI marketplace installation is equivalent:

```text
codex plugin marketplace add Geodesic-Games/ONE_Codex --ref main
codex plugin add one@geotech-one
codex plugin list
```

For the temporary key fallback, merge `api-key/codex.toml` into Codex config and launch Codex from a process that has `ONE_MCP_API_KEY` set.

## Claude Desktop and Claude Code

The Claude manifest includes one inline remote HTTP MCP server plus the shared skill. It does not build an MCPB desktop extension because hosted ONE does not need local filesystem, process, or device access.

For Claude Code:

```text
/plugin marketplace add Geodesic-Games/ONE_Codex
/plugin install one@geotech-one
```

For Claude Desktop, install the same plugin when custom plugin upload is available. Adding `https://one.geotech.one/api/mcp` as a custom web connector in **Customize → Connectors** loads only the MCP connection; it does not load the shared workflow skill or its safeguards. Use that fallback only when those workflow safeguards are not needed. On Team or Enterprise, an organization owner may need to add the connector before members individually connect. Complete OAuth with the user's own ONE account.

## Cursor

The Cursor manifest includes one inline remote MCP server and the shared skill. While developing, symlink or copy `plugins/one` into Cursor's local plugin directory and reload the window:

```text
~/.cursor/plugins/local/one
```

The repository also contains `.cursor-plugin/marketplace.json` for a future reviewed Cursor marketplace or an organization-managed marketplace. Installing the plugin should present Cursor's MCP OAuth flow. No plugin variable or secret is required.

Users who do not need the workflow skill can instead add `https://one.geotech.one/api/mcp` as a remote server in Cursor's MCP settings. Do not install both forms at once, because that would duplicate the ONE connection.

## OpenCode

OpenCode's in-process plugin API is not needed for hosted ONE. Use the native remote MCP configuration in `opencode.json` for OAuth, or merge `api-key/opencode.json` for the temporary Member MCP key fallback.

Merge the `mcp.one` entry into the user's existing OpenCode configuration. Do not replace unrelated providers, agents, permissions, or MCP servers.

To load the shared workflow, also add an `instructions` entry whose value is the absolute path to this checkout's skill. OpenCode resolves relative instruction paths from the destination configuration file, not from this template, so do not copy `./skills/one/SKILL.md` into a global or unrelated project configuration. For example, replace the placeholder below with the absolute path to the cloned `ONE_Codex` repository:

```json
{
  "instructions": [
    "/absolute/path/to/ONE_Codex/plugins/one/skills/one/SKILL.md"
  ]
}
```

After merging both entries, confirm that the instruction file exists at that exact path, then authenticate from OpenCode or run `opencode mcp auth one`.

OpenCode must store its OAuth state outside the checked-in configuration. The ONE template deliberately contains no headers, API key, client secret, or fixed tenant identity.

## Shared workflow

Across clients:

1. Discover the boards and projects the signed-in person can currently access.
2. Read the exact target and its current revision before a write.
3. For reconciliation-safe tracker work, use `import_project_tasks` and `upsert_project_milestones` with immutable import keys.
4. Project editors may import Backlog tasks only. Project managers and ONE owner/admin users may preserve historical statuses.
5. Verify the resulting tasks and milestones in ONE after the mutation.
6. Disconnect a client from ONE's **Connected apps** control when access is no longer needed.

The generic `create_project_tasks` tool remains available for ordinary Backlog task creation. The strict import tool is separate so integrations cannot silently opt into historical-status authority.

The shared skill is customer-neutral and independent of GeoTech's internal Calliope plugin. If a user intentionally requests branded work, call `get_brand_standards` and follow the branding published by that customer's ONE deployment.

## Dedicated ONE deployments

Replace the shared endpoint with the customer's own public HTTPS MCP resource. That server must publish its own protected-resource metadata and OAuth issuer. The client package must never accept tenant identity through tool arguments or hardcode a customer database identifier.

## Service automation

API keys remain appropriate only for unattended services, CI, scheduled jobs, or controlled migrations. Strict service imports require explicit scopes and an exact non-empty project allowlist. Never place a service secret in this package, a prompt, a screenshot, source control, or client marketplace metadata.
