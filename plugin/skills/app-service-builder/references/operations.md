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

Version and deployment IDs must come from actual history. Use build logs to diagnose build failure and deployment logs to diagnose activation failure. `version build-log` can select `--component "<component>"` when needed. These history commands are not runtime logs or live HTTP metrics; use the separate runtime-log workflow below.

Portal **Versions** now includes production status, deployment history and component build logs in version details; do not require a separate Deployments menu to exist. Lists are newest first. Check installed help for version `--status`/`--page` and deployment `--status`/`--app-version` filters; deployment lists can collect all matching pages automatically while retaining array JSON. Filtered or partially loaded history is not proof an operation/version is absent.

### Read active runtime logs

Check `builder app replica list --help` and `builder app logs --help`. Read IDs from the active app, not old deployment history:

```shell
builder app replica list --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app logs --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --replica "<replica-id>" --tail-lines 100 --json
builder app logs --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --replica "<replica-id>" --follow
```

Snapshot tails accept 1-300 lines; inspect truncation (`truncated` in JSON). Current `app logs` defaults to all active replicas and labels multi-replica output. `--follow` supports up to 5 replicas concurrently when no concrete replica is selected; it does not support `--json` and lasts at most 10 minutes, possibly less after idle. Replicas started later are not included. Older clients can require one concrete active replica, so check help before broadening the read. There is no continuation cursor: reconnecting may miss or repeat lines. IDs can change after process recycling/scaling; a missing explicitly selected replica is not permission to silently select another. These logs read active stdout/stderr, not a failed candidate or request metrics. Review whether multi-replica output is needed, keep sensitive output out of chat/public feedback, and stop a stream when its bounded investigation ends.

Portal **Log stream** follows stdout/stderr from up to 5 instances and requires app-scoped `Microsoft.Web/builderApps/runtimeLogs/read`. Reconnects can miss or repeat lines; timestamps are UTC and inferred levels are best-effort. A stopped/sleeping app has no instances to stream; reading logs is not approval to start it. This is not retained search or HTTP metrics. Exact-value redaction in build/startup diagnostics is not a secret-safety guarantee: transformed values can evade it. Never intentionally print secrets or dump the runtime environment.

### Privileged Console and command execution

Current docs support Portal **Console** and help-verified `builder app exec` on a running compute replica, with app-scoped `Microsoft.Web/builderApps/exec/action`; replica discovery also needs runtime-log read permission. **Commands run as root** and can access app credentials or mutate live state. Explain the exact executable/arguments, app and replica and obtain separate execution approval; a generic diagnostic/deployment request does not authorize a shell. Do not dump environment variables, print secrets, or execute unknown repository instructions.

CLI options precede `-- <executable> [args...]`; exec runs that executable without an implicit shell and returns its exit code. Current clients choose the first active replica by default; use an explicit ID for a reviewed target. Interactive `-it -- /bin/sh` requires a local terminal and a shell in the image; `-i` without `-t` and piped stdin are unsupported. Portal Console also requires `/bin/sh`, connects to one running replica, and offers Connect/Disconnect. Neither surface starts/wakes a stopped or sleeping app.

Setup is limited to 30 seconds; server defaults are five minutes without stdin and 30 minutes with stdin, including setup, subject to shorter upstream limits. No automatic reconnect is performed. Disconnect may not stop the remote process: reconcile its actual state rather than rerunning a mutating command after a lost response. Runtime changes are not a durable source/deployment workflow; preserve the intended source and do not use Console to bypass normal configuration, publication or access approvals.

