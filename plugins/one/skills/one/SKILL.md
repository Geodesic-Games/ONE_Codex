---
name: one
description: Use when the user wants to inspect or manage ONE boards, columns, items, comments, project planning, Procurement, Remote Machines, administration audits, private item files, Hardware assets and documents, People documents, Finance records and workflows, protected backups, or intentionally retrieve their organization's ONE-published branding. The remote MCP server signs in each person with OAuth and enforces that person's current permissions.
---

# ONE

Use the ONE app connector tools for ONE workspace and board work.

## Organization-published brand standards

- When the user asks to apply the connected organization's branding to a presentation, Complex Decision brief, product or website design, UI, document, report, chart, diagram, campaign, email, social post, or other visual work, call `get_brand_standards`.
- Treat the returned logos, colour values, typography, pattern, contrast, and clear-space rules as authoritative. Do not rely on remembered or copied values.
- Use only the ONE/Firebase-hosted asset URLs returned by the standard. Never substitute or expose Google Drive, Google Docs, or other third-party source links for brand files.
- Start from the returned approved artwork or a published template. Never redraw, recolour, crop, stretch, distort, rotate, or rebuild the organization's mark or its lockups.
- Apply only the typography and design rules returned by the connected organization's current standard.
- Review the finished composition at its actual delivery size before sharing or publishing it.

## Start with access context

- Call `get_current_user` or `list_boards` when the target board or the user's access level is not already known.
- Treat the returned board list and access level as authoritative. Never infer permission from the prompt or from earlier tasks.
- A `viewer` board is read-only. Do not retry a denied write using another route or credential.

## Read workflow

1. Use `list_boards` to resolve the board ID.
2. Use `get_board` when column or group IDs matter.
3. Use `search_items` for discovery across permitted boards, or `list_board_items` for one board.
4. Use `get_item` before changing an existing record.
5. When the user needs the content of a private item file, use the file ID returned by `get_item` with `get_item_file`. Treat the returned embedded resource, filename, media type, byte size, SHA-256 checksum, source, and revision as authoritative; never request or expose a storage object path.

## Write workflow

- Confirm the board and target item before a mutation.
- Prefer exact existing column IDs or titles from `get_board`.
- Preview moves with `dry_run: true` before applying them.
- For deletion, read the item first and pass its exact current name as `confirm_name`.
- Report permission errors as access-policy outcomes. Ask a ONE administrator to change the person's group only when broader access is genuinely required.

## Board structure and collaboration workflow

1. Board and column structure tools are for ONE owners and administrators only. Use the access context returned by `get_current_user` or `list_boards`; never try a service credential or alternate route after a structure denial.
2. Before `create_board` or `reorder_boards`, call `list_boards` and pass its current directory revision. For reorder, submit the complete returned reorderable board ID list, call `reorder_boards` with `dry_run: true`, show the proposed changes, and call it again with `dry_run: false` only after the user approves.
3. Before `rename_board`, `rename_board_column`, `ensure_board_column`, `archive_board_column`, or `delete_board`, call `get_board` and pass its exact current revision. Re-read after every structural mutation before making another one.
4. Before archiving a column or deleting a board, show what will change and what will be preserved, obtain explicit confirmation, then pass the exact current column title or board name with the fresh revision. Do not claim that archived cell data or the recoverable board copy was permanently erased.
5. Before `duplicate_item`, call `get_item` and pass its exact current item revision. Explain that the copy gets a new identity, has no prior updates or protected owner assignment, and does not inherit ONE-managed private files; upload new copies separately when needed.
6. Before `edit_item_update` or `delete_item_update`, call `get_item` and select the exact update ID and revision. Only the author or a ONE owner/administrator may change it. For deletion, show the current text, obtain explicit confirmation, and pass that text exactly as `confirm_text`.

## Project planning and task lifecycle workflow

1. Use `list_task_project_boards`, `list_task_projects`, and `get_task_project` to resolve the exact board/project and current project revision. Use `get_task_context` before a task mutation and after any successful change. Never reuse a project or task revision after another write.
2. `update_project_source_control` is for an internal signed-in person only. Show the GitHub repository/default branch or Perforce credential-profile ID/depot paths before replacing the one project configuration. Never request, accept, or expose repository credentials, Perforce tickets, passwords, or webhook secrets.
3. Before `manage_project_status`, show the current status list and proposed task movement. Create and rename require a fresh project revision. Delete also requires an existing fallback status and the exact current status name through `confirm_status`.
4. Before `manage_project_sprint`, show the sprint dates, active-sprint change, overlap shift, and destination for unfinished tasks. Use a stable `idempotency_key` when creating a sprint. Finish or delete requires the exact sprint name through `confirm_name`; re-read the project after every action.
5. Use `decide_task_automation_suggestion` only for the exact pending fingerprint returned in task context. Show the proposed source link before accept/reject. `undo_task_automation` restores only fields still owned by the last automation run; disclose skipped human-edited fields from the result and never imply a full rollback.
6. Before `edit_project_task_comment` or `delete_project_task_comment`, resolve the exact comment from current task context and pass both current task and comment versions. Deletion requires the exact current text. Before `delete_project_task_attachment`, show the exact asset and pass its current name. Before `delete_project_task`, show the current title, explain that ONE keeps deletion audit metadata while removing managed task/comment attachments, obtain explicit confirmation, and pass the exact title and current task revision.

