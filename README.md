# ONE for Codex

This public repository distributes the ONE Codex plugin. The ONE server, data, authentication, and permission enforcement remain hosted by GeoTech; this repository contains only the installable plugin manifest, registered connector mapping, workflow skill, documentation, and plugin assets. Through the hosted connector, `get_brand_standards` exposes the authoritative GeoTech logos, exact palette, typography, patterns, Firebase-hosted source files, and usage guidance.

The bundled skill covers guarded Procurement and project-planning workflows with read-before-write, optimistic revisions, idempotent retries, and exact destructive confirmations. Hiring is intentionally not an API, MCP, or plugin capability in the current scope and remains available only in ONE's reviewed UI.

## Install from Codex desktop

No terminal command or repository clone is required:

1. Open **Plugins** in Codex desktop.
2. Open **Create → Add plugin marketplace**.
3. Enter Source `Geodesic-Games/ONE_Codex`.
4. Enter Git ref `main`.
5. Leave Sparse paths empty and select **Add marketplace**.
6. Open **Personal → ONE** and install **ONE**.
7. Select **Connect** on the ONE plugin card and complete the ONE sign-in window.
8. Restart Codex desktop and start a new task.

Optional CLI equivalent:

```powershell
codex plugin marketplace add Geodesic-Games/ONE_Codex --ref main
codex plugin add one@geotech-one
codex plugin list
```

### If Codex reports a different marketplace source

The repository was renamed from `GeoCRM_Codex` to `ONE_Codex`. If Codex already registered the old URL under the stable `geotech-one` marketplace name, remove that local source registration before adding the renamed repository:

```powershell
codex plugin marketplace remove geotech-one
codex plugin marketplace add Geodesic-Games/ONE_Codex --ref main
codex plugin add one@geotech-one
```

This does not delete ONE data, user access, or server-side OAuth grants. It only replaces the local marketplace source URL. If `geotech-one` already points to `ONE_Codex`, use `codex plugin marketplace upgrade geotech-one` instead.

The ONE plugin declares its registered **ONE** app connector as a required dependency, so installation starts the same first-class **Connect** flow used by connector-backed plugins such as Gmail. Selecting it opens ONE's OAuth page so each person can sign in with their own authorized Google account. Codex securely stores the rotating refresh credential and reuses the session across restarts and tasks until the person logs out, removes the plugin, or ONE disables the account.

The user-facing connector name is owned by the registered ChatGPT app, not by the alias in `.app.json`. Keep that registered connection named **ONE** in [ChatGPT Plugins](https://chatgpt.com/plugins), and refresh its metadata after deploying MCP changes. A stale developer connection created as **ONE Test** must be renamed there when the interface offers editing, or replaced by a new **ONE** connection and its new `asdk_app_...` ID must be committed here.

For a direct MCP connection without the plugin card or local files:

```powershell
codex mcp add one `
  --url https://one.geotech.one/api/mcp `
  --oauth-resource https://one.geotech.one/api/mcp
codex mcp login one --scopes crm.read,crm.write
```

See [the complete plugin guide](plugins/one/README.md) or the [hosted installation guide](https://one.geotech.one/docs/codex-plugin/).

For presentations, Complex Decisions, documents, charts, diagrams, product/UI design, or other visual GeoTech work, ask Codex to call `get_brand_standards` before it starts designing. The plugin skill treats the returned standard as authoritative, uses only its ONE/Firebase-hosted asset URLs, and prohibits redrawing or transforming the mark.

## Repository layout

```text
.agents/plugins/marketplace.json  Public Codex marketplace catalog
plugins/one/.codex-plugin/        Plugin manifest
plugins/one/.app.json             Registered ONE app connector
plugins/one/skills/               ONE workflow instructions
plugins/one/assets/               ONE plugin branding
tests/plugin-contract.test.mjs    Connector packaging regression test
```

Run the package contract check with `node tests/plugin-contract.test.mjs`.

The ONE application repository consumes this repository as a Git submodule so the public plugin package remains independently installable and versioned.
