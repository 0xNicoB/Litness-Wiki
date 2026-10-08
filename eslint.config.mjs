import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  { rules: { "@typescript-eslint/no-explicit-any": "error" } },
];
