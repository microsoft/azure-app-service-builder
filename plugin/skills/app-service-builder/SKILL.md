---
name: app-service-builder
description: "Use for explicit App Service Builder requests: discover setup context, check builder.yaml, initialize from GitHub, recover source access, connect an app to an existing model service, deploy pushed source, manage variables, inspect history, or recover a retained version. For Private Preview development/test. Assume users have platform access and use their provided environment. Not for ordinary Azure App Service, Azure Container Apps, or internal platform operations. A generic 'deploy my app' request must first select the product and target."
---

# App Service Builder

Help customers use the `builder` CLI for **Private Preview development/test**, not production. Plugin installation does not install the CLI or grant Azure/GitHub permissions.

This public repository is the maintained customer skill home; the CLI supplies existing-manifest validation and app operations, not a second skill installation route. No private checkout is required.

## Before acting

Use the [canonical product documentation](https://builder.appservice.azure.com/docs/) and check [current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) before recommending a workflow. Maintained docs govern support, prerequisites, and limitations; bundled references provide procedure; installed CLI help verifies actual syntax. If docs and help disagree, surface the mismatch and do not guess. If docs cannot be fetched, disclose the gap and do not promote unqualified features. Public docs do not make the platform publicly available.

1. Confirm the user means **App Service Builder**. For an ambiguous deployment request, ask which product and target they intend; do not default to Builder or substitute ordinary App Service/Container Apps tooling.
2. Local code/manifest inspection can precede Git initialization or account connection. Before cloud work, read [prerequisites](references/prerequisites.md): discover existing tools, account/target context, resource groups, and source access before asking for missing choices. Use the official CLI archive, Node.js >=22, Git, GitHub CLI, an accessible subscription, an existing resource group for CLI setup, and the selected app location. The separate .NET runtime is only needed for local manifest commands. Missing required tools or actual access failures stop the affected operation; never guess downloads or install tooling without approval.
3. Read local CLI help and inspect existing account/session context before requesting sign-in. Preserve existing sessions and account context. Keep Microsoft management authentication, GitHub user authorization, GitHub App repository access, and deployed-app sign-in distinct.
4. Before publication/deployment, bind the exact app, subscription/resource group, repository identity, branch, source attachment root, and deliberately selected checkout. Preserve dirty/unrelated work; reconcile actual source/account state rather than inferring readiness from a local preview or sample.
5. Scope each write to the confirmed target and requested action. Plan approval, local preview, source publication, cloud deployment, retained recovery, and deletion are distinct permissions, not blanket approval. Ask only when needed to resolve scope; do not use bypass flags to approve guessed values. Reconcile unknown write outcomes read-only before retrying.

## Discovery-first interaction

Inspect before interviewing. Reuse facts the user already supplied and verified results from this session. If the user selects their default subscription, resolve that selection read-only rather than demanding its ID. Present discovered choices, ask one focused question at a time, and ask only for a missing decision or an actionable blocker.

Assume users already have platform access and are working with the environment and resources they were given. Use that context as the starting point; do not require enrollment proof, an eligibility questionnaire, or an out-of-band approval before helping them.

Use plain task language: "Which region should I use?" or "This account cannot access the selected subscription." Do not ask for preview-approval attestations, describe the user's target as preview-approved, or send the user to a preview contact. Keep the development/test status as brief context, not a recurring disclaimer or setup gate. Check documented feature limits and actual service responses; lack of a separate eligibility confirmation is not a blocker. An actual authentication or permission failure still needs a concrete fix; assumed platform access is not permission to bypass it.

Explain an actual blocker and its smallest recovery action, not the entire prerequisite checklist again. A skipped diagnostic is not a pass; missing optional local validation or Azure CLI is not by itself a deployment blocker. Do not add confirmation prompts for routine reads or ask again for an unchanged, already-authorized action; still obtain separate authorization for new effects, account changes, permissions, publication, and deployment as required by the host.

For an AI-backed app, read the model-service workflow before collecting configuration or creating cloud resources. Explain the managed-identity and variable-exposure boundaries up front, discover existing compatible resources, and offer a supported development/test path rather than sending the user to copy endpoints by hand.

## Choose the focused workflow

| Task | Read before executing |
| --- | --- |
| Check access, CLI readiness, and source authorization | [Prerequisites and readiness](references/prerequisites.md) |
| Inspect app layout, use optional samples, and validate an existing builder.yaml | [Source and manifest](references/source-and-manifest.md) |
| Call an existing Azure OpenAI/Foundry or other model service | [Model services and external dependencies](references/model-services.md) |
| Initialize, deploy, and verify the serving app | [Deployment](references/deployment.md) |
| Inspect failures/history, manage desired variables, recover, or delete | [Operations](references/operations.md) |

Read the relevant reference in full. All command examples have descriptive placeholders: replace them only with user-confirmed or verified values; never execute angle-bracket values literally. Use `builder --help` and command-specific help to check the installed CLI before using options. Do not invent missing commands.

For a starting point, detect the existing framework/runtime and static versus HTTP shape first. Use the [published sample catalog](https://builder.appservice.azure.com/docs/samples/) for context and the verified public examples in the source reference; inspect the selected sample's current README, root `builder.yaml`, and relevant project/startup/health files before proposing small adaptations. Preserve existing source instead of requiring a fork. Source examples do not override current availability warnings.

Use `builder manifest validate` to check an existing manifest. It does not create or change the file. Use the maintained manifest guide and selected sample for configuration guidance; do not guess unsupported fields or framework settings. Any user-requested file edits need a reviewed diff and approval. Optional build execution needs separate approval.

## Boundaries and completion

- Work from the user's selected GitHub repository and pushed source; samples are optional. Provisioning, source connection, and deployment are separate effects. `init` is setup, not a local upload or explicit deploy; source changes may trigger configured automation where enabled. Preserve partial success and retry only the missing step.
- Static browser assets and documented HTTP apps are the core focus. Runtime recognition is not proof of successful activation; current feature status takes precedence over bundled examples. Combined static/HTTP output is documented; Next.js standalone remains a separate unsupported workflow.
- Do not provide runnable instructions for unverified preview workflows: Next.js standalone, managed identity/dependent integrations, native GitHub push deployment, runtime log streaming/metrics, scale to zero, custom domains, private networking, persistent mounts, or shell access. An identity control in Portal or an ARM schema is not proof that workload identity works. Managed Microsoft Entra visitor sign-in is a separate documented feature; use its current Portal/ARM guidance, not a nonexistent CLI authentication command.
- For desired variables, follow the help-gated [variable workflow](references/operations.md#manage-desired-variables). Reads show names rather than values; updates need scoped approval and a separate build/deployment to take effect.
- A request accepted by the service, successful build, or operation completion alone is not a serving app. Inspect returned app state and runtime URL, then verify real HTTP behavior and the app-owned health endpoint. Report any unverified stage plainly.
- Do not change cloud access or install plugins globally as part of app work. Keep secrets and confidential diagnostics out of source, responses, and public feedback. For public feedback use sanitized examples; report vulnerabilities privately via the repository's security policy.
