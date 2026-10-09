# Customer-facing roadmap

This roadmap is intended to describe curated customer outcomes for Azure App Service Builder. It is separate from raw feedback, bugs, and private engineering work. It is not a list of every requested feature.

**There are no approved roadmap items published here yet.** No launch date, release scope, supported capability, or delivery commitment is implied by this scaffold. Product-specific resources will be linked when available.

## How to participate

Share a customer problem through the [feature request form](https://github.com/microsoft/azure-app-service-builder/issues/new?template=02-feature-request.yml) or use [general feedback](https://github.com/microsoft/azure-app-service-builder/issues/new?template=01-general-feedback.yml). Search first and react to relevant existing issues. Customers do not need to assign a roadmap label or status.

Maintainers may consolidate related feedback into a high-level outcome and publish a separately authored issue labeled `roadmap`. [Browse roadmap items](https://github.com/microsoft/azure-app-service-builder/issues?q=is%3Aissue%20label%3Aroadmap), including closed items. A label on an issue identifies a curated item; the explicitly maintained status in its body describes intent.

## Lifecycle

| Status | Meaning |
| --- | --- |
| Under consideration | The customer problem is being evaluated; delivery is not planned. |
| Planned | There is intent to address the outcome, subject to change. |
| In progress | Work toward the outcome is underway; scope can still change. |
| Available | A published resource confirms the outcome is available and describes its scope. |
| Not planned | There is no current intent to deliver the outcome; include the public rationale. |

Statuses express direction, not promised dates or guaranteed delivery. Priorities and scope may change. Closing an issue alone does not mean the outcome is available.

## Maintainer-authored item structure

This structure is for maintainers, not another customer intake form. Create an item only after the outcome and its public wording are approved. Apply `roadmap`, use a concise customer-outcome title, and keep the body at customer level:

```markdown
### Customer outcome
Describe the customer problem and the intended benefit.

### Scope
Describe the high-level outcome and important boundaries without private engineering details.

### Status
Choose one lifecycle status from ROADMAP.md.

### Related feedback
Link relevant public feedback only; omit private issues and internal links.

### Latest update
Record the date and a brief public explanation of the current direction.

### Resources
Link published public resources, or state that none are published yet.
```

Maintain the latest update and explain significant changes. Mark an outcome `Available` only when there is a real public resource supporting that status. Do not expose private implementation plans, internal owners, private issue references, or unapproved dates.

A separate public GitHub Project could later present these curated items. This setup does not create a Project, synchronization automation, additional status labels, or roadmap commitments.