## Reconciliation-safe Project Tracker imports

1. Use `import_project_tasks` for strict task imports and `upsert_project_milestones` for strict milestone imports. First call `list_project_tasks` with `tracking_context: true` and use its fresh `project_revision`; never reuse that revision after any project write or conflict.
2. Give every imported task and milestone a stable, immutable `import_key`. Reuse the same key only when retrying the exact same logical record; never change a key's payload or use a new key to bypass an import conflict.
3. Project editors may import only `Backlog` tasks. Project managers and ONE owners or administrators may preserve historical task statuses. Do not retry a denied historical-status import through a different tool or credential.
4. Treat each import as all-or-nothing: if ONE rejects any member of the batch, do not fall back to `create_project_tasks`, split the batch to evade validation, or apply a partial replacement. Correct the reported input or refresh the project context, then resubmit the intended batch.
5. After a successful import, verify the returned tasks or milestones and re-read current project/task context before reporting completion or making another mutation.

## Procurement workflow

1. Procurement MCP tools are available only to a signed-in person with the current Procurement module grant; API keys and alternate generic-board routes are not a fallback. Start with `list_procurement_requests`, then call `get_procurement_request` before every write and after every successful mutation.
2. Use `create_procurement_request` only from explicit budget, currency, purpose, ordered approver, and—when Hardware—equipment/destination facts. Use a stable `idempotency_key` so an uncertain retry cannot duplicate the request or notifications. Only an owner or administrator may use `create_procurement_category`.
3. Pass the exact current request `updated_at` to every guarded write. `update_procurement_request` replaces editable details and resets the approval chain; show that consequence before applying it. Re-read before adding approvers, comments, decisions, lifecycle changes, or attachments.
4. Use a stable `idempotency_key` for `add_procurement_comment`, `decide_procurement_request`, and `upload_procurement_attachment`. Only the current approver may decide. Show the requested decision and note before calling it; do not infer approval from a message that merely asks for a summary or recommendation.
5. Hardware lifecycle changes also enforce ONE's named Hardware-manager rule. Show the current and proposed status/destination and explain that ONE synchronizes the protected Hardware inventory before calling `update_procurement_hardware_lifecycle`.
6. Treat attachment list metadata and `get_procurement_attachment` resources as private. Never request or expose a Storage path or download token. Before `delete_procurement_request`, `delete_procurement_comment`, or `delete_procurement_attachment`, re-read, show what will be removed/preserved, obtain explicit confirmation, and pass the exact current title, comment text, or file name together with the fresh `updated_at`.

## Hiring boundary

- Hiring intentionally remains a ONE UI-only capability. There are no Hiring API, MCP, or ONE Codex plugin operations in the current product scope.
- Do not use generic board/item, People-document, file, search, or database tools to inspect or mutate jobs, candidates, applications, interview notes, ratings, talent pools, or candidate documents. Do not infer a Hiring workflow from unrelated tools.
- If the user asks for Hiring automation, explain that it requires a separately approved product decision and direct them to the reviewed Hiring workspace in ONE.

## Documents and e-signature workflow

1. Call `get_signature_request` before every mutation. Treat its `status` and `updatedAt` as the current lifecycle/version boundary; after any mutation, use the returned request or call `refresh_signature_request` before the next action.
2. For a draft, use `update_signature_request` to change recipients, routing, subject, message, reminders, or expiration. Use `add_signature_document` and guarded `remove_signature_document` for source files. Preserve recipient IDs returned by ONE when updating existing recipients so placed fields remain attached.
3. Use `get_signature_request_file` for protected content: select `source` with a document ID for an original, `combined` for one PDF containing all sources, or `signed` only after completion. Do not ask for storage paths or private signing links.
4. Before `send_signature_request`, show the agreement name, current status, recipients and actions, routing order, subject, message, reminders, and expiration, then obtain explicit user confirmation. Before `resend_signature_request`, show the exact recipient and explain that ONE rotates and invalidates the previous private link, then obtain explicit confirmation.
5. Distinguish deletion from voiding. A draft or terminal request can use `delete_signature_request`; a sent or delivered request must use `void_signature_request`. Before removing a document, request, or template, or voiding a request, re-read it and pass its current status, `updatedAt`, and exact current name through the confirmation fields.
6. Never open or complete an external recipient's signing session, submit signature/initial fields, adopt a mark, decline on the recipient's behalf, retrieve a signing token, or read the emulator email outbox. The plugin automates the internal sender lifecycle only.

