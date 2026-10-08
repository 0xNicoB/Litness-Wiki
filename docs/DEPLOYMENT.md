# Cloudflare Pages

Progetto attivo dall’8 ottobre 2026: **https://litness-wiki.pages.dev/**. Repository collegata: `0xNicoB/Litness-Wiki`; produzione: `main`. La build e il primo deployment Git sono riusciti. `NODE_VERSION=22.16.0` e `PUBLIC_SITE_URL=https://litness-wiki.pages.dev` sono configurati sia in produzione sia in preview.

## Sviluppo e build riproducibili

Node 22.16.0, npm, lockfile committato.

```bash
npm ci
npm run dev
npm run verify
npm run preview
```

La build usa Astro + Pagefind + verifica output. La preview serve la build completa, inclusa ricerca; in dev, senza indice, il messaggio spiega come abilitarla.

## Collegare GitHub

Nel dashboard Cloudflare: Workers & Pages → Create application → Pages → Connect to Git. Autorizza l’app Cloudflare solo per la repository desiderata e seleziona `0xNicoB/Litness-Wiki`.

| Impostazione  | Valore                                         |
| ------------- | ---------------------------------------------- |
| Nome progetto | litness-wiki                                   |
| Produzione    | main                                           |
| Framework     | Astro                                          |
| Root          | root repository, vuoto oppure /                |
| Build         | npm run build                                  |
| Output        | dist                                           |
| Node          | NODE_VERSION=22.16.0                           |
| Origine SEO   | PUBLIC_SITE_URL=https://litness-wiki.pages.dev |

Nessuna Function, Worker o adapter SSR. Il nome Pages assegnato dal provider è la fonte dell’hostname, non una previsione della wiki.

## Origine reale e SEO

Quando il progetto mostra il suo indirizzo effettivo, imposta `PUBLIC_SITE_URL` con quell’origine HTTPS senza path. Per esempio copia il dominio Pages visualizzato, includi https e nessun percorso. Imposta il valore nelle variabili di produzione e ricostruisci. In preview usa la stessa origine di produzione per canonical; non creare un canonical verso la singola preview temporanea.

Senza questa variabile sitemap/canonical/og:image sono omessi intenzionalmente. Con la variabile vengono generati sitemap-index.xml, sitemap-0.xml, robots con riferimento alla sitemap, canonical, social card e dati strutturati Article. Gli articoli non usano la data di build come data di verifica.

## Dominio personalizzato

Apri Pages project → Custom domains → Set up a custom domain. Inserisci il dominio che possiedi, segui le istruzioni DNS del provider e attendi verifica/certificato. Per un apex potrebbe servire gestire la zona su Cloudflare. Non creare record DNS senza sapere quale dominio va usato.

Dopo l’attivazione, cambia PUBLIC_SITE_URL all’origine personalizzata e ricostruisci. Verifica HTTPS, canonical e sitemap. Il dominio deve essere già attivo: non inserire hostname immaginari.

## Build automatiche e preview

I commit su main attivano produzione. Gli altri branch generano preview se abilitati nell’integrazione Git. Verifica policy di inclusione/esclusione dei branch e controlla il log della build. Non aggiungere un secondo workflow Wrangler di pubblicazione: l’integrazione Git è il proprietario del deployment.

Per correggere una release, apri una PR e lascia eseguire CI. Un push successivo aggiorna la produzione. Per rollback usa una deployment precedente dal dashboard senza riscrivere la cronologia Git.

## Controlli dopo la pubblicazione

- Homepage e un articolo raggiungibili via HTTPS.
- Ricerca con “villager” o “dungeon” e apertura di un risultato.
- Copia IP e comando, drawer mobile, tema.
- Pagina sconosciuta mostra 404 (il provider usa dist/404.html).
- /robots.txt e /sitemap-index.xml coerenti con l’origine.
- Asset, font e Pagefind caricati localmente, nessun servizio indispensabile mancante.

Le verifiche effettive, incluse quelle sulla produzione, sono riportate in [QA.md](QA.md).

## Fonti tecniche

- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://docs.astro.build/en/guides/content-collections/
- https://pagefind.app/docs/
