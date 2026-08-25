# ONE plugin for Codex

The ONE plugin gives Codex a secure, per-person connection to ONE boards and operational workspaces. It uses the hosted MCP endpoint at `https://one.geotech.one/api/mcp` and signs each user in through ONE's Google/Firebase login. No shared API key, repository checkout, or local server is required. The Firebase Hosting endpoint at `https://geotech-crm.web.app/api/mcp` remains a permanent fallback.

The connector also exposes `get_brand_standards`, the authoritative agent-readable GeoTech brand system. Call it before presentations, Complex Decisions, documents, reports, charts, diagrams, product/UI design, campaigns, or other visual work so approved Firebase-hosted source artwork, exact colours, Outfit/IBM Plex Sans typography, patterns, contrast, and clear-space rules are applied consistently.

## Choose an installation

### Option A — direct MCP connection

Use this when you need ONE tools in Codex and do not need a Plugins-directory card. No files are downloaded from this repository.

In Codex desktop, open **Settings → MCP servers → Add server**, choose **Streamable HTTP**, enter `ONE` and `https://one.geotech.one/api/mcp`, save, restart, and select **Authenticate**.

Or run:

```powershell
codex mcp add one `
  --url https://one.geotech.one/api/mcp `
  --oauth-resource https://one.geotech.one/api/mcp

codex mcp login one --scopes crm.read,crm.write
codex mcp list
```

### Option B — full ONE plugin

Use this for the branded Plugins-directory card, starter prompts, and the bundled ONE workflow skill. Codex fetches only this small public marketplace repository; you do not clone the private ONE application.

#### Install with the Codex desktop interface

No terminal command is required. Register and install the public Git marketplace directly in Codex desktop:

1. Open **Plugins**.
2. Open **Create → Add plugin marketplace** in the upper-right corner.
3. Enter Source `Geodesic-Games/ONE_Codex`.
4. Enter Git ref `main`.
5. Leave Sparse paths empty. This ensures Codex receives both the marketplace catalog and plugin folder.
6. Select **Add marketplace**.
7. If necessary, select refresh, then open **Personal → ONE**.
8. Open **ONE** and select the plus or **Install** button.
9. Select **Connect** on the ONE plugin card and complete the ONE sign-in window using the Google account registered in ONE.
10. Confirm its blue icon appears in the **Installed** row, restart Codex desktop, and start a new task.

#### Optional CLI alternative

```powershell
codex plugin marketplace add Geodesic-Games/ONE_Codex --ref main
codex plugin add one@geotech-one
codex plugin list
```

The three commands above are the supported sequence: register the Git marketplace, install `one` from the `geotech-one` marketplace, then verify the installation. Complete the browser sign-in, restart Codex desktop, and start a new task after either installation method.

#### Fix an old marketplace source

If Codex says marketplace `geotech-one` is already added from a different source, it still has the retired `GeoCRM_Codex` repository URL registered. Replace only that local marketplace registration, then install ONE:

```powershell
codex plugin marketplace remove geotech-one
codex plugin marketplace add Geodesic-Games/ONE_Codex --ref main
codex plugin add one@geotech-one
codex plugin list
```

This keeps the stable `one@geotech-one` identity and does not delete ONE workspace data, permissions, or server-side OAuth grants. When the configured source is already `ONE_Codex`, refresh it with `codex plugin marketplace upgrade geotech-one` instead of removing it.

## Prepare ONE access

An owner or administrator should:

1. Open [ONE](https://one.geotech.one/) and choose **Admin menu**.
2. Open the person's account and select the **ONE workspace** access type.
3. Assign an existing permission group, or select individual boards and BackOffice sections directly.
4. Choose **View only** or **Can edit** for every direct assignment.

If a person receives overlapping grants, edit access wins for boards included by both. Existing direct assignments without an explicit level remain edit-capable for compatibility; new direct assignments default to view-only.

## Sign in and use it

Ask Codex:

> List the ONE boards I can access.

The ONE plugin card shows a first-class **Connect** control because the plugin declares the registered **ONE** app connector as required. Installation should open that authorization flow immediately. Select **Connect**, sign in with the Google account registered in ONE, review the requested scopes, and choose **Authorize ONE**. Codex stores the rotating refresh credential and reuses the connection across app restarts and new tasks. You sign in again only after logging out, removing the plugin, revoking the connection, or having the ONE account disabled.

The connector's user-facing name comes from its registered ChatGPT app record. Keep that connection named **ONE** in [ChatGPT Plugins](https://chatgpt.com/plugins) and refresh it after MCP metadata changes; changing the local `.app.json` alias does not rename an existing developer connection.

ONE checks the user's current account status and board grants on every MCP request. Removing a group, changing it to view-only, removing a board, or disabling the user takes effect without issuing a new plugin credential.

Access levels:

- **View only** — list, search, and inspect permitted boards.
- **Can edit** — all view actions plus create, update, comment, move, and confirmed soft-delete actions.
- **Owner** — all non-owner-only ONE boards with edit access.

Useful requests:

- `Get the GeoTech brand standards before designing this presentation.`
- `List my ONE boards and show whether each is view-only or editable.`
- `Search Contacts for people connected to Acme.`
- `Show the Deals schema before creating anything.`
- `Preview moving these Production items to Review without applying it.`
- `Add this meeting note to the selected contact.`
- `List the Hardware assets I can access and show their current custodians.`
- `Move this asset to the Amsterdam office after showing me its current revision and history.`
- `List my permitted People documents without exposing storage links.`
- `List recent ONE backups and show their protected-root coverage without exporting the data.`
- `As the signed-in owner, export this backup and report its SHA-256 checksum.`
- `List Remote Machines and show current availability and bookings.`
- `As a ONE administrator, audit users, grants, invitations, and API-key metadata without exposing secrets.`
- `Create this Procurement request with the ordered approvers, then show me the saved approval state.`
- `Show this project's statuses and sprints before proposing the requested planning change.`

