# Initialize, deploy, and verify

First complete [readiness](prerequisites.md) and inspect [source and builder.yaml](source-and-manifest.md). All placeholders below require actual verified values. Confirm the exact target/action and authorization before a state-changing command; never assume a generic deployment request has selected Builder.

Consult maintained [deployments and versions](https://builder.appservice.azure.com/docs/guides/deployments/), [source control](https://builder.appservice.azure.com/docs/guides/source-control/), and the [CLI reference](https://builder.appservice.azure.com/docs/reference/builder-cli/). Check current [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) before recommending a workflow; confirm installed help rather than guessing syntax when versions differ.

## Choose the source workflow

| Source | Setup and access |
| --- | --- |
| GitHub pushed source | Use help-verified `builder app create` guided setup; verify GitHub user authorization and GitHub App access to the exact repository |
| Local directory or ZIP | Use CLI 0.0.2 or compatible later help; create or reuse an app without connecting GitHub, then explicitly upload source |

Do not make a CLI-only user install an agent skill, and do not make a ZIP-only user authorize GitHub. Both paths need Azure management access and separate approval for creation and deployment. ZIP source requires a valid root `builder.yaml` and is built by Builder, not uploaded as ready-to-run output. GitHub source can use the limited [manifest-generation workflow](source-and-manifest.md#missing-github-manifest) where documented and available. Portal ZIP deployment is not available. Target West US 2 (`westus2`) only.

## Create and connect GitHub source interactively

Read `builder app create --help` first. Current documentation uses guided `builder app create`, which collects the source method, existing resource group, and app target and can connect the selected GitHub source. Newer clients replace `builder init`; do not invoke a removed command. Installed help determines which setup path exists, not the age of a downloaded archive.

From the deliberately selected app checkout, inspect detected repository/branch defaults and choose **GitHub repository**. Guided creation can reuse GitHub CLI sign-in or offer sign-in when needed; do not require a separate source-login step if the selected account already works. Review source, app name, subscription, resource group, and **West US 2** before confirming creation:

```shell
builder app create
```

Creation does not upload uncommitted changes or start deployment. It does not automatically analyze or modify `builder.yaml`. Explicit creation can work outside a Git worktree; source defaults need the app checkout, not a repository initialized in the home directory. Read current help for explicit `--repository`, `--repository-id`, `--branch`, and `--root-directory` options; `--json` and `--yes` are not permission to guess missing values. Creation and source authorization can partially succeed: retain the app and recover only the missing stage.

### Older CLI setup compatibility

Only if installed help still exposes `builder init` rather than guided GitHub creation, use the older path below. Do not mix old and new setup commands or rerun creation for an already provisioned app.

Run initialization from inside an initialized Git worktree for the user's selected app. GitHub sign-in does not select a local repository. Open the app's cloned checkout or change to that directory first; use `git rev-parse --show-toplevel` to verify the location if needed. Do not initialize Git in your home directory to get past the worktree error.

Read `builder init --help`, then start setup from that checkout with the selected Azure target.

`builder init` does not automatically analyze or modify `builder.yaml`. Setup does not require a local manifest, a clean worktree, or a local commit matching the pushed branch. It still requires the selected target, management credentials, and source permissions. This older command is not the current default.

Local manifest validation is optional and separate from initialization. Review intended configuration changes and obtain approval before writing, committing, or pushing them. Preserve dirty/unrelated work; do not reset, stash, or change branches to make setup pass. Deploy only the intended pushed source, not uncommitted local changes.

```shell
builder init
```

Review and confirm interactive values. App provisioning, source connection/authorization, and deployment are distinct effects even when `init` combines setup. Initialization is not an explicit deploy or local-source upload. Reuse matching already-configured source; do not reconnect needlessly. A source change may trigger configured automation where enabled: disclose that effect before writing and inspect the saved policy rather than changing it implicitly. Preserve successful setup if a later step fails and retry only the missing step.

Initialization does not create a saved local app binding: subsequent commands still require app name, subscription, and resource group. For a selected non-root source attachment, inspect current source settings and use the documented `builder app source connect github` flow and its `--root-directory` option only after checking installed help and confirming scope; the init example above must not silently attach the wrong root.

This guide intentionally uses interactive initialization. Noninteractive initialization additionally needs the numeric repository ID, all explicit values, pre-established accounts, and `--yes`; `--yes` cannot approve autodetected values. Do not turn this example into an unattended setup promise.

### Recover partial setup

If app creation succeeds but source authorization fails, report those stages separately and retain the exact app target. Read `app show`, follow the [source-access recovery](prerequisites.md#resolve-account-and-repository-access-precisely), and use the help-verified source-connect command only for the missing connection. Do not create another app, refork the repository, or repeat Microsoft sign-in for a GitHub App access failure.

After the user completes any permission grant and the source connection is authorized, inspect `builder app source connect github --help`. If the installed CLI supports these flags, connect the verified repository to the existing app:

```shell
builder app source connect github --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --repository-id "<numeric-repository-id>" --repository "<owner/repository>" --branch "<branch>" --root-directory "<app-source-root>" --json
```

Here `<app-source-root>` is the repository-relative attachment root (`.` for repository root), not an absolute local path. If source was already saved, verify it instead of reconnecting.

Check the actual saved repository ID, branch, root, and automatic-deployment setting after recovery. A mismatched immutable repository identity is a target decision, not a reason to overwrite the existing app. With source ready and deployment authorized, deploy once; source connection alone is not deployment.

## Deploy pushed source

Read `builder app deploy --help` and inspect the intended source/target before deployment:

```shell
builder app deploy --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Deployment waits by default. Current clients retry transient status reads, not the deployment write; older clients can stop on HTTP 429. If a wait fails or times out, follow [uncertain-write reconciliation](operations.md#uncertain-writes-and-retries) before considering another deployment. A failed local wait does not establish that the server operation failed.

For GitHub or retained-version deployment, use at most one selector:

| Selector | Requested content |
| --- | --- |
| None | Resolve the configured branch; reuse an exact ready match or build a version |
| `--rebuild` | Build a new version from the configured branch |
| `--commit <sha>` | Request an exact full 40-character hexadecimal commit with current desired version configuration |
| `--version <id>` | Activate that eligible retained ready version with frozen configuration |
| `--previous` | Activate the successful different retained version selected from deployment history |

The CLI validates `--commit` as exactly 40 hexadecimal characters and forwards it in the deployment request. Use it for reproducible requested source rather than assuming a previously observed branch HEAD will be selected. Still verify the actual resulting version and serving response. Inspect retained targets and get approval before `--version` or `--previous`; see [operations](operations.md).

For retries of the same deployment intent, `--request-id <id>` is a stable idempotency key; absent an explicit ID, the CLI generates a UUID. Retain that ID with the target and returned operation URL. Changing source/intent while reusing the ID can cause an idempotency conflict. Read [uncertain-write reconciliation](operations.md#uncertain-writes-and-retries) before retrying a timeout, cancellation, or lost response.

If the user intentionally chooses `--no-wait`, capture the returned operation URL and track that operation rather than guessing its result:

```shell
builder app status "<operation-url>" --subscription "<subscription-id>" --wait --json
```

The operation URL must be the actual returned service value under the approved connection settings. Do not fabricate it, send credentials to an untrusted URL, or treat request acceptance as completion.

## Deploy local directory or ZIP source

Read the [CLI ZIP walkthrough](https://builder.appservice.azure.com/docs/guides/deploy-zip-source/) and `builder app create --help` / `builder app deploy --help`. Verify `--source`, or `--source-archive` with `--manifest`, in the installed release. Missing options require an explicitly approved upgrade, not guessed commands.

For a new app, create only the confirmed Azure target:

```shell
builder app create --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --location "westus2" --json
```

Reuse an existing app when that is the intended target. A ZIP-only app can remain `sourceIntegrationState: "NotConfigured"`; do not install the GitHub App or run Git-backed `init` to fix that expected state.

Before uploading, review every included file and obtain approval for the exact source and cloud action. Directory packaging excludes `.git` but does not apply `.gitignore` or automatically exclude `.env`, credentials, dependency caches, or unrelated files. Use a reviewed clean staging directory when necessary; never delete or overwrite the user's originals. Packaging rejects symlinks and special files. Put `builder.yaml` at the selected source root:

```shell
builder app deploy --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --source "<reviewed-source-directory>" --json
```

For a subdirectory, the optional `--root-directory` selects a safe directory within `--source`; it is valid only with directory input. The selected directory becomes the ZIP root. This does not change a durable GitHub source attachment root.

Alternatively, upload an existing ZIP unchanged:

```shell
builder app deploy --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --source-archive "<source-zip-path>" --manifest "<matching-builder-yaml-path>" --json
```

The ZIP must contain root `builder.yaml`, not a parent-folder wrapper. The separate planning manifest must match it byte for byte, including line endings and any BOM. Recreate the ZIP after manifest changes. The compressed limit is **100 MiB** and the UTF-8 manifest limit is **1 MiB**. Directory packaging supports at most 65,535 files, each smaller than 4 GiB; use a reviewed externally created ZIP64 archive for larger input within the compressed limit. POSIX packaging preserves ordinary executable bits; Windows packaging does not, so use a POSIX-created archive when executable permissions matter.

Do not combine either upload selector with `--commit`, `--rebuild`, `--version`, `--previous`, or the other upload selector. Uploading source does not replace or remove an existing durable GitHub connection. To deploy later local changes, supply the upload selector again; omitting it selects configured GitHub source, not the last local directory. Retained-version activation is a separate inspected action.

Keep the actual `requestId`, archive digest, returned operation URL, and version/deployment IDs for recovery. An accepted upload is not a build or deployment success. `SourceUploadDisabled` means the target does not support upload; stop that workflow rather than changing access or silently switching source. Invalid archives and manifest mismatches require corrected packaging, not repeated identical deployments. If observation is interrupted, reconcile the existing operation and app history read-only before retrying the same intent with the same request ID. Changed source/archive bytes are new intent and need a new ID.

## Automation and CI/CD requests

Native GitHub push deployment is supported as an explicit opt-in for the connected branch; connecting source alone does not enable it. Inspect the saved policy and get approval for the exact app/branch before enabling it. An in-progress deployment continues; newer eligible waiting commits replace older waiting commits. A successful push or saved policy is not proof of deployment or serving.

Use **Settings → Deployment Settings → Automatic deployments**, or check `builder app update --help` for `--auto-deploy-enabled` before an approved CLI change:

```shell
builder app update --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --auto-deploy-enabled true --json
```

Changing the policy is a cloud write; pushing to that branch can now trigger build/deployment. Disclose those effects, preserve source/branch selection, and verify actual deployment history. Disable only with separate authorization using the documented policy control.

Native push deployment and an explicit deployment invoked by a customer-owned workflow are different mechanisms. The Portal's **Use GitHub Actions** integration remains **Coming soon**. ZIP flags alone do not establish unattended CI authentication. Before proposing GitHub Actions YAML, locate the current published workflow and authentication guidance for the selected target. Use the CLI/ARM guides to verify source format, target, token audience, idempotency, and completion checks; do not invent a service-principal login option, secret transfer, or a workflow from internal-only instructions.

If the published guidance does not establish the requested automation/authentication path, explain that specific documentation gap rather than claiming all CI/CD is unsupported or asking the user to reverse-engineer product source. Preserve existing workflows, branch protection, and repository rulesets; do not disable them to bypass source publication or deployment errors. Diagnose the reported GitHub permission/ruleset error separately from Builder source installation access.

## Verify service behavior

Inspect the deployed app:

```shell
builder app show --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
```

Distinguish the observed branch SHA, requested commit, built version, activation attempt, active version/deployment, and real HTTP/health response. A moving branch or newer failed attempt does not identify what currently serves.

For ZIP versions, inspect `source.kind` / `source.provider: "uploadedArtifact"` and `source.revision`, which is the archive SHA-256, not a Git commit. Compare the actual uploaded digest and active version; do not require local/remote commit equality for this workflow.

Read the **returned runtime URL**, app state, and actual deployed version. Never synthesize a hostname. Use the user's available HTTP/browser tooling to check real HTTP behavior and the configured app-owned health endpoint, with the app's expected access requirements. Do not guess a `/health` route or confuse management login with visitor sign-in.

A successful build, accepted deployment, or completed operation is insufficient by itself. If HTTP/health verification cannot be performed or fails, state that the app is not verified serving and inspect the relevant history/logs. Do not deploy repeatedly or claim success to conceal a blocked stage.
