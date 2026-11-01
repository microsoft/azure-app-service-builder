# Model services and external dependencies

Read current [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/), [managed identity](https://builder.appservice.azure.com/docs/guides/managed-identity/), [external-service connections](https://builder.appservice.azure.com/docs/guides/connect-to-services/), [AI assistant guidance](https://builder.appservice.azure.com/docs/guides/host-ai-agent/), and [application variables](https://builder.appservice.azure.com/docs/guides/variables/) before recommending a model-backed app. Inspect the actual app/provider SDK contract, not just a service name.

## Explain the supported path first

Builder hosts the application, not the model or a managed agent service. An HTTP backend can call a separately owned, reachable HTTPS model service. Combined static frontend and HTTP backend is a documented app shape; private model credentials and model calls belong in the backend, not browser JavaScript.

Managed identity is documented for this Private Preview: system-assigned, user-assigned, or both, configured through Portal or ARM. Prefer it when the destination supports Microsoft Entra data-plane authentication and the application's SDK can request the correct token audience. A Portal identity blade, accepted ARM identity property, or successful local developer sign-in does not prove the deployed runtime can obtain a workload token or access the destination. Managed Entra visitor authentication is a different feature and does not grant the backend model access.

If the user's policy requires passwordless access, first verify the identity, SDK, destination roles, and network path; do not quietly substitute a key if those requirements cannot be satisfied. Private networking and automatic Key Vault variable references remain unsupported. For a destination without compatible identity authentication, offer only an explicitly approved service-supported server-side credential, subject to the variable-exposure limits below; do not weaken the service's policy.

## Configure and verify workload identity

Discover existing assignment and non-secret identity metadata before proposing changes. Identity assignment and destination role grants are separate permission changes, not authorized by a request to inspect resources or deploy source. Explain the exact app, identity, destination scope, and save/deployment effect; obtain explicit authorization and leave Portal consent to the human. There is no Builder CLI identity command.

In the Portal **Identity** page, enable system-assigned identity or attach the selected user-assigned identities, then use **Save and deploy**. See the [ARM identity contract](https://builder.appservice.azure.com/docs/reference/arm-api/#managed-identity-contract) for approved API automation; do not replace unrelated assignments or treat a pending assignment as committed. Identity-only saves redeploy retained build output; `NoBuildArtifacts` means an initial deployment is still needed, not that Builder has silently built source. Follow the returned identity operation and linked deployment before claiming completion.

Use the identity's **principal ID** for a narrowly scoped destination data role and its **client ID** for user-assigned SDK selection. Management Reader/Contributor access is not model inference or other data-plane permission. Do not invent a universal role or token audience; read the selected service and SDK's current contract. Preserve destination firewall rules and separately owned identities.

For supported Azure SDK credential chains, `DefaultAzureCredential` can use system-assigned identity when `AZURE_CLIENT_ID` is unset, subject to the app's actual credential configuration. It does not transfer the developer's local Azure session. For user-assigned identity, set `AZURE_CLIENT_ID` to its client ID or use the SDK's explicit supported selector. When that variable is unset, Portal **Set as AZURE_CLIENT_ID** can select the attached identity for the same **Save and deploy**. This selection changes version configuration and can build a new version; review source/build effects as well as assignment. Once saved, change or remove the variable on **Variables** and deploy a new version to capture the change. Never assume attaching an identity automatically sets this variable.

Application code may call a reachable Key Vault through its SDK with approved identity and secret-read permission; this is distinct from unsupported automatic `keyVaultReference` resolution. Verify token acquisition and one bounded destination operation from the deployed backend. Successful assignment/deployment alone is not a working integration.

## Discover existing resources before requesting endpoint strings

Use available authenticated Azure/Foundry read tools and their discovered schemas, or an already-installed Azure CLI with help-verified account/deployment listing commands. Never require installation of another tool solely to enumerate resources.

1. Start in the user's selected Azure subscription and tenant. List accessible existing Foundry/Azure OpenAI accounts and projects with non-secret metadata only. Do not limit discovery to the Builder app's resource group: its model may be in another group. Broaden to another subscription only when the user selects it.
2. For a supplied Foundry project URL, resolve the project metadata and its associated model resource/connections. Retrieve only non-secret connection metadata; exclude credentials. A project endpoint, model inference endpoint, and deployment name are distinct. Do not reject the URL and send the user back to the Portal if the available tools can resolve it.
3. List existing deployments for the selected resource, including deployment name, underlying model/version, provisioning state, endpoint/API type, and supported authentication where available. A model catalog entry is not a deployment. Report missing metadata as unknown, not an inferred capability.
4. Show a short choice of compatible deployments and ask the user to select when ambiguous. Match the app's actual API and model requirements before configuring it; do not choose the first listed model. An Azure OpenAI deployment name may differ from the catalog model ID.
5. If discovery is unavailable, fails, or access is denied, state exactly what could not be read. Ask only for the unresolved non-secret identifiers, or guide the user to the exact resource/deployment view. Do not claim no models exist from an empty partial listing, request broader roles, or provision a model to bypass discovery.

Discovery does not authorize model invocation, resource creation, role assignments, key retrieval, or charges. Do not call list-keys or secret-bearing connection operations as a discovery step. Management visibility does not prove data-plane access, network reachability, or inference compatibility.

For Azure MCP, discover the available resource/project read tools first. Where available, Foundry's `model_deployment_get` accepts the discovered `foundryAccountResourceId`; omit `deploymentName` to list deployments rather than guessing a model name. Tool names and schemas can vary by host/version, so inspect the exposed schema before calling. Avoid credential-returning project connection tools.

With Azure CLI already available, inspect `az cognitiveservices account list --help` and `az cognitiveservices account deployment list --help`. List accounts in the selected subscription, project only resource IDs/names/kinds/groups/endpoints, then list deployments on the selected account. This is account/deployment discovery, not complete enumeration of every Foundry project or provider type; use available project metadata tools for the supplied project URL. Neither listing needs a service key.

### Match the selected application's API

The published [AI assistant sample](https://github.com/Azure-Samples/app-service-builder-ai-agent) supports OpenAI or Azure OpenAI Responses API text requests, not every model offered by Foundry. Inspect its current README, configuration parser, provider code, and tests before adapting it. For an existing app, preserve its SDK/API unless a change is explicitly chosen.

For that sample's Azure provider, `MODEL_SERVICE=azure-openai`, `AZURE_OPENAI_ENDPOINT` is the Azure OpenAI HTTPS resource origin, and `AZURE_OPENAI_DEPLOYMENT` is an existing compatible deployment name. The backend calls `/openai/v1/responses`. A Foundry project URL ending in `/api/projects/...` is not that origin, and an arbitrary Foundry inference/chat-completions endpoint is not interchangeable with Responses API. Resolve the correct resource endpoint from metadata; do not manufacture it by stripping a project URL or guessing a hostname.

Do not assume this sample's provider code supports token credentials because Builder supports managed identity. Inspect its actual authentication code; a key-based provider needs an explicitly reviewed SDK/code change before using an Entra token provider. Verify endpoint, token audience, deployment/API compatibility, and the selected identity's destination role separately.

The sample also requires `APP_API_TOKEN` for its own `/agent` route. That token, the model provider key, Builder management login, and platform visitor authentication are separate credentials. Do not expose any of them in a frontend. If a browser UI is needed, design a supported backend authentication path rather than shipping the sample bearer token in browser assets.

## Configure without exposing credentials

Explain before credential configuration: Builder variables are shared with all components during build and with HTTP processes at runtime. They are not a managed secret store, have no runtime-only secret setting, and authorized value retrieval can return all desired values. Frontend builds and build scripts can expose them. Automatic `keyVaultReference` resolution is unavailable; app-owned SDK access through managed identity is separate.

If the user accepts this development/test boundary, use an existing narrowly scoped test credential they supply securely outside chat. The user can enter it directly on the app's Variables page, or provide an explicitly approved local settings file for the [variable workflow](operations.md#manage-desired-variables). Keep that file outside the repository and build context; never print it, stage it, echo keys in commands, or retrieve keys just to populate it. Do not collect credentials before explaining the limitation.

Set only the approved app's required settings. Review build commands and frontend environment handling before passing a key to a combined app; never use public/client-prefixed variables for secrets or assume a backend-only variable scope exists. If exposure cannot be ruled out for the proposed build, stop credential configuration and choose a safer design. A separate approved new build/deployment must capture the desired variables; retained versions keep their historical values.

## Verify the integration, not just liveness

Use mocks for local tests until the user authorizes a real model call and its external charges/data handling. After deployment, verify the active version and HTTP behavior, then make one bounded authenticated request with non-sensitive input to the app's actual model route. For the published assistant, `GET /health` proves process liveness only; it does not contact the provider.

Report app serving and model integration separately. A 401, 403, incompatible API/model response, timeout, or unreachable dependency is an integration failure, not a successful assistant. Preserve sanitized status and error details without prompts, keys, or full provider responses; do not fabricate replies, open firewalls, or widen permissions to make the check green.
