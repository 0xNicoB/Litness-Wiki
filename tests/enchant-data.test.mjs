import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const read = async (file) => JSON.parse(await readFile(file, "utf8"));
const enchants = await read("src/data/enchants.json");
const sources = await read("src/data/sources.json");
const observations = await read("src/data/observations-2026-10-09.json");

test("catalog evidence resolves sources and distinguishes unknown fields from zero", () => {
  const ids = new Set();
  const names = new Set();
  for (const e of enchants) {
    assert.match(e.id, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(!ids.has(e.id) && !names.has(e.name), e.name);
    ids.add(e.id);
    names.add(e.name);
    const source = sources.find((s) => s.id === e.source);
    assert.ok(source, e.name);
    if (e.verificationStatus === "osservato")
      assert.equal(source.type, "osservato", e.name);
    assert.equal(e.observed, source.observed, e.name);
    assert.ok(e.timestampSeconds >= 0 && e.timestampSeconds < 77.18, e.name);
    if (e.procChance != null)
      assert.ok(e.procChance >= 0 && e.procChance <= 100, e.name);
    if (e.cooldownSeconds != null) assert.ok(e.cooldownSeconds > 0, e.name);
    if (e.officialSource)
      assert.equal(
        sources.find((s) => s.id === e.officialSource)?.type,
        "ufficiale",
      );
  }
});

test("average yield is never classified as an activation probability", () => {
  const e = enchants.find((e) => e.id === "nether-prospector");
  assert.equal(e.averageYieldBonusPct, 110);
  assert.equal(e.procChance, undefined);
  assert.ok(e.restrictions.some((r) => r.includes("piazzati")));
  assert.deepEqual(e.conflicts, ["Fortune", "Silk Touch"]);
});

test("documented reciprocal conflicts remain consistent", () => {
  const byName = new Map(enchants.map((e) => [e.name, e]));
  for (const e of enchants) {
    for (const conflict of e.conflicts ?? []) {
      const other = byName.get(conflict);
      if (other?.conflicts)
        assert.ok(other.conflicts.includes(e.name), `${e.name} / ${conflict}`);
    }
  }
});

test("revision ledger resolves destinations and preserves event dates and uncertainty", async () => {
  const ids = new Set();
  for (const o of observations) {
    assert.ok(!ids.has(o.id));
    ids.add(o.id);
    await access(`src/content/docs/${o.page}.mdx`);
    assert.ok(sources.some((s) => s.id === o.source));
    assert.equal(o.reviewed, "2026-10-09");
    assert.ok(o.information && o.limitations);
    if (o.status === "osservato")
      assert.equal(sources.find((s) => s.id === o.source).type, "osservato");
  }
  assert.equal(
    observations.find((o) => o.id === "riavvio-08").sourceDate,
    "2026-10-08",
  );
  assert.equal(
    observations.find((o) => o.id === "conteggio-enchant").status,
    "da-verificare",
  );
  assert.equal(observations.find((o) => o.id === "ah").status, "riferito");
});
