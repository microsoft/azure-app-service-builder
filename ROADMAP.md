# Customer-facing roadmap

This roadmap is intended to describe curated customer outcomes for Azure App Service Builder. It is separate from raw feedback, bugs, and private engineering work. It is not a list of every requested feature.

The [Azure App Service Builder roadmap Project](https://github.com/orgs/microsoft/projects/2525) is linked to this repository and is currently **private and empty**. No roadmap issues or draft items have been populated. The repository and Project remain private until separately approved for customer-facing publication; only users with appropriate access can view them now.

No launch date, release scope, supported capability, or delivery commitment is implied by this setup. Product-specific resources will be linked when available.

## How to participate

Share a customer problem through the [feature request form](https://github.com/microsoft/azure-app-service-builder/issues/new?template=02-feature-request.yml), use [general feedback](https://github.com/microsoft/azure-app-service-builder/issues/new?template=01-general-feedback.yml), or submit a [bug report](https://github.com/microsoft/azure-app-service-builder/issues/new?template=03-bug-report.yml). Search first and react to relevant existing issues. Customers create ordinary feedback issues and, when they have access, can read, comment, react, and subscribe to official roadmap issues.

Designated maintainers consolidate related feedback into a high-level outcome and create a new, team-authored canonical issue in this same repository using an authorized maintainer's GitHub account. They link the original customer feedback, apply `roadmap`, and manually add the canonical issue to the Project after its customer-facing wording is approved. [Browse roadmap issues](https://github.com/microsoft/azure-app-service-builder/issues?q=is%3Aissue%20label%3Aroadmap), including closed issues.

Do not promote a customer-authored issue into the official roadmap by relabeling it or adding it to the Project: its original author retains title/body editing rights. Keep that feedback issue separate and link it from the maintainer-authored canonical issue instead.

Raw feedback and private engineering tasks are not automatically added, mirrored, or published. Repository association does not import issues. Designated maintainers curate official roadmap issues and set the Project fields; customers continue to use the feedback forms.

## Authorship and permissions

This is a one-repository model: ordinary customer feedback and team-authored official roadmap issues live in this repository. Designated maintainers manage official issue titles, bodies, and labels under repository permissions. Issue authorship also matters: labeling or moving an issue does not remove its author's editing rights. Repository users with sufficient permissions, and normal organization/admin authority, retain their GitHub rights.

Project inclusion, Status, and Release stage are controlled by separate Project permissions. Ordinary issue creation, reading, commenting, reactions, or subscriptions do not grant Project write access or let a customer self-publish an item onto the curated board.

GitHub does not provide per-label or per-template author ACLs for this model. The `roadmap` label, an issue title, and the form chooser are not permission boundaries; an ordinary issue does not become official merely by naming it a roadmap item.

**The initial maintainer is selected, but editing access is not yet locked down.** This setup has not changed repository or Project permissions, and existing direct, team, and inherited grants still apply. Before publication, authorized repository and Project administrators must apply the approved maintainer roster and review repository access and Project base/collaborator roles separately. Selecting a maintainer or being able to edit a Project does not establish authority to manage access. This documents the intended governance, not a claim that only the selected maintainer can currently edit.

## Work status

The built-in single-select **Status** field tracks work completion:

| Status | Meaning |
| --- | --- |
| Backlog | The customer outcome is captured for consideration; delivery is not committed. |
| Approved | The outcome is accepted for planning; scope and priorities may change. |
| In progress | Work on the customer outcome is underway. |
| Under review | The outcome is being reviewed before work completion. |
| Done | Work is complete; customer availability is tracked separately in Release stage. |

**Done does not mean deployed or available to customers.** Closing an issue does not establish a release stage, and GA is never inferred from issue closure. Status expresses workflow progress, not promised dates or guaranteed delivery.

## Release stage

The separate single-select **Release stage** field records deployment and availability for completed work:

| Release stage | Meaning |
| --- | --- |
| Pending deployment | Completed work awaits deployment; customer availability is not established. |
| Private preview | Verified availability to a limited invited audience. |
| Public preview | Verified public preview availability under its published scope. |
| GA | Verified general availability under its published scope. |

Leave Release stage blank until it is applicable and verified. For a Done item, use Pending deployment when deployment is still pending; move through availability stages only when there is supporting evidence. Keep Status at Done as the release stage changes. These values describe the specific outcome and its verified scope, not the product's overall availability or a future release promise.

## Project views

| View | Layout and grouping | Filter |
| --- | --- | --- |
| [Workflow](https://github.com/orgs/microsoft/projects/2525/views/2) | Board with columns grouped by Status | All manually curated Project items |
| [Release availability](https://github.com/orgs/microsoft/projects/2525/views/3) | Board with columns grouped by Release stage | `status:Done` |

Both views show Title, Status, and Release stage on cards. The release view includes Done items with no release stage yet; an unset value is not an availability claim. Completed items remain on the Project as their release stage changes instead of being archived.

The Project has no automation workflows. There is no automatic issue import, private-repository auto-add, work/release-stage synchronization, issue closure, or archiving. Maintainers update the fields and issue summaries explicitly.

## Maintainer-authored item structure

This structure stays here, outside the customer Issue Form chooser. A designated maintainer authors a new canonical issue only after the outcome and its customer-facing wording are approved; do not reuse a customer-authored issue. Apply `roadmap`, use a concise customer-outcome title, and keep the body at customer level:

```markdown
### Customer outcome
Describe the customer problem and the intended benefit.

### Scope
Describe the high-level outcome and important boundaries without private engineering details.

### Status
Record the Project's Status: Backlog, Approved, In progress, Under review, or Done.

### Release stage
If applicable, record Pending deployment, Private preview, Public preview, or GA.
Otherwise leave this unspecified and the Project field blank.

### Availability evidence
Summarize verified deployment or availability evidence and its scope.
Link published public resources or an approved public availability statement.
If availability is not established, say so; do not infer it from Done or closure.

### Related feedback
Link the original customer feedback issues without replacing them.
Include public feedback only; omit private issues and internal links.

### Latest update
Record the date and a brief public explanation of the current direction.

### Resources
Link published public resources, or state that none are published yet.
```

Treat the Project fields as the structured workflow and release-stage record, and keep the corresponding issue-body summaries consistent with them manually. Maintain the latest update and explain significant changes. Record preview or GA availability only after it is verified and its customer-facing explanation is approved.

Do not expose private implementation plans, internal owners, private issue references, restricted preview links, or unapproved dates. Publish only approved customer-level outcomes when repository and Project publication have been separately authorized. This setup creates the empty private Project and its views, not roadmap commitments or automatic publication.
