import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { run } from "./canvas-content.mjs";

test("seed validates offline; generation is immutable and pointer requires a full actual-commit identity", async t => {
    const root = await mkdtemp(path.join(tmpdir(), "canvas-content-publisher-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const seed = new URL("../canvas-content/versions/1.0.0/content.json", import.meta.url);
    const source = JSON.parse(await readFile(seed, "utf8"));
    assert.match(await run(["validate", seed]), /Validated content 1.0.0/);
    const input = path.join(root, "reviewed.json");
    await writeFile(input, JSON.stringify(source, null, 2));
    await run(["generate", input, root]);
    await assert.rejects(run(["generate", input, root]), { code: "EEXIST" });
    const generated = path.join(root, "canvas-content/versions/1.0.0/content.json");
    assert.deepEqual(await readFile(generated), await readFile(seed));
    const candidate = path.join(root, "approved.next.json");
    await assert.rejects(run(["pointer", generated, "main", candidate]));
    assert.match(await run(["pointer", generated, "a".repeat(40), candidate]), /does not establish/);
    await run(["validate", generated, candidate]);
    const pointer = JSON.parse(await readFile(candidate));
    pointer.sha256 = "0".repeat(64);
    await writeFile(candidate, JSON.stringify(pointer));
    await assert.rejects(run(["validate", generated, candidate]), /does not match/);
    await assert.rejects(run(["pointer", generated, "a".repeat(40), candidate]), { code: "EEXIST" });
});

test("1.0.1 refreshes product guidance without changing runtime schema or template bindings", async () => {
    const previous = JSON.parse(await readFile(new URL("../canvas-content/versions/1.0.0/content.json", import.meta.url), "utf8"));
    const currentFile = new URL("../canvas-content/versions/1.0.1/content.json", import.meta.url);
    const current = JSON.parse(await readFile(currentFile, "utf8"));
    assert.match(await run(["validate", currentFile]), /Validated content 1.0.1/);
    assert.equal(current.schemaVersion, previous.schemaVersion);
    assert.equal(current.runtimeMin, previous.runtimeMin);
    assert.equal(current.runtimeMaxExclusive, previous.runtimeMaxExclusive);
    assert.deepEqual(current.catalog, previous.catalog);
    assert.deepEqual(Object.keys(current.guidance.references), Object.keys(previous.guidance.references));
    assert.equal(current.guidance.pluginVersion, "0.1.3");
    assert.equal(current.guidance.commit, "8624a4ac56f1eee24ee51f1f32df7109fb4bab91");
    assert.equal(current.guidance.licenseText, previous.guidance.licenseText);
    assert.match(current.guidance.skill, /Assume users already have platform access/);
    assert.match(current.guidance.skill, /references\/operations\.md#model-services-and-external-dependencies/);
    assert.match(current.guidance.references.operations, /# Model services and external dependencies/);
    assert.match(current.guidance.references.operations, /## Configure without exposing credentials/);
    assert.match(current.guidance.references.operations, /Do not call list-keys/);
    for (const text of [current.guidance.skill, ...Object.values(current.guidance.references)]) {
        assert.doesNotMatch(text, /\]\([^)]*model-services\.md/);
        assert.doesNotMatch(text, /\b(?:contact|ask|confirm with)\s+(?:your|the)\s+preview contact\b/i);
    }
});

test("published pointer matches its immutable local content bytes", async () => {
    const pointerFile = new URL("../canvas-content/approved.json", import.meta.url);
    const pointer = JSON.parse(await readFile(pointerFile, "utf8"));
    assert.match(pointer.path, /^canvas-content\/versions\/\d+\.\d+\.\d+\/content\.json$/);
    await run(["validate", new URL(`../${pointer.path}`, import.meta.url), pointerFile]);
});
