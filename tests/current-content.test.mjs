import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { parse } from "yaml";
const read = (file) => readFile(file, "utf8");
const root = "src/content/docs/it/";
const sources = JSON.parse(await read("src/data/sources.json"));
const revisions = JSON.parse(await read("src/data/revisions-2026-10-12.json"));
const old = JSON.parse(await read("src/data/observations-2026-10-09.json"));

test("current guides resolve official supersessions rather than combining incompatible rules", async () => {
  const claim = await read(root + "territori/claim.mdx");
  assert.match(claim, /più claim/);
  assert.match(claim, /limite personale/);
  assert.match(claim, /almeno 5 chunk/);
  assert.doesNotMatch(claim, /(?:soltanto|solo|un solo) claim per giocatore/);
  assert.doesNotMatch(
    claim,
    /almeno 7 chunk|forma (?:obbligatoriamente )?quadrata/,
  );
  const dungeon = await read(root + "pve/dungeon.mdx");
  assert.match(dungeon, /8 ore/);
  assert.match(dungeon, /6 ore/);
  assert.match(
    dungeon,
    /appartenenza allo stesso claim non è più un requisito/,
  );
  assert.doesNotMatch(dungeon, /24 ore|36 ore|48 ore/);
  assert.match(dungeon, /countdown/);
  assert.match(dungeon, /unico per party/);
  const resource = await read(root + "pve/risorse.mdx");
  assert.match(resource, /3 slot/);
  assert.match(resource, /armatura/);
  assert.match(resource, /RIFERITO|riferit/);
  assert.doesNotMatch(resource, /si perde (?:sempre |necessariamente )?tutto/);
  const history = await read(root + "informazioni/aggiornamenti.mdx");
  assert.match(history, /un solo claim per giocatore/);
  assert.match(history, /24 ore Cavaliere, 36 ore Illusionista, 48 ore Nido/);
  for (const day of [5, 7, 8, 9, 10, 11])
    assert.equal(
      (history.match(new RegExp(`^## ${day} ottobre 2026$`, "gm")) ?? [])
        .length,
      1,
    );
});

test("new provenance resolves sources, chronology, destinations and superseded evidence", async () => {
  assert.equal(new Set(revisions.map((r) => r.id)).size, revisions.length);
  for (const r of revisions) {
    await access(`src/content/docs/${r.page}.mdx`);
    const body = await read(`src/content/docs/${r.page}.mdx`);
    const meta = parse(body.split("---")[1]);
    assert.ok(r.statement && Array.isArray(r.openQuestions), r.id);
    assert.ok(r.sourceDate <= r.reviewed, r.id);
    for (const id of r.sources) {
      const source = sources.find((s) => s.id === id);
      assert.ok(source && meta.sources.includes(id), `${r.id}: ${id}`);
      if (r.status === "ufficiale")
        assert.equal(source.type, "ufficiale", r.id);
    }
    for (const previous of r.supersedes ?? [])
      assert.ok(
        old.some((o) => o.id === previous.split(":")[1]),
        r.id,
      );
  }
  assert.equal(
    revisions.find((r) => r.id === "dungeon-cooldown").sourceDate,
    "2026-10-10",
  );
  assert.equal(
    revisions.find((r) => r.id === "dungeon-party").sourceDate,
    "2026-10-11",
  );
  assert.equal(
    revisions.find((r) => r.id === "resource-death").status,
    "riferito",
  );
});

test("Discord-derived sources preserve dates and cannot imply verified staff roles", () => {
  for (let day = 1; day <= 11; day++) {
    const s = sources.find(
      (s) => s.id === `COMM-DISCORD-${String(day).padStart(2, "0")}`,
    );
    assert.equal(s?.type, "riferito");
    assert.equal(s.observed, `2026-10-${String(day).padStart(2, "0")}`);
    assert.match(
      s.note,
      /non prova i ruoli staff|ruoli staff non verificabili/,
    );
    assert.equal(s.url, undefined);
  }
});

async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? files(`${dir}/${e.name}`) : `${dir}/${e.name}`,
      ),
    )
  ).flat();
}
test("public source and asset trees contain no Discord dump or private message IDs", async () => {
  for (const file of await files("public"))
    assert.doesNotMatch(file, /italian_chat|Recording|\.mp4$|private/i);
  for (const dir of ["src/content", "src/data", "docs/research"])
    for (const file of await files(dir)) {
      const body = await read(file);
      assert.doesNotMatch(
        body,
        /\b\d{18,19}\b|<@!?\d+>|"author_id"|"message_id"/,
        file,
      );
    }
});
