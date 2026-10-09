# Litness Wiki

Wiki italiana indipendente del server Minecraft Litness. Non affiliata o gestita da Litness Ltd.

Sito pubblico: **https://litness-wiki.pages.dev/**. Cloudflare Pages è collegato a `main` tramite l’integrazione GitHub.

Aggiornamento 9 ottobre: **32 articoli**, 8 categorie, HTML statico Astro, ricerca locale Pagefind, font self-hosted e layout responsive. Nessun database, login o servizio indispensabile esterno.

## Sviluppo

Richiede Node 22.23.3 (vedi `.nvmrc`) e npm. Il runtime locale 24 è compatibile; Cloudflare usa la versione dichiarata.

```bash
npm ci
npm run dev
```

Il dev server usa la porta 4321. La ricerca richiede l’indice della build: per provarla usa la preview di produzione.

```bash
npm run verify
npm run preview
```

`verify` esegue Astro/TypeScript strict, ESLint, controlli editoriali, validazione del catalogo e test di regressione del validatore e build. `build` produce `dist`, genera Pagefind e verifica pagine, link interni, anchor, asset e metadata. I file Google nella root sono confrontati byte per byte con gli originali in `public/` e separati dalle pagine della wiki. E2E, clipboard, accessibilità axe e screenshot:

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

Per eseguire la stessa suite contro un deployment raggiungibile dal tuo ambiente:

```bash
PLAYWRIGHT_BASE_URL=https://litness-wiki.pages.dev npm run test:e2e
```

Con questa variabile non viene avviato il server di preview locale.

## Pubblicazione Cloudflare Pages

Collega **0xNicoB/Litness-Wiki**, produzione **main**. Framework **Astro**, root repository, build **npm run build**, output **dist**, variabile **NODE_VERSION=22.23.3**. Nessun adapter SSR o Pages Function.

Il progetto esistente usa **PUBLIC_SITE_URL=https://litness-wiki.pages.dev** in produzione e preview. Se attivi un dominio personalizzato verificato, aggiorna questa origine e ricostruisci. Senza la variabile il sito omette canonical, sitemap e URL assoluti social.

I push su main attivano le build automatiche; gli altri branch possono generare preview. Vedi [DEPLOYMENT](docs/DEPLOYMENT.md) per il collegamento GitHub, il dominio e le verifiche.

## Contenuti

- `src/content/docs/it`: articoli MDX con metadati validati.
- `src/data/sources.json`: registro delle fonti e provenienza.
- `src/data/market.json`: osservazioni storiche del 7 ottobre 2026, stato RIFERITO.
- `src/data/enchants.json`: tooltip verificati, valori opzionali e riferimenti temporali; Content Collection validata.
- `src/data/observations-2026-10-09.json`: registro di revisione, destinazioni e incertezze.
- `src/data/categories.json`: categorie e ordine della navigazione.
- `src/config/site.ts`: identità, link e disclaimer.
- `src/components/mdx`: callout, comandi, formule, tabelle, fonti, oggetti e gallerie.

Aggiungere un articolo non richiede modifiche ai router o alla sidebar. Gli URL iniziano con `/wiki/it/`, predisposti per nuove lingue ma non con traduzioni incomplete pubblicate.

Le fonti hanno date di consultazione esplicite. I due video del 9 ottobre sono stati esaminati direttamente: le parti leggibili ricevono lo stato **osservato**. Tooltip assenti o tagliati restano **riferiti**, così come lo storico del 7 ottobre. Il catalogo mostra 15 schede verificate, senza dichiarare un totale certo degli enchant. L’indice ricerca non legge prezzi o dati dal server. Le date di verifica non dipendono dalla build.

## Documentazione

[Design system](docs/DESIGN_SYSTEM.md) · [Architettura](docs/ARCHITECTURE.md) · [Guida contenuti](docs/CONTENT_GUIDE.md) · [Deployment](docs/DEPLOYMENT.md) · [Contribuire](CONTRIBUTING.md) · [Verifiche](docs/QA.md) · [Revisione 9 ottobre](docs/UPDATE_2026-10-09.md) · [Asset](docs/ASSETS.md)

Codice originale: MIT. Testi originali: CC BY 4.0, salvo diritti di terzi. Font OFL e icone ISC mantengono le loro licenze. Il paesaggio illustrato è originale, non uno screenshot o un asset ufficiale di Litness.
