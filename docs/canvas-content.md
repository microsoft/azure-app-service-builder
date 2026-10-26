# Approved canvas content

The canvas runtime and its five host launcher skills update only with a separately
installed runtime package. Approved product guidance and exact template references
can update independently. Native adapters, permission checks, execution guards,
app files, forks and cloud resources never update through this feed.

Content 1.0.1 refreshes the product guidance to plugin 0.1.3, including
discovery-first setup, existing platform access assumptions, source recovery,
and model connections. Template revisions and runtime compatibility are unchanged.
Schema 1 accepts exactly four reference sections, so this snapshot appends the
new model-service reference to `operations` and rewrites its internal links to
the corresponding section anchors. It does not require a runtime schema change.
The guidance commit identifies the public source revision before this packaging
adaptation. The historical 1.0.0 snapshot remains unchanged.

## Client behavior

The fixed public pointer is
`https://raw.githubusercontent.com/microsoft/azure-app-service-builder/main/canvas-content/approved.json`.
It names one actual 40-character content commit, a versioned JSON path, SHA-256
digest and supported runtime range. Clients accept only this repository/path
contract, never arbitrary downloads or redirected destinations. The approved
GitHub HTTPS channel is the trust root. SHA-256 verifies bytes; this is **not an
independently signed manifest**.

Opening a panel starts a nonblocking check, at most once per six hours. Settings
shows the result and offers **Check for updates**, limited to once per minute.
These credential-free reads have a 15-second total timeout and bounded streaming
responses: 4 KiB pointer and 96 KiB content. No scripts, archives or dependencies
are fetched or executed. Synthetic mode stays completely offline.

New journeys snapshot the latest verified compatible content. Existing journeys
retain their exact content version, digest, guidance and template metadata across
updates, offline use and provider restart. Older journeys without a snapshot keep
the original bundled content. The entire serialized workflow, including its
snapshot, must fit the existing 256 KiB limit before any write. Snapshots are
validated again on load. Cleanup and archive scans retain the same bounded,
streamed fail-closed safety checks; uncertain cloud and fork protections do not
depend on which content version is current.

Private cache files live alongside workflow storage in `artifacts/content`
under the installed Builder extension, or under the explicit session storage
root when one is supplied. Immutable digest-addressed snapshots and atomic
current/previous pointers survive partial downloads. The cache accepts at most
64 snapshots and 256 directory entries; it never silently deletes old versions.
Workflow recovery does not require the cache because snapshots are embedded.
Concurrent providers use an exclusive update lock. An interrupted lock blocks
updates visibly; a maintainer must establish that no updater owns it before
removing that specific local lock. It is not automatically stolen.

Missing/unpublished pointers (HTTP 404), incompatible content, checksum/schema
errors, timeouts, corrupt caches, downgrades and reused-version conflicts remain
visible in Settings. The packaged or last verified compatible content remains
usable. A missing first pointer is not a successful update. Failed check outcomes
and throttling survive restart. Corrupt current snapshots fall back to the
previous verified snapshot or packaged content; orphan/partial files are not
selected.

Template IDs and Azure-Samples repository identities remain runtime-owned.
Each template names an exact approved commit, branch and root manifest. Changing
any historical source binding cannot inherit prior Staging/cloud qualification;
updated references are labeled approved content only and require their own
qualification. Approval of guidance is not approval of a cloud operation.

## Publish in two separately reviewed steps

Do not put a commit's own SHA inside content in that same commit. Do not approve
mutable `main` automatically. The repository may have no feed yet; ship the
runtime's packaged baseline first if necessary and leave the visible 404 behavior.

1. **Immutable content PR.** Review the product guidance, MIT notice, version,
   runtime range and all template commits/manifests. Preserve exact historical
   evidence only for unchanged bindings. Increment content version for changed
   bytes. Generate compact JSON plus a final LF, and never overwrite an existing
   version directory:

   ```sh
   node scripts/canvas-content.mjs generate reviewed-content.json .
   node scripts/canvas-content.mjs validate canvas-content/versions/1.0.0/content.json
   ```

   Merge the approved versioned content and tooling first. Record its **actual
   full merged commit**. Verify that the exact public commit URL returns those
   same bytes. An offline validator cannot prove that a supplied SHA exists,
   passed review or is public.

2. **Reviewed pointer PR.** Only after step 1, generate a candidate pointer using
   that actual content commit. The output must be a new file:

   ```sh
   node scripts/canvas-content.mjs pointer canvas-content/versions/1.0.0/content.json ACTUAL_40_CHARACTER_CONTENT_COMMIT canvas-content/approved.next.json
   node scripts/canvas-content.mjs validate canvas-content/versions/1.0.0/content.json canvas-content/approved.next.json
   ```

   Review and replace `canvas-content/approved.json` with the candidate in the
   pointer PR. Check the exact raw commit URL, digest, runtime range and public
   access without credentials before merging. The pointer PR commit is not the
   content commit; there is no circular hash dependency. Until this PR merges,
   clients retain their prior verified content (or show unpublished feed).

New runtime releases and public prereleases remain separate, explicit publication
steps. Never replace an already published immutable prerelease, move its tag, or
claim new cloud qualification from this feed. To correct bad approved content,
publish a higher version through both reviews; clients reject rollback pointers.
