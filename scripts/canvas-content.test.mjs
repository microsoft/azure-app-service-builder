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
