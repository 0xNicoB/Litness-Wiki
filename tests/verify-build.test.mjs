import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const origin = "https://litness-wiki.pages.dev";
const verificationName = "googleb99d9db8ab55914d.html";
const original = await readFile(`public/${verificationName}`);
const article = "/wiki/it/test/";

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "litness-build-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  async function put(name, contents) {
    const file = path.join(root, name);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, contents);
  }
  function page(route, is404 = false) {
    return `<html lang="it"><head><title>Pagina di verifica</title>
      <meta name="description" content="Fixture del validatore">
      <meta name="robots" content="${is404 ? "noindex" : "index"}">
      <link rel="canonical" href="${origin}${route}">
      <meta property="og:image" content="${origin}/images/social.png">
      <script type="application/ld+json">${JSON.stringify({
        "@type": "Article",
        mainEntityOfPage: origin + route,
        datePublished: "2026-10-08",
        dateModified: "2026-10-08",
      })}</script></head><body><main id="main"><h1>Pagina</h1></main>
      <footer>Non affiliata o gestita da Litness Ltd.</footer></body></html>`;
  }
  for (const name of [
    "favicon.svg",
    "images/hero.webp",
    "images/social.png",
    "pagefind/pagefind.js",
  ])
    await put(name, "fixture");
  await put("index.html", page("/"));
  await put("404.html", page("/404/", true));
  await put("wiki/it/test/index.html", page(article));
  await put(verificationName, original);
  await put(
    "pagefind/pagefind-entry.json",
    JSON.stringify({ languages: { it: { page_count: 1 } } }),
  );
  await put(
    "robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap-index.xml\n`,
  );
  async function sitemap(locations) {
    await put(
      "sitemap-0.xml",
      `<urlset>${locations.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`,
    );
  }
  await sitemap([origin + "/", origin + article]);
  function run() {
    const result = spawnSync(
      process.execPath,
      ["scripts/verify-build.mjs", root],
      {
        encoding: "utf8",
        env: { ...process.env, PUBLIC_SITE_URL: origin },
      },
    );
    return { status: result.status, output: result.stdout + result.stderr };
  }
  return { root, put, sitemap, run };
}

test("root verification is preserved and excluded from page, sitemap and Pagefind counts", async (t) => {
  const f = await fixture(t);
  assert.equal(f.run().status, 0);
  assert.deepEqual(
    await readFile(path.join(f.root, verificationName)),
    original,
  );
});

test("a verification file modified during build is rejected", async (t) => {
  const f = await fixture(t);
  await f.put(verificationName, Buffer.concat([original, Buffer.from("\n")]));
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /verification file changed during build/);
});

test("verification markup and mismatched tokens are rejected", async (t) => {
  const f = await fixture(t);
  await f.put(
    verificationName,
    "<html>google-site-verification: google0000.html</html>",
  );
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /invalid Google verification content/);
});

test("nested Google files and ordinary HTML keep the page SEO checks", async (t) => {
  const f = await fixture(t);
  await f.put(`nested/${verificationName}`, original);
  await f.put("google-guide.html", "An ordinary page without SEO");
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /nested\/google.*: missing title/);
  assert.match(result.output, /google-guide\.html: missing title/);
});

test("a verification URL in the sitemap is rejected", async (t) => {
  const f = await fixture(t);
  await f.sitemap([origin + "/", origin + "/" + verificationName]);
  assert.equal(f.run().status, 1);
});

test("duplicate sitemap URLs cannot conceal a missing article", async (t) => {
  const f = await fixture(t);
  await f.sitemap([origin + "/", origin + "/"]);
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /Sitemap URLs, duplicates/);
});

test("broken resources still fail the build", async (t) => {
  const f = await fixture(t);
  const home = await readFile(path.join(f.root, "index.html"), "utf8");
  await f.put(
    "index.html",
    home.replace("</main>", '<a href="/missing/">Broken</a></main>'),
  );
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /broken resource \/missing\//);
});

test("Pagefind counts remain enforced", async (t) => {
  const f = await fixture(t);
  await f.put(
    "pagefind/pagefind-entry.json",
    JSON.stringify({ languages: { it: { page_count: 2 } } }),
  );
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.output, /Pagefind count mismatch/);
});
