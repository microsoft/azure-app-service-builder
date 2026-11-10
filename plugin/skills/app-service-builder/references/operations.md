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

### Read active runtime logs

Check `builder app replica list --help` and `builder app logs --help`. Read IDs from the active app, not old deployment history:

```shell
builder app replica list --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app logs --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --replica "<replica-id>" --tail-lines 100 --json
builder app logs --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --replica "<replica-id>" --follow
```

Snapshot tails accept 1-300 lines; inspect truncation (`truncated` in JSON). `--replica all` is a deliberate multi-replica snapshot, not a follow selector. Follow requires one concrete active replica, does not support `--json`, and lasts at most 10 minutes, possibly less after idle. There is no continuation cursor: reconnecting may miss or repeat lines. IDs can change after restarts/scaling; a missing replica is not permission to silently select another. These logs read active stdout/stderr, not a failed candidate, request metrics, or Portal streaming. Keep sensitive output out of chat/public feedback and stop a stream when its bounded investigation ends.

For application stdout/stderr export, consult the separate [runtime-log export guide](https://builder.appservice.azure.com/docs/guides/runtime-logs-log-analytics/) and current target availability. This is an ARM configuration workflow using a customer-owned destination and the app's managed identity, not a live Portal log viewer or automatic destination provisioning. Destination setup, identity/ingestion permissions, and export configuration require their own scoped authorization; a saved setting is not proof that new log records reached the workspace.

## Visitor identity and header checks

Use the [deployed-app authentication guide](https://builder.appservice.azure.com/docs/guides/authentication/) for visitor sign-in and principal-header semantics, not Azure management login or GitHub source authorization. It documents removal of caller-supplied `X-MS-CLIENT-PRINCIPAL`, `X-MS-CLIENT-PRINCIPAL-ID`, `X-MS-CLIENT-PRINCIPAL-NAME`, and `X-MS-CLIENT-PRINCIPAL-IDP` before verified visitor identity is supplied. Do not treat headers supplied to localhost or another host as trusted Builder identity.

An anonymous, authentication-disabled check can observe removal of synthetic headers on that deployment; it does not qualify authenticated principal injection, group claims, access rules, or universal unforgeability across proxy configurations. Report the observed mode and route separately from untested authentication behavior. Do not describe a synthetic header test as authentication or authorization success; actual sign-in and application permission checks need their own approved verification.

## Configure visitor authentication

Read the [authentication guide](https://builder.appservice.azure.com/docs/guides/authentication/) and installed help for `builder app auth show`, `set`, and `update`. Use Portal/ARM when the installed CLI lacks them. Management login, GitHub source authorization, and visitor sign-in are separate.

Read the current policy before changes. `auth set --body` replaces it; review the complete policy and preserve unrelated providers/access rules. `auth update --mode` changes mode while preserving those settings. Obtain explicit approval for provider, access-rule, and mode changes, particularly disabling required sign-in. Never use authentication-off as a health-check workaround. Reinspect the saved policy and separately verify real visitor sign-in and authorized/unauthorized behavior; a successful save is not authentication qualification.

## Scaling and preview allowances

Read [scaling](https://builder.appservice.azure.com/docs/guides/scaling/) and [limits](https://builder.appservice.azure.com/docs/reference/limits/). Discover the actual compute component and saved policy; check `builder app scale show --help` and `builder app scale update --help` before use.

Positive minimums keep warm replicas and need CPU/memory targets or HTTP scaling. Minimum zero opts eligible image-backed apps into scale to zero and requires HTTP scaling. Explain cold starts and request-interruption risks before changing policy; do not enable sleeping for an unsuitable workload. Obtain approval for the exact component, min/max, and targets. Saved policy and a replica snapshot do not establish continuous availability or live utilization metrics.

Documented customer allowances are 15 apps/subscription, `small` compute only, 2 maximum replicas/app and 30/subscription, 1 concurrent build/app and 2/subscription, and a 10-minute build duration. Build starts, scale increases, and non-build activations have separate rolling allowances of 10/app and 30/subscription per hour. Replica admission counts configured maxima and in-flight increases, not just running replicas. Effective limits can differ by rollout; an allowance does not reserve regional capacity.

Inspect `error.serviceLimit` when present, including code, scope, `allowedSizes`, `retryAt`, `requiredAction`, and `retryCondition`. Configuration/replica limits can return 409, concurrency/rate limits 429, build timeouts 408, and unavailable checks 503. A deployment can be accepted before its build fails a limit check: reconcile the operation first. Wait for the indicated refill/slot or request an allowance through documented support; do not delete apps, scale down another workload, or change compute size without approval. Failed/timed-out builds still consume starts. After a definitive allowance failure, an approved new attempt uses a new request ID after the stated delay; replaying the old ID does not admit a fresh build.

Where the updated subscription-state policy is deployed, `SubscriptionStateDoesNotAllowOperation` denies new mutations for `Warned`/`Suspended` subscriptions, including automatic triggers. Do not retry around it or promise denied work will replay. Authorized reads/deletion and already accepted work have separate semantics; do not infer running apps stopped. Check current feature status for rollout qualification and report the actual error.

## Restart versus redeploy

Check current [deployment guidance](https://builder.appservice.azure.com/docs/guides/deployments/) and `builder app restart --help` before offering restart; newer source implementation does not prove a published CLI or target supports it. If unavailable, report the gap rather than silently deploying instead.

Restart resets the existing active compute runtime without building, creating a version, or activating a replacement deployment. Redeploy activates retained artifacts in a replacement runtime; deploy resolves source/selects or builds a version. Choose the operation matching the problem and obtain separate approval for its disruption and target:

```shell
builder app restart --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Static-only apps return `RestartNotSupported`; a mixed app can restart its compute runtime. Retain the request ID and actual operation URL, follow that operation, and verify the configured health route and real app behavior. Restart should preserve active version/deployment/runtime IDs; do not claim new source or changed variables were applied.

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

Older clients can end the local wait on HTTP 429 while the accepted operation continues. Current documented clients retry HTTP 429 and transient 500/502/503/504 status reads, honoring `Retry-After` within a bounded timeout; they do not resubmit the write. Verify the installed release's behavior rather than assuming either retry policy. A stopped wait never proves cancellation.

A timeout, cancellation, or lost response does not prove a failed or cancelled server operation. Retain the exact target, request ID, returned operation URL, and known version/deployment IDs without exposing secrets. Inspect the actual app/source state, returned operation, and deployment history before retrying:

```shell
builder app status "<operation-url>" --subscription "<subscription-id>" --json
```

Use the returned URL only if known and trusted; if none was received, reconcile through app/history reads. Reconciliation is read-only: it must not implicitly resume writes, rollback/delete, or create duplicate apps, forks, or deployments. Preserve successful provisioning or source connection when a later step fails. An uncertain result is not evidence that all steps failed.

Only after reconciliation and within the approved action, retry identical CLI deployment or supported restart intent with the same `--request-id <id>`. A changed intent needs a new ID, not reuse of the old one. A new attempt after a definitive allowance rejection follows the limit-specific recovery above, not uncertain-write replay. Respect pending-operation conflicts rather than replacing the active version. Do not promise universal cancellation or assume interrupting a local wait stops the server.

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

Updated targets/clients can return asynchronous deletion progress. Retain the returned operation URL and honor `Retry-After`; acceptance is not completed teardown or artifact cleanup. Recover through that operation or the app's saved deletion state, not another deployment/create. A deleting app can reject writes with `BuilderAppDeletionInProgress`. Do not reuse its name until deletion completes or assume a missing runtime proves all artifacts were removed. Cleanup scope and hosted qualification vary by lifecycle/rollout; consult the current [deletion contract](https://builder.appservice.azure.com/docs/reference/arm-api/#deletion-operation), preserve receipts, and never apply an old operation to a recreated app.
