import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = path.join(repositoryRoot, "plugins", "one");

const readJson = async (relativePath) =>
  JSON.parse(await readFile(path.join(repositoryRoot, relativePath), "utf8"));

const manifest = await readJson("plugins/one/.codex-plugin/plugin.json");
const appConfig = await readJson("plugins/one/.app.json");
const openAiMarketplace = await readJson(".agents/plugins/marketplace.json");
const claudeManifest = await readJson("plugins/one/.claude-plugin/plugin.json");
const claudeMarketplace = await readJson(".claude-plugin/marketplace.json");
const cursorManifest = await readJson("plugins/one/.cursor-plugin/plugin.json");
const cursorMarketplace = await readJson(".cursor-plugin/marketplace.json");
const openCodeConfig = await readJson("plugins/one/opencode.json");
const skill = await readFile(path.join(pluginRoot, "skills", "one", "SKILL.md"), "utf8");
const pluginReadme = await readFile(path.join(pluginRoot, "README.md"), "utf8");
const workflow = await readFile(path.join(repositoryRoot, ".github", "workflows", "plugin-contract.yml"), "utf8");
const codexApiKey = await readFile(path.join(pluginRoot, "api-key", "codex.toml"), "utf8");
const claudeApiKey = await readJson("plugins/one/api-key/claude.json");
const cursorApiKey = await readJson("plugins/one/api-key/cursor.json");
const openCodeApiKey = await readJson("plugins/one/api-key/opencode.json");

assert.equal(manifest.apps, "./.app.json");
assert.equal("mcpServers" in manifest, false);
assert.match(manifest.version, /^0\.5\.0\+cross-client\.\d{14}$/);
assert.deepEqual(appConfig, {
  apps: {
    one: {
      id: "asdk_app_6a6ee591f94881918c3a963540af007a",
      required: true,
    },
  },
});

