import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);
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
const htmls = (await files(root)).filter((f) => f.endsWith(".html"));
const failures = [];
const origin = process.env.PUBLIC_SITE_URL?.trim();
const cache = new Map();
async function document(file) {
  if (!cache.has(file)) cache.set(file, load(await readFile(file, "utf8")));
  return cache.get(file);
}
async function exists(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}
let links = 0;
for (const file of htmls) {
  const $ = await document(file);
  const route =
    "/" +
    path
      .relative(root, file)
      .replaceAll(path.sep, "/")
      .replace(/index\.html$/, "");
  for (const [label, valid] of [
    ["lang", $("html").attr("lang") === "it"],
    ["title", $("title").text().length > 3],
    ["description", !!$('meta[name="description"]').attr("content")],
    ["h1", $("h1").length === 1],
    ["main", $("main#main").length === 1],
    [
      "disclaimer",
      $("footer").text().includes("Non affiliata o gestita da Litness Ltd."),
    ],
  ])
    if (!valid) failures.push(`${route}: missing ${label}`);
  if (origin && file !== path.join(root, "404.html")) {
    const canonical = $('link[rel="canonical"]').attr("href");
    if (canonical !== new URL(route, origin).href)
      failures.push(`${route}: invalid canonical`);
    if (
      $('meta[property="og:image"]').attr("content") !==
      new URL("/images/social.png", origin).href
    )
      failures.push(`${route}: missing social card`);
    if (route.startsWith("/wiki/it/")) {
      const schema = JSON.parse(
        $('script[type="application/ld+json"]').first().text() || "{}",
      );
      if (
        schema["@type"] !== "Article" ||
        schema.mainEntityOfPage !== canonical ||
        !schema.datePublished ||
        !schema.dateModified
      )
        failures.push(`${route}: invalid article schema`);
    }
  }
  if (
    !origin &&
    ($('link[rel="canonical"]').length ||
      $('meta[property="og:url"],meta[property="og:image"]').length)
  )
    failures.push(`${route}: absolute SEO URL without configured origin`);
  if (
    file === path.join(root, "404.html") &&
    $('meta[name="robots"]').attr("content") !== "noindex"
  )
    failures.push("404 must be noindex");
  for (const element of $(
    "a[href],img[src],script[src],link[href]",
  ).toArray()) {
    const href = $(element).attr("href") ?? $(element).attr("src");
    if (!href || /^(https?:|mailto:|data:|tel:)/.test(href)) continue;
    const u = new URL(href, "https://wiki.invalid" + route);
    let target = path.join(root, decodeURIComponent(u.pathname));
    if (!(await exists(target))) target = path.join(target, "index.html");
    if (!(await exists(target))) {
      failures.push(`${route}: broken resource ${href}`);
      continue;
    }
    links++;
    if (u.hash && target.endsWith(".html")) {
      const targetDoc = await document(target);
      const id = decodeURIComponent(u.hash.slice(1));
      if (
        !targetDoc("[id]")
          .toArray()
          .some((e) => targetDoc(e).attr("id") === id)
      )
        failures.push(`${route}: missing anchor ${href}`);
    }
  }
}
for (const required of [
  "404.html",
  "robots.txt",
  "favicon.svg",
  "images/hero.webp",
  "images/social.png",
  "pagefind/pagefind.js",
  "pagefind/pagefind-entry.json",
])
  if (!(await exists(path.join(root, required))))
    failures.push(`Missing file: ${required}`);
const index = JSON.parse(
  await readFile(path.join(root, "pagefind/pagefind-entry.json"), "utf8"),
);
const robots = await readFile(path.join(root, "robots.txt"), "utf8");
if (origin) {
  const sitemap = load(
    await readFile(path.join(root, "sitemap-0.xml"), "utf8"),
    { xmlMode: true },
  );
  const locations = sitemap("loc")
    .map((_, el) => sitemap(el).text())
    .get();
  if (
    locations.length !== htmls.length - 1 ||
    locations.some(
      (url) =>
        !url.startsWith(new URL(origin).origin + "/") ||
        /\/404(?:\/|\.html)$/.test(url),
    )
  )
    failures.push("Sitemap origin, route count or 404 exclusion is invalid");
  if (
    !robots.includes(`Sitemap: ${new URL("/sitemap-index.xml", origin).href}`)
  )
    failures.push("robots sitemap URL is invalid");
} else if (
  (await exists(path.join(root, "sitemap-index.xml"))) ||
  robots.includes("Sitemap:")
)
  failures.push("Sitemap must be omitted without configured origin");
const articleCount = htmls.filter((file) => /\/wiki\/it\//.test(file)).length;
if (index.languages.it?.page_count !== articleCount)
  failures.push(
    `Pagefind count mismatch: ${index.languages.it?.page_count} vs ${articleCount}`,
  );
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Verified ${htmls.length} HTML pages, ${links} internal resources/anchors, SEO and Pagefind (${index.languages.it.page_count} articles).`,
  );
