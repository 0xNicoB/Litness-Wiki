# Litness Wiki

Wiki italiana indipendente del server Minecraft Litness. Non affiliata o gestita da Litness Ltd.

Prima release: **27 articoli**, 8 categorie, HTML statico Astro, ricerca locale Pagefind, font self-hosted e layout responsive. Nessun database, login o servizio indispensabile esterno.

## Sviluppo

Richiede Node 22.16.0 (vedi `.nvmrc`) e npm. Il runtime locale 24 è compatibile; Cloudflare usa la versione dichiarata.

```bash
npm ci
npm run dev
```

Il dev server usa la porta 4321. La ricerca richiede l’indice della build: per provarla usa la preview di produzione.

```bash
npm run verify
npm run preview
```

`verify` esegue Astro/TypeScript strict, ESLint, 5 controlli editoriali e build. `build` produce `dist`, genera Pagefind e verifica pagine, link interni, anchor, asset e metadata. E2E, clipboard, accessibilità axe e screenshot:

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

## Pubblicazione Cloudflare Pages

Collega **0xNicoB/Litness-Wiki**, produzione **main**. Framework **Astro**, root repository, build **npm run build**, output **dist**, variabile **NODE_VERSION=22.16.0**. Nessun adapter SSR o Pages Function.

Imposta **PUBLIC_SITE_URL** con l’origine HTTPS reale assegnata al progetto (o il dominio personalizzato verificato), ad esempio il valore effettivo mostrato da Cloudflare. Prima di questa configurazione il sito omette canonical, sitemap e URL assoluti social, evitando un dominio inventato. Dopo aver impostato l’origine, ricostruisci la produzione.

I push su main attivano le build automatiche; gli altri branch possono generare preview. Vedi [DEPLOYMENT](docs/DEPLOYMENT.md) per il collegamento GitHub, il dominio e le verifiche.

## Contenuti

- `src/content/docs/it`: articoli MDX con metadati validati.
- `src/data/sources.json`: registro delle fonti e provenienza.
- `src/data/market.json`: osservazioni storiche del 7 ottobre 2026, stato RIFERITO.
- `src/data/categories.json`: categorie e ordine della navigazione.
- `src/config/site.ts`: identità, link e disclaimer.
- `src/components/mdx`: callout, comandi, formule, tabelle, fonti, oggetti e gallerie.

Aggiungere un articolo non richiede modifiche ai router o alla sidebar. Gli URL iniziano con `/wiki/it/`, predisposti per nuove lingue ma non con traduzioni incomplete pubblicate.

Le fonti ufficiali del 5–8 ottobre sono consultate l’8 ottobre 2026. Prezzi, commissioni e altre osservazioni community restano **riferite**, perché gli screenshot originali non sono stati riesaminati. L’indice ricerca non legge prezzi o dati dal server. Le date di verifica non dipendono dalla build.

## Documentazione

[Design system](docs/DESIGN_SYSTEM.md) · [Architettura](docs/ARCHITECTURE.md) · [Guida contenuti](docs/CONTENT_GUIDE.md) · [Deployment](docs/DEPLOYMENT.md) · [Contribuire](CONTRIBUTING.md) · [Verifiche](docs/QA.md) · [Asset](docs/ASSETS.md)

Codice originale: MIT. Testi originali: CC BY 4.0, salvo diritti di terzi. Font OFL e icone ISC mantengono le loro licenze. Il paesaggio illustrato è originale, non uno screenshot o un asset ufficiale di Litness.