const oneMarketplaceEntry = openAiMarketplace.plugins.find((plugin) => plugin.name === "one");
assert.ok(oneMarketplaceEntry, "ONE must remain listed in the marketplace");
assert.equal(oneMarketplaceEntry.policy?.authentication, "ON_INSTALL");
assert.match(skill, /call `get_brand_standards`/);
assert.match(skill, /presentation, Complex Decision brief/);
assert.match(skill, /ONE\/Firebase-hosted asset URLs/);
assert.match(skill, /organization's ONE-published branding/);
assert.doesNotMatch(skill, /Calliope/);
assert.doesNotMatch(skill, /GeoTech mark|Outfit|IBM Plex Sans/);
assert.match(skill, /Call `get_signature_request` before every mutation/);
assert.match(skill, /use `delete_signature_request`; a sent or delivered request must use `void_signature_request`/);
assert.match(skill, /Before `send_signature_request`[\s\S]*obtain explicit user confirmation/);
assert.match(skill, /Never open or complete an external recipient's signing session/);
assert.match(skill, /Use `list_backups`[\s\S]*`get_backup_metadata`/);
assert.match(skill, /`export_backup` returns an import-compatible protected JSON resource only for a signed-in ONE owner/);
assert.match(skill, /Backups service API key[\s\S]*cannot export snapshot payloads/);
assert.match(skill, /Import, restore, backup deletion, retention settings, and automatic-backup settings are intentionally not plugin tools/);
assert.match(skill, /Use `list_remote_machines` or `get_remote_machine` before proposing a machine action/);
assert.match(skill, /`set_remote_machine_color`, `archive_remote_machine`, and `get_administration_audit` are visible only to a signed-in ONE owner or administrator/);
assert.match(skill, /Before `archive_remote_machine`[\s\S]*exact current machine name as `confirm_machine_name`/);
assert.match(skill, /Use `get_administration_audit` only for read-only review/);
assert.match(skill, /audit omits API-key hashes, reusable secrets, bridge settings, connector tokens/);
assert.match(skill, /User\/grant mutation, invitation management, API-key creation\/revocation[\s\S]*intentionally not plugin tools/);
assert.match(skill, /use the file ID returned by `get_item` with `get_item_file`/);
assert.match(skill, /never request or expose a storage object path/);
assert.match(skill, /Board and column structure tools are for ONE owners and administrators only/);
assert.match(skill, /call `reorder_boards` with `dry_run: true`[\s\S]*`dry_run: false` only after the user approves/);
assert.match(skill, /Before `rename_board`[\s\S]*call `get_board` and pass its exact current revision/);
assert.match(skill, /Before `duplicate_item`[\s\S]*does not inherit ONE-managed private files/);
assert.match(skill, /Before `edit_item_update` or `delete_item_update`[\s\S]*pass that text exactly as `confirm_text`/);
assert.match(skill, /Before `finance_update_transaction_decision` or `finance_update_transaction_decisions`[\s\S]*exact signed minor-unit amounts and currencies/);
assert.match(skill, /ONE records MCP changes as agent-assisted provenance/);
assert.match(skill, /Finance transaction comments are private internal collaboration available only through the signed-in OAuth session/);
assert.match(skill, /Before `finance_clear_statement_imports`[\s\S]*exact count-bound confirmation/);
assert.match(skill, /Before `finance_revise_invoice`, `finance_delete_invoice_draft`, or `finance_send_invoice`[\s\S]*explicit user confirmation of that exact recipient set/);
assert.match(skill, /Full IBANs and account numbers[\s\S]*must never be requested back, displayed, logged, or claimed to be returned/);
assert.match(skill, /Interactive Google Drive authorization[\s\S]*remain signed-in ONE browser workflows/);
assert.match(skill, /six lifecycle tools are owner-only through a signed-in person OAuth session/);
assert.match(skill, /Before `accounting_tax_save_dga`[\s\S]*complete selected-year replacement/);
assert.match(skill, /Before `accounting_tax_update_obligation` or `accounting_tax_update_debt`[\s\S]*never net a receivable obligation against gross company debt/);
assert.match(skill, /Call `accounting_tax_refresh_corporate_tax_forecast` only when the user explicitly requests a refresh/);
assert.match(skill, /never represent the result as a filed return, tax advice, or evidence of payment/);
assert.match(skill, /Start with `list_hardware_inventory`[\s\S]*use `get_hardware_asset`/);
assert.match(skill, /`move_hardware_asset`[\s\S]*stable `idempotency_key`/);
assert.match(skill, /`archive_hardware_asset`[\s\S]*exact asset ID through `confirm_asset_id`/);
assert.match(skill, /`list_hardware_documents`[\s\S]*`delete_hardware_document`/);
assert.match(skill, /People documents are more sensitive[\s\S]*separate \*\*People Documents\*\* module grant/);
assert.match(skill, /`owner_type: person`[\s\S]*`owner_type: company`/);
assert.match(skill, /`get_people_document`[\s\S]*`delete_people_document`/);
assert.match(skill, /Start with `list_procurement_requests`, then call `get_procurement_request` before every write/);
assert.match(skill, /stable `idempotency_key`[\s\S]*duplicate the request or notifications/);
assert.match(skill, /Before `delete_procurement_request`, `delete_procurement_comment`, or `delete_procurement_attachment`[\s\S]*exact current title, comment text, or file name/);
assert.match(skill, /Use `list_task_project_boards`, `list_task_projects`, and `get_task_project`/);
assert.match(skill, /Before `manage_project_sprint`[\s\S]*stable `idempotency_key`/);
assert.match(skill, /Before `delete_project_task`[\s\S]*exact title and current task revision/);
assert.match(skill, /Use `import_project_tasks` for strict task imports and `upsert_project_milestones` for strict milestone imports/);
assert.match(skill, /`list_project_tasks` with `tracking_context: true`[\s\S]*fresh `project_revision`/);
assert.match(skill, /stable, immutable `import_key`[\s\S]*exact same logical record/);
assert.match(skill, /Project editors, project managers, and ONE owners or administrators may import any task status currently configured on the project/);
assert.match(skill, /all-or-nothing[\s\S]*do not fall back to `create_project_tasks`[\s\S]*partial replacement/);
assert.match(skill, /After a successful import[\s\S]*re-read current project\/task context/);
assert.match(skill, /Hiring intentionally remains a ONE UI-only capability/);
assert.match(skill, /There are no Hiring API, MCP, or ONE Codex plugin operations/);
assert.match(skill, /Do not use generic board\/item, People-document, file, search, or database tools[\s\S]*candidates/);
for (const forbiddenHiringTool of ["hiring_", "create_candidate", "update_candidate", "create_job_opening", "move_candidate"]) {
  assert.equal(skill.includes(`\`${forbiddenHiringTool}\``), false, `must not document ${forbiddenHiringTool} as a tool`);
}
assert.equal(skill.includes("drive.google"), false);
assert.equal(skill.includes("docs.google"), false);
assert.match(manifest.interface.capabilities.join("\n"), /Brand standards/);
assert.match(manifest.interface.capabilities.join("\n"), /Hardware lifecycle/);
assert.match(manifest.interface.capabilities.join("\n"), /Private documents/);
assert.match(manifest.interface.capabilities.join("\n"), /Protected backups/);
assert.match(manifest.interface.capabilities.join("\n"), /Remote Machines/);
assert.match(manifest.interface.capabilities.join("\n"), /Administration audit/);
assert.match(manifest.interface.capabilities.join("\n"), /Procurement workflow/);
assert.match(manifest.interface.capabilities.join("\n"), /Project planning/);

const remoteServer = { type: "http", url: "https://one.geotech.one/api/mcp" };
assert.equal(claudeManifest.name, "one");
assert.deepEqual(claudeManifest.mcpServers, { one: remoteServer });
assert.equal(claudeManifest.skills, "./skills/");
assert.deepEqual(claudeMarketplace.plugins.map((plugin) => plugin.name), ["one"]);
assert.equal(claudeMarketplace.plugins[0].source, "./plugins/one");

assert.equal(cursorManifest.name, "one");
assert.deepEqual(cursorManifest.mcpServers, { one: { url: remoteServer.url } });
assert.equal(cursorManifest.skills, "./skills/");
assert.deepEqual(cursorMarketplace.plugins.map((plugin) => plugin.name), ["one"]);
assert.equal(cursorMarketplace.plugins[0].source, "plugins/one");

assert.deepEqual(openCodeConfig, {
  $schema: "https://opencode.ai/config.json",
  mcp: {
    one: {
      type: "remote",
      url: remoteServer.url,
    },
  },
});
assert.equal(JSON.stringify(openCodeConfig).includes("headers"), false);
assert.equal(JSON.stringify(openCodeConfig).includes("api_key"), false);
assert.equal("instructions" in openCodeConfig, false, "the merge template must not contain a destination-relative instruction path");
assert.match(pluginReadme, /OpenCode resolves relative instruction paths from the destination configuration file/);
assert.match(pluginReadme, /\/absolute\/path\/to\/ONE_Codex\/plugins\/one\/skills\/one\/SKILL\.md/);
assert.match(pluginReadme, /confirm that the instruction file exists at that exact path/);
assert.match(pluginReadme, /do not copy `\.\/skills\/one\/SKILL\.md` into a global or unrelated project configuration/);
assert.match(pluginReadme, /custom web connector[\s\S]*loads only the MCP connection; it does not load the shared workflow skill or its safeguards/);
assert.match(pluginReadme, /Use that fallback only when those workflow safeguards are not needed/);
assert.match(pluginReadme, /Member MCP access — 90 days/);
assert.match(pluginReadme, /ChatGPT web does not accept these local direct-MCP templates/);
assert.match(codexApiKey, /bearer_token_env_var = "ONE_MCP_API_KEY"/);
assert.equal(claudeApiKey.mcpServers["one-api-key"].headers.Authorization, "Bearer ${ONE_MCP_API_KEY}");
assert.equal(cursorApiKey.mcpServers["one-api-key"].headers.Authorization, "Bearer ${env:ONE_MCP_API_KEY}");
assert.equal(openCodeApiKey.mcp["one-api-key"].headers.Authorization, "Bearer {env:ONE_MCP_API_KEY}");
for (const value of [codexApiKey, JSON.stringify(claudeApiKey), JSON.stringify(cursorApiKey), JSON.stringify(openCodeApiKey)]) {
  assert.equal(/gcrm_[A-Za-z0-9_-]+/.test(value), false, "fallback templates must not contain a real-looking key");
}

assert.match(workflow, /node --test tests\/plugin-contract\.test\.mjs/);
assert.match(workflow, /permissions:\s*\n\s*contents: read/);

const connectionCounts = {
  openai: Object.keys(appConfig.apps).length,
  claude: Object.keys(claudeManifest.mcpServers).length,
  cursor: Object.keys(cursorManifest.mcpServers).length,
  opencode: Object.keys(openCodeConfig.mcp).length,
};
assert.deepEqual(connectionCounts, { openai: 1, claude: 1, cursor: 1, opencode: 1 });

await assert.rejects(
  access(path.join(pluginRoot, ".mcp.json"), fsConstants.F_OK),
  /ENOENT/,
  "the raw MCP declaration must not ship alongside the app connector",
);

console.log("ONE plugin connector contract is valid.");
