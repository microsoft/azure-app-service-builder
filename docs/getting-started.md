# Getting started with App Service Builder

> **Private Preview guide - updated October 21, 2026.**
> This guide is for invited MVP, 1P, and external participants whose subscriptions have been
> enabled. It does not grant preview access or announce public availability.
> Feature availability and feedback instructions below apply to this cohort.

Welcome! Thank you for helping us test and shape App Service Builder as we head
toward Ignite.

## Start here

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

Limits can cover the number of apps, compute sizes and replicas, concurrent
builds, build frequency and duration, and certain app operations. The allowances
that apply depend on your subscription's assigned policy and available regional
capacity; do not assume that a policy listed in the documentation is the one
assigned to your subscription.

See [quotas and limits](https://builder.appservice.azure.com/docs/reference/limits/)
for details. If you encounter a limit or need help understanding your allowance,
post in the **Support** channel in the App Service Builder Community team.

Other Azure services you create or connect to your app may still incur their
normal charges; free Builder access does not make those services free.

## Choose how you want to work

You can deploy apps today using the **portal, Builder CLI, or Builder canvas**.
You do not need to install everything - starting with the portal is fine.

### Builder CLI: deploy from your terminal

Builder CLI lets you connect an app to GitHub source and deploy from your
terminal.

Requires **Node.js 22+**, plus Git and [GitHub CLI](https://cli.github.com/) for
GitHub-connected deployment.

1. Download the `azure-builder-cli-<version>.tgz` asset from the
   [Builder CLI release](https://github.com/microsoft/azure-app-service-builder/releases/tag/builder-cli-v0.0.1-preview.1).
   Do not extract it or use GitHub's automatic source-code archives.
2. Install the downloaded file and check the command:

   ```shell
   npm install --global "<path-to-downloaded-file.tgz>"
   builder --version
   ```

3. Follow the
   [CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/)
   to sign in, connect your app, and deploy. You will need an enabled subscription,
   permission to manage Builder apps, an existing resource group, and an available
   Builder location.

The same CLI archive works on Windows, macOS, and Linux. A separate .NET 10
runtime is needed **only for optional local manifest commands**, not for login,
setup, or deployment.

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

The skill does **not** install Builder CLI; install that separately for CLI-backed
operations. See the [agent-plugin guide](agent-plugin.md) for more details.

### Builder canvas: a guided visual experience inside the Copilot app (also Claude Code and VS Code)

The canvas helps you review, configure, and deploy an app through an interactive
panel. It requires a **compatible Copilot app with native canvas support**; a
plain terminal CLI cannot display it. Claude Code and VS Code are also supposedly supported, but haven't been tested yet. Feel free to test there and let us know how it goes!

1. Download the packaged canvas ZIP, `canvas-testing-guide.md`, and
   `SHA256SUMS.txt` from the
   [canvas release](https://github.com/microsoft/azure-app-service-builder/releases/tag/canvas-v0.1.0-preview.4).
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

**GitHub Actions deployment, ZIP deploy, managed identity, and built-in
authentication are coming soon for this cohort.** We will post updates in the Teams channel over the
next few days as additional features become available and ready for testing.

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