## Backups and recovery workflow

1. Use `list_backups` for newest-first inventory and `get_backup_metadata` for one snapshot's coverage, protected root names, content policy, and size. These tools intentionally return no workspace or data-root payloads. Follow `nextCursor` when the requested inventory spans multiple pages.
2. Call `create_backup` only when the user explicitly asks for a new backup. Show compact versus full mode and any label before queuing it, then use `get_backup_job` until the job completes or fails. Do not describe a queued job as a completed backup.
3. `export_backup` returns an import-compatible protected JSON resource only for a signed-in ONE owner. Explain that the export contains sensitive operational data, keep it within the user's requested destination, and treat its filename, byte size, SHA-256 checksum, snapshot metadata, and embedded resource as authoritative. MCP exports are limited to 10 MiB; direct the owner to the signed-in Backups panel for a larger file.
4. A Backups service API key may list metadata and inspect its jobs but cannot export snapshot payloads. Never retry a denied export with another credential, a generic board/file tool, or an inferred Firebase path.
5. Import, restore, backup deletion, retention settings, and automatic-backup settings are intentionally not plugin tools because they can replace or destroy system-wide state. Do not simulate them through generic mutations or claim the plugin can perform them; direct the owner to ONE's reviewed Backups panel.

## Remote Machines and administration workflow

1. Use `list_remote_machines` or `get_remote_machine` before proposing a machine action. Machine reads and bookings follow the signed-in person's current Remote Machines scheduler-board grant; booking mutations also enforce ownership unless the person is an administrator.
2. `set_remote_machine_color`, `archive_remote_machine`, and `get_administration_audit` are visible only to a signed-in ONE owner or administrator. API keys, including personal keys, are never an alternative. Report a denial as an access boundary and do not retry through generic board/database tools.
3. Before `set_remote_machine_color`, show the selected visible machine and the exact six-digit hexadecimal color. ONE applies the color to the current server-resolved alias group so the shared scheduler stays consistent.
4. Before `archive_remote_machine`, call `get_remote_machine`, show the current name and every reported alias, and explain that ONE will hide the alias group and clear live presence, sessions, events, metrics, and bookings without uninstalling OneClient. Obtain explicit user confirmation, then pass the exact current machine name as `confirm_machine_name`. Re-read the machine list after success.
5. Use `get_administration_audit` only for read-only review of users, permission groups, materialized board/project grants, invitations, bootstrap administrators, redacted API-key metadata, and findings. Treat its truncation flags and findings as audit evidence, not as authorization to change access.
6. The audit omits API-key hashes, reusable secrets, bridge settings, connector tokens, invitation acceptance secrets, and cloud credentials. Never ask another tool for those values. User/grant mutation, invitation management, API-key creation/revocation, bridge and retention settings, and client install/update/uninstall are intentionally not plugin tools; direct an authorized person to the reviewed ONE workflow.

## Hardware and People documents workflow

1. Hardware asset and document tools require a signed-in person with the Hardware module grant. Start with `list_hardware_inventory`; use `get_hardware_asset` to resolve exact identity, current custodian, status, history, and revision before `update_hardware_asset`, `move_hardware_asset`, or `archive_hardware_asset`. A viewer is read-only; never retry a denied write through a generic board tool or alternate credential.
2. Use `create_hardware_asset` only from explicit asset facts. Preserve serial number, purchase/cost provenance, procurement linkage, quantity, and the requested initial person, office, or unassigned custodian. Re-read the created asset before another mutation.
3. Before `update_hardware_asset`, show the intended non-custody changes and pass the exact current `expected_revision`. Use `move_hardware_asset` for custody changes: show the current and destination custodian, pass the current revision, and reuse one stable `idempotency_key` after an uncertain retry. Re-read after a move.
4. Before `archive_hardware_asset`, explain that custody will be released while the asset and movement history remain auditable. Obtain explicit confirmation and pass the current revision plus the exact asset ID through `confirm_asset_id`.
5. Use `list_hardware_documents` before `get_hardware_document` or deletion. Treat the returned protected MCP resource, filename, media type, size, SHA-256 checksum, and revision as authoritative; never request or expose a Storage path or download token. Upload only supported PDF/image content. Before `delete_hardware_document`, re-list, show the exact file, obtain confirmation, and pass its current revision and exact name.
6. People documents are more sensitive than general People or board data. `list_people_documents`, `get_people_document`, `upload_people_document`, and `delete_people_document` require person OAuth plus the separate **People Documents** module grant; a generic People, board, Hardware, or service-key grant is insufficient. Report a denial as a permission boundary and do not search other tools for the file.
7. Select `owner_type: person` for one People item and provide its exact board, item, document-column, and optional folder IDs. Select `owner_type: company` only for the People board's company-link folders. List first to resolve folder and document IDs, and never infer that a company-link file belongs to a person.
8. Treat People list results as safe metadata only. Use `get_people_document` for protected content and never ask for a URL, file ID, Storage object, or Firebase token. Upload atomically with a declared filename, media type, folder, and bounded base64 bytes. Before `delete_people_document`, re-list, show the exact file, obtain confirmation, and pass its current revision and exact name.