For application stdout/stderr export, consult the separate [runtime-log export guide](https://builder.appservice.azure.com/docs/guides/runtime-logs-log-analytics/) and current target availability. This is an ARM configuration workflow using a customer-owned destination and the app's managed identity, not a live Portal log viewer or automatic destination provisioning. Destination setup, identity/ingestion permissions, and export configuration require their own scoped authorization; a saved setting is not proof that new log records reached the workspace.

## Visitor identity and header checks

Use the [deployed-app authentication guide](https://builder.appservice.azure.com/docs/guides/authentication/) for visitor sign-in and principal-header semantics, not Azure management login or GitHub source authorization. It documents removal of caller-supplied `X-MS-CLIENT-PRINCIPAL`, `X-MS-CLIENT-PRINCIPAL-ID`, `X-MS-CLIENT-PRINCIPAL-NAME`, and `X-MS-CLIENT-PRINCIPAL-IDP` before verified visitor identity is supplied. Do not treat headers supplied to localhost or another host as trusted Builder identity.

An anonymous, authentication-disabled check can observe removal of synthetic headers on that deployment; it does not qualify authenticated principal injection, group claims, access rules, or universal unforgeability across proxy configurations. Report the observed mode and route separately from untested authentication behavior. Do not describe a synthetic header test as authentication or authorization success; actual sign-in and application permission checks need their own approved verification.

## Configure visitor authentication

Read the [authentication guide](https://builder.appservice.azure.com/docs/guides/authentication/) and installed help for `builder app auth show`, `set`, and `update`. Use Portal/ARM when the installed CLI lacks them. Management login, GitHub source authorization, and visitor sign-in are separate.

Read the current policy before changes. `auth set --body` replaces it; review the complete policy and preserve unrelated providers/access rules. `auth update --mode` changes mode while preserving those settings. Obtain explicit approval for provider, access-rule, and mode changes, particularly disabling required sign-in. Never use authentication-off as a health-check workaround. Reinspect the saved policy and separately verify real visitor sign-in and authorized/unauthorized behavior; a successful save is not authentication qualification.

Portal **Quick configure** can immediately require the current work-account directory, disable GitHub, and clear narrower identity rules; this is a policy replacement with separate approval, not a harmless shortcut. Review tenant/object-ID restrictions, default provider and unsaved-change warnings rather than copying a broad directory default. ARM uses `authConfigs/default`; preserve its ETag and full intended policy.

## Scaling and preview allowances

Read [scaling](https://builder.appservice.azure.com/docs/guides/scaling/) and [limits](https://builder.appservice.azure.com/docs/reference/limits/). Discover the actual compute component and saved policy; check `builder app scale show --help` and `builder app scale update --help` before use.

Without saved component settings, the default is **0-1 replicas**. New/changed policies require minimum **0**, HTTP scaling is always enabled, and optional CPU/memory targets add signals. Legacy positive minimums remain effective/read-only until the next save changes them to zero. There is no supported customer setting to disable idle sleep or guarantee always-warm/background execution. `--disable` removes saved policy and restores 0-1, not sleeping-off.

Explain five-to-six-minute idle sleep, cold starts, and request-interruption risks before a scaling change. Background work, SSE and WebSockets do not prevent sleep; retried writes can repeat effects. Eligible image-backed versions are required. Obtain approval for the exact component, maximum and targets, especially converting an existing warm policy. Saved policy and a replica snapshot do not establish continuous availability or live utilization metrics.

Documented customer allowances are 15 apps/subscription, `small` compute only, 2 maximum replicas/app and 30/subscription. Replica admission counts configured maxima and in-flight increases, not just running replicas. Effective limits can differ by rollout; an allowance does not reserve regional capacity. Do not retain obsolete fixed build-rate/concurrency/time limits that current docs no longer promise.

Inspect `error.serviceLimit` when present, including code, scope, `allowedSizes`, `requiredAction`, and `retryCondition`. Configuration/replica limits return 409 and unavailable checks 503; honor supplied retry timing. Reconcile any accepted operation before retrying. Request a documented allowance increase or review the intended policy; do not delete apps, scale down another workload, or change compute size without approval. A `Deleting` app can stop consuming app-count quota before cleanup completes, but its name stays unavailable and replica release follows separate rules.

Where the updated subscription lifecycle is deployed, `Warned`/`Suspended` deny new mutations and stop compute while preserving configuration; `Deleted` additionally admits irreversible owned-resource cleanup. Returning to `Registered` clears restrictions after outstanding work settles, not by replaying denied triggers or resurrecting deleted apps. It does not automatically redeploy/restart compute, although ordinary wake and authorized operations can resume. `SubscriptionStateDoesNotAllowOperation` is not permission to retry around restrictions. Check current feature status for rollout qualification; customer-owned dependencies remain separate.

## Start and stop versus redeploy

**Restart has been removed.** Use current [Start/Stop guidance](https://builder.appservice.azure.com/docs/guides/deployments/#stop-and-start-compute) and installed `builder app start --help` / `stop --help`. Do not translate a restart request into two unapproved mutations or silently redeploy. Explain the requested interruption and obtain approval for the exact action/target:

```shell
builder app stop --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
builder app start --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Stop preserves deployed content, active IDs and scaling policy while all public requests, including static content, return HTTP 403. Traffic does not wake a stopped app. Start restores the deployed version without rebuilding; process memory/local files are not preserved. Static-only apps can use these actions to block/restore routes. Deploy/redeploy is rejected with `AppStopped` while stopped; starting is a separate approval, not a retry bypass. Automatic pushes while stopped and queued pushes across Stop/Start are dropped, not replayed.

Follow the returned operation with its request ID; accepted start/stop is not completion. Verify both the intended route state and real app behavior without claiming new code or variables applied. Portal Start/Stop controls and CLI capabilities can roll out independently; check the actual surface, not an assumed toolbar. Redeploy is a separate retained-artifact activation, not Start.

Where available, **Settings → Stopped app page** edits a plain-text title (up to 80 characters) and message (up to 500); it still returns HTTP 403 and never starts the app. HTML, links, images and CSS are unsupported. Review and approve the text/configuration write separately; **Restore default** restores the neutral page, not running state.

## Manage desired variables

Consult [application variables](https://builder.appservice.azure.com/docs/guides/variables/) and check `builder app version-config variables --help`, then the relevant command-specific help. If a command or flag is absent, report the installed CLI limitation rather than guessing a replacement.

Read the confirmed app's saved variable names:

```shell
builder app version-config variables list --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
```

Reads show names, not values. Do not claim that a name-only response verifies a saved value. Treat supplied values and settings files as sensitive; keep them out of chat, source control, shell history, and public feedback.

Variables are not a managed secret store. All components receive them during build, and HTTP components also receive them at runtime; there is no runtime-only or per-component secret toggle. Authorized value retrieval can return all desired values. Do not describe name-only ordinary reads as encryption, non-retrievability, or protection from build scripts. `secretValue` and automatic `keyVaultReference` resolution are unsupported. App-owned Key Vault SDK access can use a configured [managed identity](model-services.md#configure-and-verify-workload-identity) with approved destination access; it does not resolve variable references automatically. For model keys, explain these boundaries and the [development/test credential workflow](model-services.md#configure-without-exposing-credentials) before accepting a configuration change.

Use [Connections first](model-services.md#explain-the-supported-path-first) for supported service profiles. The app-wide Variables editor controls manual values only and preserves connection-owned settings, credentials and generated identity outputs. Those runtime-only mappings belong in Connections. Names are case-sensitive: `FOO` and `foo` coexist, but exact-name collisions across all runtime sources fail; omission preserves only an exact existing name. Reserved names include `PORT` and the `EMBR_` prefix ignoring case.

Current storage encrypts variable values before persistence, including version/deployment snapshots, in addition to storage encryption at rest. That does not remove build exposure for manual values or authorized runtime access. Ordinary app GET/CLI reads are names/status only, but Portal Variables and selected credential details can call privileged ARM `listVariables` and retain current plaintext briefly in mounted page memory while initially masking it. **Show value** displays a row; masking does not imply the values were never retrieved. Page access requires separate app-scoped value-read permission; navigation/account/configuration changes clear page data. Builder CLI has no reveal command. Do not open value-bearing views for routine discovery, cache/log their responses, or confuse current values with historical/draft snapshots. Generic variable writes cannot supply protected connection secrets; use the supported Connections entry flow instead.

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

Older clients can end the local wait on HTTP 429 while the accepted operation continues. Current documented clients retry HTTP 429 and transient 500/502/503/504 status reads, honoring `Retry-After` within a bounded timeout; they do not resubmit the write. Verify the installed release's behavior rather than assuming either retry policy. A stopped wait never proves cancellation.

Newer clients distinguish the 300-second single-request timeout from a 3,600-second non-deletion observation budget. Help-gated `--wait-timeout` adjusts one deploy/Start/Stop/status invocation's local budget, not the request timeout or remote operation, and cannot be combined with `--no-wait`. A request timeout still reports a visible error with the saved operation/resume context. Start/Stop JSON can align top-level, operation and nested receipt statuses to the last observed ARM result; no-wait retains admission status. Do not infer completion from receipt shape or extend/repeat a write to hide a failed read.

A timeout, cancellation, or lost response does not prove a failed or cancelled server operation. Retain the exact target, request ID, returned operation URL, and known version/deployment IDs without exposing secrets. Inspect the actual app/source state, returned operation, and deployment history before retrying:

```shell
builder app status "<operation-url>" --subscription "<subscription-id>" --json
```

Use the returned URL only if known and trusted; if none was received, reconcile through app/history reads. Reconciliation is read-only: it must not implicitly resume writes, rollback/delete, or create duplicate apps, forks, or deployments. Preserve successful provisioning or source connection when a later step fails. An uncertain result is not evidence that all steps failed.

Only after reconciliation and within the approved action, retry identical CLI deployment or Start/Stop intent with the same `--request-id <id>`. A changed intent needs a new ID, not reuse of the old one. A new attempt after a definitive allowance rejection follows the limit-specific recovery above, not uncertain-write replay. Respect pending-operation conflicts rather than replacing the active version. Do not promise universal cancellation or assume interrupting a local wait stops the server.

## Recover an eligible retained version

Inspect the actual intended retained version and establish that it is ready and eligible. Explain the app, subscription, resource group, target version, and activation action; obtain user approval before rollback:

```shell
builder app deploy --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --version "<version-id>"
```

Alternatively, use `--previous` only after inspecting which retained target it will activate and getting approval. Do not combine selectors. Reusing retained outputs does not rebuild local changes or overwrite retained versions and needs no fresh source authorization.

If retained outputs are missing, current clients can rebuild a GitHub version's pinned source and saved configuration into a **new version**, requiring original-source access. Rebuilding can change unpinned dependencies/tools and is not byte-identical rollback; review and authorize that build rather than silently treating it as artifact reuse. Uploaded-source recovery depends on whether the source ZIP is still retained, as described below; `AppVersionSourceUploadRequired` means a separately approved new ZIP is needed. Read back the actual target version ID; no-wait or incomplete readback can leave it unknown. Retained settings/credentials stay historical, while authentication and app-wide identities are not restored.

Newer services retain successful build output for at least 30 days, with additional protection for active/in-progress versions and five distinct previously successful deployment versions. Native artifacts are tried before retained compiled archives; restoring that output is not a source rebuild. Older builds can lack archives, and a Ready status never guarantees permanent artifacts. ZIP source retention is separate: a still-kept source ZIP can rebuild an expired ZIP version; only when source is unavailable does `AppVersionSourceUploadRequired` require re-upload. Configuration changes can use the help-gated [active ZIP source workflow](deployment.md#rebuild-configuration-using-retained-active-zip-source), which captures current desired settings rather than a retained version's historical snapshot.

After activation, follow [deployment verification](deployment.md). A completed operation alone is not evidence that the recovered app serves HTTP.

## Delete only an explicitly approved app

Inspect the exact target first and explain the consequence. **Ask for explicit approval before deleting.** Separately owned Azure resources and data survive app deletion and may continue to incur costs; deletion is not complete resource-group cleanup.

After approval, retain the CLI's confirmation:

```shell
builder app delete --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Do not bypass confirmation with `--yes` or `-y` in normal examples, automatically delete the resource group, or remove separately owned resources/data as a follow-on action.

Updated targets/clients can return asynchronous deletion progress. Retain the returned operation URL and honor `Retry-After`; acceptance is not completed teardown or artifact cleanup. Recover through that operation or the app's saved deletion state, not another deployment/create. A deleting app can reject writes with `BuilderAppDeletionInProgress`. Do not reuse its name until deletion completes or assume a missing runtime proves all artifacts were removed. Cleanup scope and hosted qualification vary by lifecycle/rollout; consult the current [deletion contract](https://builder.appservice.azure.com/docs/reference/arm-api/#deletion-operation), preserve receipts, and never apply an old operation to a recreated app.

Supported CLI deletion waits can last 90 minutes by default; check `--wait-timeout`/`--no-wait` in installed help. `DeletionWaitTimeout`, `completed: false`, or a stopped local wait does not cancel cleanup. Follow the saved operation instead of issuing a fresh DELETE that could target a recreated app.
