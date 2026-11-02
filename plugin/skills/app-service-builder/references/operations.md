# Inspect, recover, and delete

Read command-specific help first. Every command below needs actual target values. Do not publish raw account details, operation URLs, or confidential logs in public feedback.

Consult maintained [logging and monitoring](https://builder.appservice.azure.com/docs/guides/logging-and-monitoring/), [troubleshooting](https://builder.appservice.azure.com/docs/troubleshooting/), [deployment semantics](https://builder.appservice.azure.com/docs/guides/deployments/), and the [CLI reference](https://builder.appservice.azure.com/docs/reference/builder-cli/). Use [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) to distinguish supported diagnostics from planned runtime features.

## Inspect apps and history

First distinguish local manifest diagnostics from cloud build failure, activation failure, and actual runtime HTTP behavior. Use [manifest validation](source-and-manifest.md#validate-builderyaml) to check an existing file and inspect its actual diagnostics and error envelope. Only run optional build validation after explaining script execution and obtaining approval. Local validation does not prove successful hosted activation or serving.

| Failing stage | Evidence to inspect before changing source |
| --- | --- |
| CLI source upload / checkout | Selected directory/ZIP, root manifest and exact matching bytes, upload status, and checkout error; not static output publication |
| Build / static publication | Version build log, resolved component roots/output, and generated public file inventory; exclude unintended repository files from publication |
| Activation / runtime health | Deployment log, supported runtime, actual startup/listener, declared port, and implemented health route |
| Serving / application behavior | Active version and returned URL, expected response content, nested routes/assets, and any dependency operation |

For a generic **static asset upload failed** message, do not infer a whole-repository upload, file-count/size limit, timeout, or port problem from the wording alone. Check which stage failed and whether the resolved static `output` contains only intended public assets; preserve the service code and sanitized diagnostic details. Correct a confirmed output selection without stripping required source/build inputs from a source ZIP. If diagnostics do not expose a cause, report that gap and the unverified stage rather than claiming a recipe or retry fixed the deployment.

```shell
builder app list --subscription "<subscription-id>" --json
builder app show --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app version list --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app version show "<version-id>" --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app version build-log "<version-id>" --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app deployment list --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app deployment show "<deployment-id>" --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app deploymentlog "<deployment-id>" --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
```

Version and deployment IDs must come from actual history. Use build logs to diagnose build failure and deployment logs to diagnose activation failure. `version build-log` can select `--component "<component>"` when needed. These commands are not runtime log streaming or live HTTP metrics; do not invent equivalent CLI commands.

For application stdout/stderr export, consult the separate [runtime-log export guide](https://builder.appservice.azure.com/docs/guides/runtime-logs-log-analytics/) and current target availability. This is an ARM configuration workflow using a customer-owned destination and the app's managed identity, not a live Portal log viewer or automatic destination provisioning. Destination setup, identity/ingestion permissions, and export configuration require their own scoped authorization; a saved setting is not proof that new log records reached the workspace.

## Visitor identity and header checks

Use the [deployed-app authentication guide](https://builder.appservice.azure.com/docs/guides/authentication/) for visitor sign-in and principal-header semantics, not Azure management login or GitHub source authorization. It documents removal of caller-supplied `X-MS-CLIENT-PRINCIPAL`, `X-MS-CLIENT-PRINCIPAL-ID`, `X-MS-CLIENT-PRINCIPAL-NAME`, and `X-MS-CLIENT-PRINCIPAL-IDP` before verified visitor identity is supplied. Do not treat headers supplied to localhost or another host as trusted Builder identity.

An anonymous, authentication-disabled check can observe removal of synthetic headers on that deployment; it does not qualify authenticated principal injection, group claims, access rules, or universal unforgeability across proxy configurations. Report the observed mode and route separately from untested authentication behavior. Do not describe a synthetic header test as authentication or authorization success; actual sign-in and application permission checks need their own approved verification.

## Manage desired variables

Consult [application variables](https://builder.appservice.azure.com/docs/guides/variables/) and check `builder app version-config variables --help`, then the relevant command-specific help. If a command or flag is absent, report the installed CLI limitation rather than guessing a replacement.

Read the confirmed app's saved variable names:

```shell
builder app version-config variables list --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
```

Reads show names, not values. Do not claim that a name-only response verifies a saved value. Treat supplied values and settings files as sensitive; keep them out of chat, source control, shell history, and public feedback.

Variables are not a managed secret store. All components receive them during build, and HTTP components also receive them at runtime; there is no runtime-only or per-component secret toggle. Authorized value retrieval can return all desired values. Do not describe name-only ordinary reads as encryption, non-retrievability, or protection from build scripts. `secretValue` and automatic `keyVaultReference` resolution are unsupported. App-owned Key Vault SDK access can use a configured [managed identity](model-services.md#configure-and-verify-workload-identity) with approved destination access; it does not resolve variable references automatically. For model keys, explain these boundaries and the [development/test credential workflow](model-services.md#configure-without-exposing-credentials) before accepting a configuration change.

For a requested update, explain the affected names and obtain approval before writing. Use an approved local JSON file containing an object of variable names to string values:

```shell
builder app version-config variables update --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --settings "@<settings-json-path>" --json
```

Use the user's actual approved file; do not read unrelated secret files or create a settings file without permission. The update merges supplied variables with the existing configuration. Delete only an explicitly approved name:

```shell
builder app version-config variables delete --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --variable-name "<variable-name>" --json
```

Variable writes change desired configuration without creating a version or deployment. A separate approved build/deployment captures the new values; activating a retained version keeps its frozen configuration. Do not deploy automatically after a variable edit.

## Uncertain writes and retries

A transient HTTP 429 during status polling can end the local wait while the accepted operation continues. Do not assume automatic status-read retries or repeat a deployment to work around throttling.

A timeout, cancellation, or lost response does not prove a failed or cancelled server operation. Retain the exact target, request ID, returned operation URL, and known version/deployment IDs without exposing secrets. Inspect the actual app/source state, returned operation, and deployment history before retrying:

```shell
builder app status "<operation-url>" --subscription "<subscription-id>" --json
```

Use the returned URL only if known and trusted; if none was received, reconcile through app/history reads. Reconciliation is read-only: it must not implicitly resume writes, rollback/delete, or create duplicate apps, forks, or deployments. Preserve successful provisioning or source connection when a later step fails. An uncertain result is not evidence that all steps failed.

Only after reconciliation and within the approved action, retry identical CLI deployment intent with the same `--request-id <id>`. A changed intent needs a new ID, not reuse of the old one. Respect pending-operation conflicts rather than replacing the active version. Do not promise universal cancellation or assume interrupting a local wait stops the server.

## Recover an eligible retained version

Inspect the actual intended retained version and establish that it is ready and eligible. Explain the app, subscription, resource group, target version, and activation action; obtain user approval before rollback:

```shell
builder app deploy --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --version "<version-id>"
```

Alternatively, use `--previous` only after inspecting which retained target it will activate and getting approval. Do not combine selectors. Retained-version activation does not rebuild local changes or overwrite retained versions. Do not require fresh source authorization merely to activate retained content.

After activation, follow [deployment verification](deployment.md). A completed operation alone is not evidence that the recovered app serves HTTP.

## Delete only an explicitly approved app

Inspect the exact target first and explain the consequence. **Ask for explicit approval before deleting.** Separately owned Azure resources and data survive app deletion and may continue to incur costs; deletion is not complete resource-group cleanup.

After approval, retain the CLI's confirmation:

```shell
builder app delete --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Do not bypass confirmation with `--yes` or `-y` in normal examples, automatically delete the resource group, or remove separately owned resources/data as a follow-on action.
