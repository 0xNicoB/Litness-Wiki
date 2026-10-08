import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
const origin = process.env.PUBLIC_SITE_URL?.trim();
if (
  origin &&
  (new URL(origin).protocol !== "https:" ||
    new URL(origin).pathname !== "/" ||
    new URL(origin).search ||
    new URL(origin).hash ||
    new URL(origin).username ||
    new URL(origin).password)
)
  throw new Error("PUBLIC_SITE_URL must be an HTTPS origin without a path");
export default defineConfig({
  ...(origin ? { site: origin } : {}),
  output: "static",
  trailingSlash: "always",
  integrations: [
    mdx(),
    ...(origin
      ? [
          sitemap({
            filter: (url) =>
              !url.endsWith("/404/") && !url.endsWith("/404.html"),
          }),
        ]
      : []),
  ],
  vite: { plugins: [tailwindcss()] },
});
