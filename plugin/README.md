# App Service Builder agent plugin

The `builder` plugin provides the `app-service-builder` skill for GitHub Copilot CLI and Claude Code, for authorized **Preview development/test, not production** use.

Version 0.1.4 adds workflow-specific GitHub App consent and CLI 0.0.2 local-directory/ZIP guidance, and aligns the [existing-model connection workflow](skills/app-service-builder/references/model-services.md) with documented Portal/ARM managed identity. It preserves discovery-first setup, partial-success recovery, variable-exposure limits, and deployed integration verification; it does not add platform features.

## Install

Use your installed host's two-step marketplace installation.

### GitHub Copilot CLI

```shell
copilot plugin marketplace add microsoft/azure-app-service-builder
copilot plugin install builder@azure-app-service-builder
```

### Claude Code

```shell
claude plugin marketplace add microsoft/azure-app-service-builder
claude plugin install builder@azure-app-service-builder
```

This installs the agent plugin, not the Builder CLI. Obtain the portable `azure-builder-cli-<version>.tgz` archive from the [official CLI releases](https://github.com/microsoft/azure-app-service-builder/releases) and follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/). Node.js 22 or later is required; the separate .NET runtime is only for local manifest commands, not login, initialization, or deployment. Customers do not need the .NET SDK. The skill starts with the platform environment and resources users already have; it checks actual tooling and access without asking them to prove eligibility.

CLI-only use does not require this plugin. An agent may follow public docs without a skill; installing CLI does not install agent instructions. For GitHub source, user authorization and human-reviewed GitHub App repository access are separate from Azure login. Local-directory/ZIP deployment needs neither GitHub sign-in nor GitHub App installation.

See the [full installation guide and readiness limits](../docs/agent-plugin.md), [canonical product documentation](https://builder.appservice.azure.com/docs/), and [skill instructions](skills/app-service-builder/SKILL.md).
