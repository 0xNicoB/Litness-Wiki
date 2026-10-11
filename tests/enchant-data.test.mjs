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
    if (e.verificationStatus === "osservato") {
      assert.equal(source.type, "osservato", e.name);
      assert.equal(e.observed, source.observed, e.name);
      assert.ok(e.timestampSeconds >= 0 && e.timestampSeconds < 77.18, e.name);
    } else if (e.verificationStatus === "ufficiale") {
      assert.equal(source.type, "ufficiale", e.name);
      assert.equal(e.sourceDate, source.published, e.name);
      assert.ok(
        e.verified >= e.sourceDate && source.accessed >= e.verified,
        e.name,
      );
      assert.equal(e.timestampSeconds, undefined, e.name);
    }
    if (e.procChance != null)
      assert.ok(e.procChance >= 0 && e.procChance <= 100, e.name);
    if (e.cooldownSeconds != null) assert.ok(e.cooldownSeconds > 0, e.name);
    if (e.procChanceRange)
      assert.ok(
        e.procChanceRange.min >= 0 &&
          e.procChanceRange.min <= e.procChanceRange.max &&
          e.procChanceRange.max <= 100,
        e.name,
      );
    for (const change of e.changes ?? []) {
      const patch = sources.find((s) => s.id === change.source);
      assert.equal(patch?.type, "ufficiale", e.name);
      assert.equal(change.date, patch.published, e.name);
      assert.ok(change.note, e.name);
    }
    if (e.officialSource)
      assert.equal(
        sources.find((s) => s.id === e.officialSource)?.type,
        "ufficiale",
      );
  }
});

test("later official enchant changes retain partial fields and supersede old effects", () => {
  const confusion = enchants.find((e) => e.id === "confusion");
  assert.equal(confusion.source, "LIT-PATCH-09");
  assert.equal(confusion.rarity, "Epico");
  assert.equal(confusion.cooldownSeconds, 20);
  assert.deepEqual(confusion.procChanceRange, { min: 1, max: 4 });
  assert.equal(confusion.maxLevel, undefined);
  assert.equal(confusion.compatibleItems, undefined);
  for (const id of ["green-thumb", "harvest-hoe"])
    assert.equal(enchants.find((e) => e.id === id).source, "LIT-PATCH-11");
  for (const id of ["nether-prospector", "ignis-furnace"])
    assert.ok(
      enchants
        .find((e) => e.id === id)
        .changes.some((c) => c.source === "LIT-PATCH-10"),
    );
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