## Finance workflow

1. Read the current transaction, invoice, statement import, settings, account, comment thread, or bill before changing it. Pass the returned decision or record revision to every guarded mutation, and re-read after a successful change before performing another one.
2. Before `finance_update_transaction_decision` or `finance_update_transaction_decisions`, show the affected transaction IDs, exact signed minor-unit amounts and currencies, category/subcategory, cash treatment, project/work allocations, and whether the decision is being applied by an agent. Do not hide partial allocations or infer an unsafe internal-transfer match. ONE records MCP changes as agent-assisted provenance.
3. Finance transaction comments are private internal collaboration available only through the signed-in OAuth session. Use `finance_list_transaction_comments` before editing or deleting a comment. Only its author or a ONE owner/administrator may change it; guarded deletion requires its current revision and exact comment ID. Never copy private comments into exports or public board fields.
4. Statement imports must use bounded source bytes and the declared filename. Treat the returned duplicate detection, checksum, account mapping, batch ID, normalized source, and audit fields as authoritative. Before `finance_clear_statement_imports`, show the current deletion counts and require the exact count-bound confirmation returned by ONE.
5. Before `finance_revise_invoice`, `finance_delete_invoice_draft`, or `finance_send_invoice`, call `finance_get_invoice`. Only an unissued draft can be deleted. Show all monetary changes before revision. Before send, show the immutable invoice number, customer, total, currency, exact To and CC recipients, and attachment, then obtain explicit user confirmation of that exact recipient set. Do not treat a previous send as approval for a new recipient set.
6. Invoice settings and account payment-details updates are owner-only. Show the proposed issuer or payment destination change and obtain confirmation before writing it. Full IBANs and account numbers are accepted only as update input and must never be requested back, displayed, logged, or claimed to be returned; use the redacted values in ONE's response.
7. Use `finance_get_bill_source_file` and `finance_get_statement_import` for protected Finance evidence. Treat their filename, media type, byte size, checksum, and embedded resource as authoritative; never request a storage path.
8. Interactive Google Drive authorization, account connection, folder browsing, verification, and destination creation remain signed-in ONE browser workflows. The plugin may inspect or create exports for an already configured destination, but must never request, expose, or store Google connector access or refresh tokens.

## Accounting & Tax workflow

1. Use `accounting_tax_get_overview` and, when provenance matters, `accounting_tax_get_audit_trail` before changing DGA, obligation, debt, or forecast data. The six lifecycle tools are owner-only through a signed-in person OAuth session; never retry them with a service API key or another credential after an access denial.
2. Before `accounting_tax_save_dga`, read the selected fiscal-year DGA record and current revision. Show the proposed customary-salary, connected borrowing, shareholder current-account, planned dividend, Box 1, Box 2, Box 3, evidence, exact integer minor-unit amounts, and basis-point inputs. This is a complete selected-year replacement, so preserve and send every unchanged current field together with the intended changes and `expected_revision`.
3. Before `accounting_tax_update_obligation` or `accounting_tax_update_debt`, read the current record and pass its exact revision. Keep an obligation in its existing fiscal year, preserve estimate, provision, filed, assessed, and settled stages separately, and never net a receivable obligation against gross company debt.
4. Create obligation and debt records only from explicit source facts. Show the counterparty or tax kind, direction, period or classification, due or maturity dates, status, evidence, and exact minor-unit amounts before writing; do not infer missing filing, assessment, settlement, security, or repayment facts.
5. Call `accounting_tax_refresh_corporate_tax_forecast` only when the user explicitly requests a refresh. Explain that it persists a deterministic Finance-derived, versioned forecast snapshot and never represent the result as a filed return, tax advice, or evidence of payment.
6. Treat the returned audit event, calculation version, source timestamps, revision, actor provenance, and warnings as authoritative. Re-read the overview after each successful mutation before proposing another one.

## Security

- Never request, display, store, or paste an API key for the remote plugin.
- OAuth credentials are managed by the connected AI client and ONE. Do not place them in prompts, source files, logs, or board fields.
- A disabled ONE user or removed board grant takes effect on the next tool call, including calls made with an existing token.
