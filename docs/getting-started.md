# Getting started with App Service Builder

> **Preview guide - updated November 9, 2026.**
> App Service Builder is open to everyone with an Azure subscription during preview,
> subject to usage limits and regional availability. No invitation is required.

Welcome! Build and deploy your first app, explore the available features, and
help shape App Service Builder during preview.

App Service Builder builds your source code and hosts a static website, an HTTP
app/API, or a frontend and backend together. A `builder.yaml` file describes
how to build and run your app. This repository provides downloads, agent
instructions, and feedback intake; **you do not need to clone it to deploy your
own app**.

## Start here

| If you want to... | Start with... |
| --- | --- |
| Try Builder with no local tools | [Deploy your first app in the portal](#deploy-your-first-app-in-the-portal-recommended). |
| Deploy from your terminal | [Install Builder CLI](#builder-cli-deploy-from-your-terminal), then choose GitHub or local-directory/ZIP source. |
| Give this page to a coding agent | [Use the agent-ready instructions and prompt](#coding-agent-with-docs-without-an-installed-skill). No skill installation is required. |
| Install maintained agent instructions | [Set up the optional Builder skill](#agent-skills-help-your-coding-agent-work-with-builder). |
| Use a native visual panel alongside chat | [Check Builder canvas host compatibility](#builder-canvas-a-guided-visual-experience-in-a-compatible-host). |

Open **https://builder.appservice.azure.com/**, sign in with your Azure account,
and select your subscription. Choose an
[available Builder location](https://builder.appservice.azure.com/docs/resources/regions/)
when creating your app.

Documentation is linked from the portal and available directly at
**https://builder.appservice.azure.com/docs/**. Start with a small app or a
[documented sample](https://builder.appservice.azure.com/docs/samples/) to explore
the deployment experience.

This is **preview for development and testing, not production
workloads**. There is no financially backed SLA, and features and availability
may change. Review the
[preview guidance](https://builder.appservice.azure.com/docs/resources/preview/)
before deploying. Use disposable test apps. Avoid sensitive data and never
include secrets in screenshots, logs, or feedback.

### Deploy your first app in the portal (recommended)

**No local CLI, Git, Node.js, or agent plugin is needed for this path.** You need
an Azure subscription and a GitHub account for source
access. If you prefer not to connect GitHub, use the
[CLI local-directory/ZIP path](https://builder.appservice.azure.com/docs/guides/deploy-zip-source/).

1. In the [portal](https://builder.appservice.azure.com/), select your subscription
   and **Create**.
2. In **Choose approach**, keep **Let Builder handle it** selected, then connect
   GitHub. Choose **Start from a template** to fork a sample into your
   account, or **Use my repository** for your existing app or prepared fork.
   The [minimal Node.js HTTP sample](https://github.com/AzureAppService/app-service-builder-nodejs)
   is a good starting point; confirm its Node.js 24 runtime is available in your
   selected location. If your app includes `builder.yaml`, commit and push it at
   the selected source root. Otherwise, Builder attempts
   [best-effort manifest generation](#prepare-builderyaml-and-check-the-right-stage),
   which supports limited cases and is not guaranteed to work.
3. If prompted, install or grant the
   **App Service Builder** GitHub App access to your exact repository.
   Review the requested access yourself; GitHub sign-in alone is not enough.
4. In **Authentication**, review visitor sign-in; select **Off** only if you
   intend to allow anonymous visitors. Managed identity is separate and is
   configured after creation from the app's **Identity** page. Choose your app name,
   subscription, resource group, and an available app region. On **Review and
   create**, confirm the source and Azure target, then select **Create and deploy**.
5. Wait for **Deployments** to show success. Check the active version and source
   revision, then use **Browse** to open the app. For the unmodified Node.js
   sample, `/` shows `App Service Builder / nodejs-web: Hello` and `/health`
   returns HTTP 200 with `OK`. Use your own app's expected routes and responses
   if you chose different source.
6. When finished, delete only the test app you created and no longer need.
   App deletion does not delete the GitHub fork, resource group, or separately
   created services; review those resources separately.

The [full Portal quickstart](https://builder.appservice.azure.com/docs/quickstarts/portal/)
covers each screen and cleanup. If something fails, identify the
[failing stage](https://builder.appservice.azure.com/docs/troubleshooting/#find-the-failing-stage)
and inspect the deployment/build logs before retrying. If the app already
exists, recover that app rather than creating a duplicate.

## Preview pricing and limits

**App Service Builder is free during preview.** Resource and usage limits
apply to prevent abuse and keep capacity available. Free access
does not mean unlimited usage.

The documented preview allowances are:

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
use [Azure Support](#support) to confirm your allowance or request a higher one.

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

1. Open [Builder releases](https://github.com/microsoft/azure-app-service-builder/releases)
   and select the latest **Builder CLI** release, including preview releases.
   Download its `azure-builder-cli-<version>.tgz` asset, not a canvas package.
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
   when providing your own `builder.yaml`, include it at the selected source root.
   Exclude secrets from the upload.

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

**Giving this page to an agent is enough to start; installing a skill is
optional.** Work in your own app's folder, not a clone of this resource
repository. No private source checkout is needed.

**For agents reading this page:** use the maintained
[Agents start here routing map](https://builder.appservice.azure.com/docs/quickstarts/agents-start-here.md)
and [Markdown documentation index](https://builder.appservice.azure.com/docs/llms.txt)
to find the relevant guides. Article URLs ending in `/` also have Markdown
versions: replace that final `/` with `.md`. Read the guide for the chosen
workflow before acting; this page is an entry point, not the complete CLI or
manifest reference.

Start with read-only inspection of the existing app and available tools.
Identify its runtime, source root, build output, startup command, listening port,
health route, and external dependencies. Check
[feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/),
[runtime support](https://builder.appservice.azure.com/docs/reference/runtimes/),
regions, and limits against those needs. Preserve the user's app and source
choice; do not replace it with a sample.

Treat file edits, installations, builds, source publication, app creation,
source connection, permission changes, and deployment as separate actions to
approve. A build executes repository code. Before GitHub deployment, confirm
that the intended changes are pushed and the branch tip matches the source
being deployed. If an operation times out or its outcome is unknown, inspect
the existing app and operation before retrying.

Use the [manifest guide](https://builder.appservice.azure.com/docs/guides/builder-yaml/)
and [YAML reference](https://builder.appservice.azure.com/docs/reference/builder-yaml/)
to propose `builder.yaml`. Choose either the
[GitHub CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/)
or [local-directory/ZIP walkthrough](https://builder.appservice.azure.com/docs/guides/deploy-zip-source/)
before requesting source access. Check installed CLI help for exact commands;
do not invent flags, install a guessed npm package, or assume another Azure
service's deployment commands apply.

Copy this prompt into your agent while working in your app's folder:

> Help me get this app running on App Service Builder for development/test.
> Read https://builder.appservice.azure.com/docs/quickstarts/agents-start-here.md
> and follow the relevant maintained guides. First inspect my existing app
> without changing it, check supported runtimes and preview limits, and propose
> the smallest builder.yaml. Explain the source root, build output, startup,
> port, health route, and any external services. Check available tools and
> installed CLI help. Ask me to choose GitHub or local-directory/ZIP source if
> that is not already clear. Show the proposed changes, missing prerequisites,
> and deployment steps. Don't install tools or plugins, change files, run builds,
> connect accounts, upload source, change permissions, or deploy yet.
> Before deployment, confirm my subscription, resource group, region, app name,
> and exact source with me. After I approve the actions, follow the chosen
> quickstart through deployment and verify the active version, app URL, expected
> responses, and health route. If a step fails, diagnose that stage and reuse any
> app already created rather than starting over.

Reading docs does not install a skill or verify a deployment. If you want maintained
instructions discovered by the host, install the plugin below. To check whether
the agent actually has the skill available, inspect the host's plugin/skill list;
do not infer that it is installed or loaded because the agent read a docs page.
If you skip or decline skill installation, continue with the public manifest and
GitHub or ZIP deployment guides above. An agent may suggest the optional plugin,
but must obtain your approval for the exact host and installation scope before
changing plugin configuration; asking it to build or deploy is not installation
approval.

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

#### What builder.yaml does

`builder.yaml` is your app's build and runtime configuration, also called its
**manifest**. It tells Builder which components to build, where their source
lives, what to publish, and how to start and route traffic to an HTTP app.
It is not your application code and does not create external services for you.

| Setting | What it describes |
| --- | --- |
| Components and source directories | Your static site, HTTP app, or frontend/backend layout and the source for each component. |
| Runtime and build settings | The supported runtime and any custom build commands. |
| Static output | The browser-ready files to publish, not your whole source repository. |
| Startup, port, paths, and health checks | How an HTTP component runs, receives traffic, and is checked during deployment. |

Use the [manifest guide](https://builder.appservice.azure.com/docs/guides/builder-yaml/)
for examples and the [YAML reference](https://builder.appservice.azure.com/docs/reference/builder-yaml/)
for exact fields and defaults.

#### Create your own or try platform generation

You can write `builder.yaml` using the documented examples, adapt one from a
matching [sample](https://builder.appservice.azure.com/docs/samples/), or ask your
coding agent to generate one after inspecting your app. Review the proposed
configuration before using it; preserve your existing source and build scripts.
`builder init` does not generate it, and `builder manifest validate` only checks
an existing file. These local CLI commands are separate from platform generation.

**If you do not provide `builder.yaml`, the platform makes a best-effort attempt
to generate one for you.** The generator currently handles only limited cases;
it is not guaranteed to produce a working configuration for your app. If it
cannot generate a working manifest, or the generated configuration fails during
build or deployment, you receive an error. Inspect that error and the build or
deployment logs, then provide or correct your own manifest rather than repeatedly
retrying the same source and expecting a different result.

If a simple app works with the platform-generated manifest, you can use it as
a starting point. **Before expanding beyond the generator's limited capabilities,
copy the provided YAML into a `builder.yaml` file in your own source and extend
it there.** Review the file, commit and push it for GitHub deployments, or include
it in your next source ZIP. Providing your own manifest lets you explicitly
describe the app as it grows instead of relying on the generator to infer new
requirements. Keep the manifest in source control alongside the app.

#### Put the manifest in the right place and verify the result

Keep `builder.yaml` at the selected app source root. Component `rootDirectory`
is relative to that root; build output is a different location. For custom builds,
stage output under `$DESTINATION_DIR`. Static output contains public browser files
and needs no server process. An HTTP app must use its real hosted startup, listen
on the declared port, and implement any configured health route. Do not upload
only a build folder unless it is the complete source/build input described by
the manifest; ZIP source is built by Builder.

For static publication, the component's `output` selects only public browser
assets, not the whole repository. A source ZIP needs the required source/build
inputs; when supplying your own manifest, put `builder.yaml` at the archive root.
See [source versus published output](../plugin/skills/app-service-builder/references/source-and-manifest.md#source-input-is-not-static-publication-output)
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

1. Select the latest **canvas** release from
   [Builder releases](https://github.com/microsoft/azure-app-service-builder/releases)
   and download its packaged canvas ZIP and installation guide.
   Use the attached canvas package, not GitHub's automatic source-code archive.
2. Follow the installation guide to extract the package, install it into a
   disposable test project, and reload extensions. Enable only one canvas
   provider. Do not commit the test installation into your app.
3. Ask in your test project's chat:

   > Open App Service Builder canvas.
   
Native canvas operations do not require Builder CLI. The installation guide lists the
separate Node.js, Azure CLI, and GitHub CLI prerequisites and exact installation
steps. Review the target and action before authorizing cloud changes.

For local source, the canvas's **From your computer** workflow can package and
deploy a ZIP without Git, GitHub sign-in, or Builder CLI. Review the exact files
for secrets before **Upload & deploy**, confirm the Azure target, and verify
the hosted app afterward. Follow the
[canvas quickstart](https://builder.appservice.azure.com/docs/resources/copilot-canvas/)
for the current workflow and prerequisites.

All these resources live in the
[App Service Builder repository](https://github.com/microsoft/azure-app-service-builder).

## Explore what you can build

Start with a small development/test app, then explore the workflows that fit
your project:

| Goal | Where to start |
| --- | --- |
| Deploy your first app | Follow the [Portal quickstart](https://builder.appservice.azure.com/docs/quickstarts/portal/) or deploy [local-directory/ZIP source with Builder CLI](https://builder.appservice.azure.com/docs/guides/deploy-zip-source/). |
| Iterate on your app | Deploy a code change, inspect [build and deployment logs](https://builder.appservice.azure.com/docs/guides/logging-and-monitoring/), and try deploying an eligible [retained version](https://builder.appservice.azure.com/docs/guides/deployments/). |
| Deploy GitHub changes automatically | Opt into [automatic deployments](https://builder.appservice.azure.com/docs/guides/source-control/#automatic-deployment-policy) for your connected branch, then verify the deployed revision and app URL. |
| Connect services or protect visitor access | Explore [managed identity](https://builder.appservice.azure.com/docs/guides/managed-identity/) and [visitor authentication](https://builder.appservice.azure.com/docs/guides/authentication/). |

Check [current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/)
before choosing a workflow. Native GitHub push deployment is available as an
opt-in; the Portal's separate **Use GitHub Actions** integration remains
**Coming soon**. Follow the published guide for each capability rather than
assuming a CLI flag or saved setting proves availability.

Managed identity still requires destination data permissions and network access;
finish deploying the identity assignment before verifying runtime access.
Visitor sign-in is separate from Azure management and GitHub source access.

## Feedback and support

### Share feedback or report a bug

In the [Builder Apps portal](https://builder.appservice.azure.com/), select
**Share feedback** and choose **General**, **Feature request**, or **Bug report**.
Use the category's template to share your feedback or reproduction steps.
Search [existing issues](https://github.com/microsoft/azure-app-service-builder/issues)
first to avoid duplicates. If the button is not available in your environment,
use the repository's
[feedback templates](https://github.com/microsoft/azure-app-service-builder/issues/new/choose).

Portal submissions create **public GitHub issues** posted by the feedback bot.
Your name and email are not automatically attached, but anything you enter is
public. Issues submitted directly on GitHub are associated with your GitHub
account. **Do not include personal or sensitive information**, subscription or
resource IDs, credentials, customer data, or confidential diagnostics.

For bugs, include what you tried, what you expected, what happened, and whether
you used the portal, CLI, or canvas. Sanitized screenshots and tool versions are
helpful. Tell us what feels useful, confusing, missing, or broken - small
observations are welcome too.

### Support

For setup, usage, or troubleshooting help, open an **Azure support ticket**.
**Any support request containing personal information or requiring identifiable
account, subscription, resource, or diagnostic details must use a support ticket,
not the portal feedback form or a public GitHub issue.** Never share credentials,
sensitive variable values, or customer data.

During preview, select **Technical** as the issue type and **Web App (Linux)**
as the service for the affected subscription; there is no dedicated App Service
Builder support topic. Start the summary with **App Service Builder:** and
explicitly state in the description that the request is for **App Service
Builder** so Azure Support can route it correctly. Technical support requires an
Azure support plan and permission to create support requests for that subscription.

Follow the [Builder support instructions](https://builder.appservice.azure.com/docs/resources/preview/#report-a-problem)
for the full ticket-creation steps. Include the failing operation, when it
occurred (with time zone), the error message, and what you have tried.

For suspected security vulnerabilities, follow the private reporting instructions
in the [security policy](../SECURITY.md), not the feedback form or a public issue.

Thanks for helping us make Builder better!
