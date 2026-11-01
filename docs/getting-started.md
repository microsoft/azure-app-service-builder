# Getting started with App Service Builder

> **Private Preview guide - updated October 31, 2026.**
> This guide is for invited MVP, 1P, and external participants whose subscriptions have been
> enabled. It does not grant preview access or announce public availability.
> Feature availability and feedback instructions below apply to this cohort.

Welcome! Thank you for helping us test and shape App Service Builder as we head
toward Ignite.

## Start here

**Working with a coding agent?** Start with the [agent-plugin guide](agent-plugin.md)
for optional skill installation and discovery, or give the agent the public docs
for the [docs-only path](#coding-agent-with-docs-without-an-installed-skill).
Reading docs or [skill instructions](../plugin/skills/app-service-builder/SKILL.md)
does not install or load a skill. CLI-only use needs no skill, and installing
Builder CLI does not install the agent plugin.

Open **https://builder.appservice.azure.com/** and sign in with the Azure account
that has access to your enabled subscription.

Documentation is linked from the portal and available directly at
**https://builder.appservice.azure.com/docs/**. Start with a small app or a
[documented sample](https://builder.appservice.azure.com/docs/samples/) to explore
the deployment experience.

This is **Private Preview for development and testing, not production
workloads**. Use disposable test apps. Avoid sensitive data and never include
secrets in screenshots, logs, or feedback.

## Private Preview pricing and limits

**App Service Builder is free during Private Preview.** Resource and usage limits
apply to prevent abuse and keep capacity available for participants. Free access
does not mean unlimited usage.

The **Preview Free (`preview-free`)** limits for this cohort are:

| Resource or operation | Limit |
| --- | --- |
| Builder Apps per Azure subscription | 5 |
| Compute size | `small` |
| Maximum replicas per app | 2 |
| Maximum replicas across the subscription | 10 |
| Concurrent builds per app | 1 |
| Concurrent builds across the subscription | 2 |
| Build-start allowance per app | Up to 10 starts; refills at 10 per hour |
| Build-start allowance across the subscription | Up to 30 starts; refills at 30 per hour |
| Build duration | 10 minutes, from admission through output publication |
| Scale-increase allowance | Up to 10 per app and 30 across the subscription; refills at 10/app/hour and 30/subscription/hour |
| Retained-version activation or redeploy without a new build | Up to 10 per app and 30 across the subscription; refills at 10/app/hour and 30/subscription/hour |

Replica limits count the sum of configured maximum replicas across compute
components, not just the number currently running. Build and operation
allowances refill continuously rather than resetting at the top of each hour.
Both the app and subscription allowances must have capacity. Scale increases and
non-build activations have separate allowances; scale-down does not consume the
scale-increase allowance. Failed or timed-out admitted builds still consume a
build start.

These limits do not guarantee regional capacity. If an allowance is exhausted,
wait for capacity to refill or an active build to finish, as applicable, and
follow the retry guidance in the error.

See [quotas and limits](https://builder.appservice.azure.com/docs/reference/limits/)
for details. If you encounter a limit or need help understanding your allowance,
post in the **Support** channel in the App Service Builder Community team.

Other Azure services you create or connect to your app may still incur their
normal charges; free Builder access does not make those services free.

## Choose how you want to work

You can deploy apps today using the **portal, Builder CLI, or Builder canvas**.
You do not need to install everything - starting with the portal is fine.

| How you want to work | What you need |
| --- | --- |
| Terminal, without an agent | Builder CLI; no agent skill is required |
| Coding agent following public docs, without a skill | Give the agent the public docs and your app context; install Builder CLI only for CLI-backed operations |
| Coding agent with the Builder skill | Install the agent plugin in a supported host and Builder CLI separately for CLI-backed operations |
| Guided native canvas | A compatible canvas host and the canvas package; native actions do not require Builder CLI |

### Builder CLI: deploy from your terminal

Builder CLI lets you deploy pushed GitHub source or upload source from a local
directory/ZIP. Choose the source workflow before connecting accounts.

Requires **Node.js 22+**. Git and [GitHub CLI](https://cli.github.com/) are required
only for GitHub source operations, not local-directory/ZIP deployment.

1. Download the `azure-builder-cli-<version>.tgz` asset from the
   [Builder CLI 0.0.2 release](https://github.com/microsoft/azure-app-service-builder/releases/tag/builder-cli-v0.0.2-preview.1).
   Choose `azure-builder-cli-0.0.2.tgz` and verify it against the companion
   `.sha256` asset using [checksum guidance](../plugin/skills/app-service-builder/references/prerequisites.md#match-the-users-platform).
   Do not extract it or use GitHub's automatic source-code archives.
2. Install the downloaded file and check the command:

   ```shell
   npm install --global "<path-to-downloaded-file.tgz>"
   builder --version
   builder --help
   ```

3. Follow the [GitHub CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/)
   or the [local ZIP walkthrough](https://builder.appservice.azure.com/docs/guides/deploy-zip-source/).
   Both need Azure sign-in, permission to manage Builder apps, an existing resource
   group, and an [available Builder location](https://builder.appservice.azure.com/docs/resources/regions/).
   Local-directory/ZIP deployment does not require GitHub sign-in or installation
   of the GitHub App. It uploads source to build, not a ready-to-run package;
   include `builder.yaml` at the selected source root and exclude secrets.

The same CLI archive works on Windows, macOS, and Linux. A separate .NET 10
runtime is needed **only for optional local manifest commands**, not for login,
setup, or deployment.

### GitHub source access: a separate, conditional step

For **GitHub-backed deployments only**, both your GitHub account and the
**App Service Builder** GitHub App need access to the exact repository, even if
the repository is public. Azure sign-in does not grant either kind of GitHub access,
and GitHub sign-in alone does not grant installation access.

Use Builder's **Settings → Source Control** installation/access link after
selecting the repository. In the public Portal, review the
[App Service Builder GitHub App](https://github.com/apps/app-service-builder),
slug `app-service-builder`, published by **AzureAppService**. Complete consent
yourself, review the owner and permissions, and choose **Only select repositories**
for the intended repository, with organization approval where required. Do not
grant all repositories merely to get started.

After approval, close the installation window or use **Refresh access**, then
verify the exact repository and saved source. If app creation succeeded before a
source-access error, keep that app and retry only the missing source connection.
See [source access and recovery](../plugin/skills/app-service-builder/references/prerequisites.md#source-authorization-is-separate).
Skip this entire GitHub step for local-directory/ZIP deployment.

### Coding agent with docs, without an installed skill

You can start without installing a skill. Give your agent the
[public product docs](https://builder.appservice.azure.com/docs/), the
[manifest guide](https://builder.appservice.azure.com/docs/guides/builder-yaml/),
and the GitHub or ZIP walkthrough above. No private source checkout is needed.

For example:

> Use the public App Service Builder docs to inspect this app and propose its
> builder.yaml. Explain the source root, build output, and any startup, port, and
> health settings. Check installed CLI help before suggesting commands. Don't
> install tools, change files, connect accounts, or deploy yet.

Reading docs does not install a skill or verify a deployment. If you want maintained
instructions discovered by the host, install the plugin below. To check whether
the agent actually has the skill available, inspect the host's plugin/skill list;
do not infer that it is installed or loaded because the agent read a docs page.

### Agent skills: help your coding agent work with Builder

The Builder skill gives **GitHub Copilot CLI or Claude Code** instructions for
checking app readiness, preparing configuration, and using Builder CLI. Install
it in your preferred host.

**GitHub Copilot CLI:**

```shell
copilot plugin marketplace add microsoft/azure-app-service-builder
copilot plugin install builder@azure-app-service-builder
```

**Claude Code:**

```shell
claude plugin marketplace add microsoft/azure-app-service-builder
claude plugin install builder@azure-app-service-builder
```

Restart your host session if needed, then try:

> Check whether this app is ready for App Service Builder. Don't deploy anything yet.

The skill does **not** install Builder CLI or grant Azure/GitHub access; install CLI
separately for CLI-backed operations. Verify plugin/skill discovery with the
commands in the [agent-plugin guide](agent-plugin.md) before relying on it.

### Prepare builder.yaml and check the right stage

For your own app, use the [manifest guide](https://builder.appservice.azure.com/docs/guides/builder-yaml/)
or ask the agent to propose the smallest manifest for your existing layout.
`builder init` does not generate it, and `builder manifest validate` only checks
an existing file. Samples are optional, not a requirement to replace your app.

Keep `builder.yaml` at the selected app source root. Component `rootDirectory`
is relative to that root; build output is a different location. For custom builds,
stage output under `$DESTINATION_DIR`. Static output contains public browser files
and needs no server process. An HTTP app must use its real hosted startup, listen
on the declared port, and implement any configured health route. Do not upload
only a build folder unless it is the complete source/build input described by
the manifest; ZIP source is built by Builder.

For static publication, the component's `output` selects only public browser
assets, not the whole repository. A source ZIP still needs the root manifest and
required source/build inputs. See [source versus published output](../plugin/skills/app-service-builder/references/source-and-manifest.md#source-input-is-not-static-publication-output)
for a browser-ready example and custom-build guidance. A generic static upload
error is not proof of a file limit or a startup/port problem; inspect the version
build log and resolved output before changing directories.

Local manifest validation is optional and needs the separate .NET runtime. Its
default mode does not run repository code or prove startup. The optional `--build`
mode executes build scripts and needs separate approval. After deployment, verify
the active version, expected routes/assets, and the app's actual health endpoint;
a valid manifest or successful build is not proof that the app serves correctly.

### Builder canvas: a guided visual experience in a compatible host

The canvas helps you review, configure, and deploy an app through an interactive
panel. It requires a **compatible Copilot app with native canvas support**; a
plain terminal CLI cannot display it. Do not assume plugin support means canvas
support; check the release's host compatibility and testing guide.

1. Download the packaged canvas ZIP, `canvas-testing-guide.md`, and
   `SHA256SUMS.txt` from the
   [canvas release](https://github.com/microsoft/azure-app-service-builder/releases/tag/canvas-v0.1.0-preview.6).
   Use the attached canvas package, not GitHub's automatic source-code archive.
2. Follow the testing guide to verify and extract the package, install it into a
   disposable test project, and reload extensions. Enable only one canvas
   provider. Do not commit the test installation into your app.
3. Ask in your test project's chat:

   > Open App Service Builder canvas.
   
Native canvas operations do not require Builder CLI. The testing guide lists the
separate Node.js, Azure CLI, and GitHub CLI prerequisites and exact installation
steps. Review the target and action before authorizing cloud changes.

All these resources live in the
[App Service Builder repository](https://github.com/microsoft/azure-app-service-builder).

## What to test now

Focus on **getting a feel for the platform**: onboarding, connecting an app,
deploying it, and understanding the experience. Tell us what feels useful,
confusing, missing, or broken - small observations are welcome too.

Use [current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/)
rather than the original cohort announcement to choose a workflow. Published
guidance now covers [CLI ZIP source](https://builder.appservice.azure.com/docs/guides/deploy-zip-source/),
[managed identity](https://builder.appservice.azure.com/docs/guides/managed-identity/),
and [visitor authentication](https://builder.appservice.azure.com/docs/guides/authentication/).
Identity uses Portal/ARM, not a CLI identity command; destination data permissions
and firewall rules still apply, and assignment must finish deploying before
runtime access is verified. Visitor sign-in is separate from Azure management
and GitHub source access.

Keep native GitHub push deployment off while it remains marked not ready.
Automation and target-specific capabilities must follow their current published
guide; CLI flags or a saved setting alone do not prove availability.

## Keep this cohort's feedback in Teams

For this MVP preview, use the channels in the **App Service Builder Community**
team:

| Channel | What to share or watch |
| --- | --- |
| **Bugs** | Errors, unexpected behavior, and reproduction steps. |
| **Feedback** | Suggestions, impressions, and feature requests. |
| **Support** | Questions, setup problems, or help getting unstuck. |
| **General** | Announcements, updates, and newly available features. Keep an eye on this channel! |

**Do not use GitHub feedback templates or feedback links/buttons in the portal
or canvas for this cohort.** Those routes are public-facing; we want all private
preview feedback kept within the App Service Builder Community team for now. **This overrides the
general feedback instructions in the public repository and download guides for
these participants only.**

For bugs, include what you tried, what you expected, what happened, and whether
you used the portal, CLI, or canvas. A sanitized screenshot and tool version are
helpful. Never post credentials, tokens, or sensitive app data. For suspected
security vulnerabilities, follow the private reporting instructions in the
[security policy](../SECURITY.md), not a channel post or public issue.

We would love **any and all feedback between now and Ignite** as we race toward
the finish line. We may also reach out to interested participants about using a
quote in our launch blog - with your permission, of course.

Thanks for helping us make Builder better!
