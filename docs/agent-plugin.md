# App Service Builder agent plugin

The `builder` plugin provides one customer-facing skill, `app-service-builder`, for authorized App Service Builder **Preview development/test** use. It is instructions and focused references only: no hooks, new MCP servers, VS Code extension, or Copilot app canvas.

Plugin distribution does not grant preview access or announce public service availability. It is a repository-hosted marketplace, not admission to a curated plugin directory.

This public repository is the maintained customer skill home. The Builder CLI supplies existing-manifest validation and app operations; it is not a second skill distribution route and does not require a private checkout. Install the customer skill through the marketplace below, not an additional CLI-bundled installer.

## Choose the installation you need

| How you work | What to install or read |
| --- | --- |
| Builder CLI directly | Install Builder CLI and follow the [CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/); no agent skill is required |
| Coding agent using public docs, without a skill | Give the agent the [canonical docs](https://builder.appservice.azure.com/docs/), manifest guide, and chosen deployment guide; install CLI only for CLI-backed commands |
| Coding agent with the maintained Builder skill | Install this plugin in a supported host, verify discovery below, and separately install CLI for CLI-backed commands |

None of these installations grants Azure or GitHub access. Reading public docs or the [skill instructions](../plugin/skills/app-service-builder/SKILL.md) does not install or load a skill, and installing CLI does not make a skill available to the agent. Verify discovery in the host rather than assuming a docs link activated the plugin.

If you skip or decline skill installation, continue with the public manifest and deployment guides; missing optional agent instructions are not a deployment prerequisite. An agent may explain the plugin and show the commands below, but must obtain your approval for the exact host and installation scope before changing plugin configuration. A request to build or deploy an app is not approval to install a plugin.

## Install the plugin

Use an installed host that supports plugins to install from this repository's marketplace:

### GitHub Copilot CLI

```shell
copilot plugin marketplace add microsoft/azure-app-service-builder
copilot plugin install builder@azure-app-service-builder
copilot plugin list
copilot skill list
```

### Claude Code

```shell
claude plugin marketplace add microsoft/azure-app-service-builder
claude plugin install builder@azure-app-service-builder
claude plugin list
```

Restart the host session after installation if needed. Ask explicitly for App Service Builder, for example: "Check whether my selected repository is ready for App Service Builder; do not deploy." In Claude Code the skill can also be invoked as `/builder:app-service-builder`. Review the target and action before authorizing any cloud change.

These commands install the **agent plugin**, not the **Builder CLI**. They change the host's plugin configuration when the customer chooses to run them.

## Install Builder CLI separately

Obtain the portable `azure-builder-cli-<version>.tgz` archive from the [official CLI releases](https://github.com/microsoft/azure-app-service-builder/releases). Follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/). Use the same archive on Windows, Linux, and macOS with Node.js 22 or later, including npm.

Use the CLI release asset, not GitHub's automatic source-code ZIP or tarball. If an asset is unavailable, report the exact missing release artifact and link to the official releases page rather than guessing a version or download URL.

Download the [CLI 0.0.2 preview archive](https://github.com/microsoft/azure-app-service-builder/releases/download/builder-cli-v0.0.2-preview.1/azure-builder-cli-0.0.2.tgz).

Install the downloaded local archive, with the user's approval:

```shell
npm install --global "<path-to-downloaded-file.tgz>"
builder --version
builder --help
```

Replace the path with the actual approved download. Do not extract the archive or install a guessed npm-registry package. npm registry access is still needed for JavaScript dependencies.

The archive includes the portable analyzer, not the .NET runtime. A compatible .NET 10 runtime is required only for local `builder manifest` commands. Login, initialization, and deployment work without .NET. The analyzer's generated `Embr.BuildAnalyzer.runtimeconfig.json` specifies the required runtime; a .NET SDK is not required. An existing compatible SDK includes the runtime.

Before local manifest commands, install the required runtime separately if needed and check:

```shell
dotnet --list-runtimes
```

Access to the selected subscription, an existing resource group for CLI setup, and an app location are also required for deployment. Git and GitHub CLI are required for GitHub source operations, not local-directory/ZIP uploads. Missing required tools or actual access failures stop the affected operation; the plugin does not install or upgrade tooling automatically. Assume users already have platform access and are working with the environment and resources they were given. Discover that context and resolve concrete errors rather than requiring eligibility attestations or external approval.

Installation/help success does not prove browser login works: Linux or remote hosts can fail before sign-in when secure credential storage (`libsecret` or the D-Bus keyring session) is unavailable. Follow [credential-storage readiness](../plugin/skills/app-service-builder/references/prerequisites.md#secure-credential-storage-and-browser-sign-in); do not disable secure caching or assume an undocumented headless login fallback.

The [canonical product docs](https://builder.appservice.azure.com/docs/) and [current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) govern support, prerequisites, and limitations. The skill consults maintained docs first, uses bundled procedures, and checks installed CLI help for syntax. Public documentation does not change Preview access. Local code/manifest inspection can happen before Git initialization or account connection; cloud actions remain gated on readiness and their own scope.

The [skill](../plugin/skills/app-service-builder/SKILL.md) includes self-contained [readiness](../plugin/skills/app-service-builder/references/prerequisites.md), [source](../plugin/skills/app-service-builder/references/source-and-manifest.md), [model-service integration](../plugin/skills/app-service-builder/references/model-services.md), [deployment](../plugin/skills/app-service-builder/references/deployment.md), and [operations](../plugin/skills/app-service-builder/references/operations.md) references. Unsupported or unqualified workflows must not be inferred from the existence of this plugin.

Version 0.1.4 preserves discovery-first setup and partial-success recovery, explains human-reviewed GitHub App repository access only for GitHub workflows, and adds the published CLI 0.0.2 local-directory/ZIP path. It aligns model guidance with documented Portal/ARM managed identity while preserving build-visible variable, destination-access, and deployed verification boundaries. These are guidance improvements, not new platform capabilities or proof of a successful cloud deployment.

The CLI validates an existing `builder.yaml` without creating or changing it. Use the manifest guide and selected sample for configuration guidance, and check installed command help before invocation. Local validation is optional and does not block ordinary app setup.

## Choose source and access separately

**GitHub source:** `builder login` authenticates Azure management. `builder source login github` selects GitHub user access, not GitHub App installation coverage. The **App Service Builder** GitHub App must be installed/granted access to the exact repository, including a public repository. Use Builder's **Settings → Source Control** installation link; the human reviews the owner, publisher, permissions, and **Only select repositories** choice. For the public Portal, the app is [App Service Builder](https://github.com/apps/app-service-builder), slug `app-service-builder`, published by **AzureAppService**. Do not grant all repositories or repeat Azure sign-in to repair missing installation coverage.

**Local-directory/ZIP source:** CLI 0.0.2 or a compatible later release can upload selected source with root `builder.yaml`, without GitHub sign-in, GitHub CLI, a pushed commit, or GitHub App installation. Use [the ZIP walkthrough](https://builder.appservice.azure.com/docs/guides/deploy-zip-source/) and help-verified `builder app create` / `builder app deploy` commands, not Git-backed `builder init`. Review included files before upload; local secrets and uncommitted changes are not protected by `.gitignore`. ZIP uploads are source builds, not prebuilt App Service ZIP packages. Portal ZIP deployment is not available.

An HTTP 403 source error can leave a successfully created app behind. Preserve that app, resolve the specific GitHub access problem, recheck saved source, and retry only the missing connection. See [precise access recovery](../plugin/skills/app-service-builder/references/prerequisites.md#resolve-account-and-repository-access-precisely). Source save, deployment success, and real serving behavior are separate stages.

**Managed identity:** use the documented [Portal/ARM identity workflow](https://builder.appservice.azure.com/docs/guides/managed-identity/), not an invented CLI identity command. Identity assignment/deployment, destination data roles and networking, Azure management login, GitHub source access, and visitor sign-in are distinct. Validate the application's SDK/API and one bounded deployed dependency operation; assigning an identity does not make a key-only sample passwordless automatically.

## Package layout and local checks

Both hosts read the same `plugin/skills/` tree. Copilot's entry point is `plugin/plugin.json`; Claude Code's is `plugin/.claude-plugin/plugin.json`. Keep those manifests identical. A single catalog at `.claude-plugin/marketplace.json` is supported by both hosts, so there is no duplicate catalog to drift.

From a checkout, use Node.js >=22 with no package installation:

```shell
node --test scripts/validate-plugin.test.mjs
node scripts/validate-plugin.mjs
```

These offline checks validate the deliberately small manifest schema, required metadata, version agreement, contained relative paths, both entry points, the single skill's frontmatter, local Markdown links (including onboarding), bundled references, canonical product documentation destinations, and approved-archive installation guardrails. Official release-asset links are allowed; other archive sources and automatic source-code downloads are rejected. Link-shape validation does not prove that an asset is published: confirm release availability before advertising a specific release. Focused safety assertions protect source preservation, read-only reconciliation, CLI commit selection, variable-editing scope, existing-manifest validation, discovery-first setup, conditional GitHub consent, ZIP packaging, identity/credential boundaries, source/output distinction, and novice onboarding; they are not a semantic safety proof or CLI runtime smoke test. Negative tests exercise broken metadata, paths, references, documentation destinations, unsafe edits, and commands outside the shipped CLI. They do not run `builder`, fetch sample source, validate live doc content/service access, or prove a deployment works.

If Claude Code is already available, `claude plugin validate ./plugin` and `claude plugin validate .` provide additional native manifest validation. Native discovery should be checked using isolated temporary host configuration, not by installing into a contributor's global configuration. Record the host/version and actual result in the PR; missing hosts or live preview checks remain explicit gaps.

Packaging references: [Copilot plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference), [Copilot marketplaces](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace), [Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces), and the [Azure Container Apps plugin layout](https://github.com/microsoft/azure-container-apps/tree/main/plugin).

Feedback, support, security reporting, and the repository license remain governed by the [contribution guidance](../CONTRIBUTING.md), [support guidance](../SUPPORT.md), [security policy](../SECURITY.md), and [MIT license](../LICENSE).