Deleting an item requires the exact current item name as confirmation and uses ONE's existing soft-delete audit path.
Hardware lifecycle uses the person's Hardware module grant. People document tools require the separate sensitive
**People Documents** view/edit grant; ordinary People or board access does not reveal those files.
Backup inventory and metadata are read-only. Complete export is available only to a signed-in ONE owner and carries
sensitive operational JSON; API keys cannot export. Import, restore, deletion, retention settings, and automatic-backup
settings remain in ONE's reviewed Backups panel and are intentionally not plugin tools.
Remote Machine color/archive and the administration audit require a signed-in ONE owner or administrator; API keys are
not accepted. Archive requires the exact current machine name, resolves aliases on the server, clears live runtime and
bookings, and does not uninstall OneClient. The audit is read-only and omits hashes, reusable secrets, bridge settings,
connector tokens, and credentials. Permission, invitation, key, bridge, retention, and client-lifecycle mutations remain
reviewed ONE workflows and are intentionally not plugin tools.
Procurement is a person-bound workflow: Codex reads the current request before each change, passes its fresh version,
uses stable idempotency keys for retryable writes, and requires exact confirmation before destructive actions. Project
planning follows the same revision discipline for source control, statuses, sprints, automation decisions, comments,
attachments, and task deletion.

Hiring remains available only in ONE's reviewed UI. It has no API, MCP, or ONE Codex plugin operations in the current
scope, and the plugin must not approximate Hiring through generic board, item, file, search, or People-document tools.

## Update or remove

Update the public plugin marketplace and reinstall the current package:

```powershell
codex plugin marketplace upgrade geotech-one
codex plugin add one@geotech-one
```

Remove the plugin:

```powershell
codex plugin remove one@geotech-one
```

Remove a direct MCP connection:

```powershell
codex mcp logout one
codex mcp remove one
```

Removing the local connection does not change ONE user access. A ONE administrator can revoke server access immediately by disabling the account or removing its board grants.

## Security notes

- OAuth uses authorization code flow with PKCE, short-lived access tokens, and persistent rotating refresh tokens.
- The plugin never receives a Google password or a reusable Firebase credential.
- ONE enforces the signed-in person's live board viewer/editor grants on every tool call.
- The local stdio MCP remains available only in the private ONE application repository for specialized developer/API-key workflows.

Public installation guide: <https://one.geotech.one/docs/codex-plugin/>
