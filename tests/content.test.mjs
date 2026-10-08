import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
const sources = JSON.parse(await readFile("src/data/sources.json", "utf8"));
const categories = JSON.parse(
  await readFile("src/data/categories.json", "utf8"),
);
const market = JSON.parse(await readFile("src/data/market.json", "utf8"));
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const docs = await Promise.all(
  (await files("src/content/docs")).map(async (file) => {
    const raw = await readFile(file, "utf8");
    return {
      file,
      id: path.relative("src/content/docs", file).replace(/\.mdx?$/, ""),
      data: parse(raw.split("---")[1]),
      body: raw,
    };
  }),
);
test("all articles resolve sources, categories and related articles", () => {
  const ids = new Set(docs.map((d) => d.id));
  assert.equal(ids.size, docs.length);
  assert.ok(docs.length >= 20);
  const sourceIds = new Set(sources.map((s) => s.id));
  assert.equal(sourceIds.size, sources.length);
  for (const d of docs) {
    assert.ok(
      categories.some((c) => c.id === d.data.category),
      d.file,
    );
    assert.ok(d.data.sources.length, d.file);
    for (const s of d.data.sources)
      assert.ok(sourceIds.has(s), `${d.id}: ${s}`);
    for (const r of d.data.related) assert.ok(ids.has(r), `${d.id}: ${r}`);
    assert.equal(d.data.lang, "it");
  }
  for (const c of categories)
    assert.ok(
      docs.some((d) => d.data.category === c.id),
      `Empty category ${c.id}`,
    );
});
test("official status is backed exclusively by consulted official sources", () => {
  for (const d of docs.filter((d) => d.data.status === "ufficiale")) {
    assert.ok(d.data.lastVerified, d.id);
    for (const id of d.data.sources) {
      const source = sources.find((s) => s.id === id);
      assert.equal(source.type, "ufficiale", d.id);
      assert.ok(source.accessed >= d.data.lastVerified, d.id);
    }
  }
});
test("unreviewed community evidence never receives an observed label or a verification date", () => {
  for (const d of docs.filter((d) =>
    d.data.sources.some((s) => s.startsWith("COMM-")),
  )) {
    assert.notEqual(d.data.status, "osservato", d.id);
    assert.equal(d.data.lastVerified, null, d.id);
  }
});
test("market snapshots preserve their historical scope and provenance", () => {
  assert.equal(market.date, "2026-10-07");
  assert.equal(market.status, "riferito");
  assert.ok(sources.some((s) => s.id === market.source));
  assert.equal(market.unit, "Money");
  for (const r of market.shop) {
    assert.ok(r.buy >= r.sell);
    assert.ok(r.sell >= 0);
    assert.ok(Number.isFinite(r.market));
  }
  for (const r of market.auctionListings) {
    assert.ok(r.quantity > 0);
    assert.ok(r.asking >= 0);
    assert.ok(!("sold" in r));
  }
  assert.equal(
    market.ironSales.reduce((s, r) => s + r.gross, 0),
    429,
  );
});
test("verification and update dates are explicit and chronological", () => {
  for (const d of docs) {
    assert.ok(d.data.published <= d.data.updated, d.id);
    if (d.data.lastVerified)
      assert.ok(d.data.lastVerified <= d.data.updated, d.id);
    assert.ok(!d.body.includes("Date.now()"));
  }
});
