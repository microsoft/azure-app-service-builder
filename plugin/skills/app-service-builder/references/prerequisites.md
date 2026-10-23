# Prerequisites and readiness

App Service Builder is a **Private Preview** for **development/test**, not production. Establish readiness from installed tooling, selected resources, and actual access checks, not an eligibility questionnaire.

Consult [Private Preview guidance](https://builder.appservice.azure.com/docs/resources/preview/) for prerequisites and limitations; check [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) before recommending a workflow. Verify command syntax against the [CLI reference](https://builder.appservice.azure.com/docs/reference/builder-cli/) and installed help. Report disagreements or unavailable docs rather than guessing feature support.

## Install Builder CLI

Use an already-installed official `builder` CLI when available. Otherwise obtain the portable `azure-builder-cli-<version>.tgz` archive from the [official CLI releases](https://github.com/microsoft/azure-app-service-builder/releases) and follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/). Use the same archive on Windows, Linux, and macOS with Node.js 22 or later, including npm.

Use the CLI release asset, not GitHub's automatic source-code ZIP or tarball. When an agent downloads the CLI for a user, compare it with the provided published SHA-256 checksum before installing and stop on a mismatch. If the asset or trusted checksum cannot be found, report the exact missing release artifact and link to the official releases page rather than guessing a version or download URL.

The CLI 0.0.1 preview assets are the [portable CLI archive](https://github.com/microsoft/azure-app-service-builder/releases/download/builder-cli-v0.0.1-preview.1/azure-builder-cli-0.0.1.tgz) and its [SHA-256 checksum](https://github.com/microsoft/azure-app-service-builder/releases/download/builder-cli-v0.0.1-preview.1/azure-builder-cli-0.0.1.tgz.sha256).

After approval to install the downloaded archive:

```shell
npm install --global "<path-to-downloaded-file.tgz>"
builder --version
builder --help
```

Use the actual approved local file, not the placeholder path. Do not extract the archive, guess a registry package or download URL, or install/upgrade tooling automatically. npm still needs registry access for JavaScript dependencies.

### Match the user's platform

Detect the operating system and active shell before choosing commands. Use PowerShell-compatible commands on Windows and POSIX commands only in an actual POSIX shell; do not require WSL, Bash, `sha256sum`, or `jq` just to install the portable CLI. Quote paths with spaces, including Windows paths. Use separate commands when shell chaining syntax is unavailable.

Checksum verification must compare the archive's SHA-256 with the trusted published digest, not the checksum file's own hash. GitHub release asset metadata may include the archive digest. If using the companion checksum file, accept LF or CRLF and parse its 64-hex-digit digest rather than comparing the entire line or executing its contents. Use available native hashing tools (PowerShell `Get-FileHash`, macOS `shasum -a 256`, Linux `sha256sum`) or Node's built-in crypto; no extra package is needed. A formatting difference is not a hash mismatch; an actual mismatch stops installation.

A compatible .NET 10 runtime is required only for local `builder manifest` commands. Login, initialization, and deployment work without .NET. The analyzer is included in the archive and does not require a separate installation. Its generated `Embr.BuildAnalyzer.runtimeconfig.json` specifies the runtime requirement; a .NET SDK is not required.

Before local manifest commands, keep the compatible runtime on PATH and inspect:

```shell
dotnet --list-runtimes
```

If the runtime is missing or incompatible, report the actual requirement and stop that local command rather than automatically installing a runtime or a different analyzer. This does not block ordinary CLI login, setup, or deployment.

Require local Git and GitHub CLI (`gh`) for source operations. If deployment prerequisites are absent or too old, report them and stop deployment rather than installing or upgrading them automatically.

Verify access to the selected subscription and resolve the app location from existing configuration or the user's choice. Use an **existing resource group** for CLI initialization. If a requested group is missing, offer existing groups from the selected subscription; do not require the user to know another name. Creating a group is a separate, explicitly authorized operation, not an effect of `builder init`. The documented Portal creation flow can create a group; do not call an existing group a universal product requirement. Do not invent onboarding, regions, endpoints, or configuration commands.

## Local manifest validation

Check `builder --help`, then `builder manifest --help`, and the relevant command help before invocation. The CLI checks an existing `builder.yaml`; it does not create or modify it. Inspect `builder manifest validate --help` for the supported path argument, `--json`, and optional `--build`.

If validation or a flag is unavailable, report the installed CLI limitation rather than inventing a replacement command. Local validation is optional; it is not a prerequisite for app setup. See [manifest validation](source-and-manifest.md#validate-builderyaml) for the existing-file workflow.

Public docs remain support/availability authority; installed help is command syntax authority. Surface any mismatch rather than proceeding on assumptions.

Validation is local and read-only. Only optional build validation executes repository build scripts; it needs separate execution approval. Neither mode proves hosted runtime activation or serving success.

## Read-only readiness checks

Local code and manifest inspection does not require Git initialization, sign-in, or a source connection. Do not create a repository or connect accounts just to read files. For cloud work, inspect local tooling and account state in the deliberately selected checkout:

```shell
node --version
git --version
gh --version
builder --help
builder account show
builder doctor --help
builder doctor --json
```

Read individual diagnostic statuses. Without an explicit app target, `doctor` can skip app-specific checks; that does not prove subscription, source, or GitHub App access. Once a target exists, inspect help and rerun with its supported app/subscription/resource-group/repository selectors.

### Discover the Azure target before asking

Use the user's selected context, not an arbitrary subscription inferred from account names. If they ask for the default subscription and Azure CLI is already installed, inspect `az account show` with a projection of ID, name, and tenant; do not run `az account set`. Azure CLI and Builder have separate sessions, so verify the selected tenant and actual Builder access rather than assuming the default is authorized for Builder.

If Azure CLI is unavailable, use an available authenticated Azure resource tool or the Builder Portal to discover subscription and resource-group choices. Do not install Azure CLI just for discovery or invent a Builder subscription-list command. If discovery cannot resolve the requested default, state that limitation and ask for the missing non-secret target.

With Azure CLI already available, these are read-only discovery examples; substitute the resolved subscription ID and requested group, and inspect errors as well as output:

```shell
az account show --query "{id:id,name:name,tenantId:tenantId}" --output json
az group show --subscription "<subscription-id>" --name "<resource-group>" --query "{id:id,name:name,location:location}" --output json
az group list --subscription "<subscription-id>" --query "[].{id:id,name:name,location:location}" --output json
```

List or read resource groups in that selected subscription before provisioning an app. Check the exact requested group first; distinguish not found from denied access or a failed lookup. Reuse its verified name and ID, or present discovered alternatives. An empty or failed read does not authorize group creation.

Resolve the app location from an existing app, saved target configuration, or the user's region choice, not the resource group's metadata location. Check current runtime docs and the selected sample yourself; do not ask the user to certify runtime availability. There is no published Builder region matrix: ordinary Azure region/provider listings do not establish Builder runtime activation. Explain any specific documented target limitation, but do not turn a missing region matrix into an approval questionnaire. For an otherwise documented workflow, proceed within the user's authorized action and inspect the actual service result; a successful build still does not prove activation or serving.

The intended/selected account, verified identity, and actual target access are different checks. Do not request sign-in if the existing context is already correct. Preserve machine-wide account configuration: do not silently switch global CLI accounts or reuse another account's credential. Do not change tenants, subscriptions, or connections silently. If the confirmed management context needs authentication, consult help and use:

```shell
builder login
```

Use `--tenant` only when the user explicitly needs a specific Azure/Entra directory. It is an optional account selector, not a prerequisite for the normal sign-in flow. Recheck `builder account show` afterward.

## Source authorization is separate

Inspect `gh auth status` and the selected repository's access without exposing credentials. When Builder source authorization is needed, consult help and use:

```shell
builder source login github
```

GitHub user authorization does not prove that the GitHub App installation can access the selected repository. Check installation access separately through Builder's source connection flow. Stop if access is missing; do not change repository permissions or install a GitHub App automatically.

### Resolve account and repository access precisely

Before creating a fork or connecting source, compare the intended repository owner, authenticated GitHub CLI identity, and Builder's selected GitHub identity. Multiple saved accounts are not themselves an error: verify which account Builder will use and whether it can access the exact repository. When the user chooses an already-saved account, check `builder source login github --help` for `--account` and select that account within the approved scope; do not switch global `gh` accounts, log out, or ask for another credential just to make names match.

Use credential-free repository metadata to establish canonical `owner/name`, numeric repository ID, default branch, and access. Successful `gh` access proves user access, not GitHub App installation access. Do not run token-printing commands or copy tokens into chat to bridge the two.

```shell
gh api --hostname github.com user --jq .login
gh api --hostname github.com "repos/<owner>/<repository>" --jq "{id,full_name,default_branch,permissions}"
```

Use the REST response's numeric `id` for Builder, not the GraphQL/node ID from `gh repo view --json id`.

For source HTTP 403, read the specific error before prescribing a permission fix. If it identifies missing GitHub App access, preserve any app already created and guide the user through the selected environment's **Settings → Source Control** installation/access link. The app may be called **Embr** in an error; do not guess a production/staging installation URL from that name. The user reviews the correct owner and grants access only to the intended repository, with any required organization approval.

For a missing repository in Portal, select its owner in **Organization**, clear the repository filter, and search by the repository name without the `owner/` prefix. The picker filters displayed repository names; a full `owner/name` search can show **No results found** even when access exists. Check loading, pagination, and lookup errors before declaring the repository absent. An attached app's repository identity is locked; a disabled selector is not proof of missing permission.

If the owner/organization itself is missing, use **Organization missing? → Review GitHub access** for the OAuth App, including organization approval/SSO where needed. OAuth access and GitHub App installation are separate; installing the latter does not fix the former. After approval, close the installation window or select **Refresh access** explicitly. Returning to the tab or a user saying "granted" is not proof: recheck the exact repository/branch and saved source state, then retry only the blocked connection. Keep automatic deployments off; do not recreate the app or deploy as an access probe.

Keep credentials out of chat, manifests, remote URLs, and logs. Inspect only credential-free repository origins; do not display a token-bearing origin or copy it into a command. An account selection or successful login alone is not evidence of repository access.

Microsoft management sign-in and GitHub source access do not configure authentication for visitors to the deployed app. There is no current Builder CLI command for deployed-app authentication.

Proceed only when the exact target, account context, source access, and CLI diagnostics are ready. Never treat a missing prerequisite as a successful readiness check.
