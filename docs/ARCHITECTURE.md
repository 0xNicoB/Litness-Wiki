# Architettura

Astro 5 static-first con MDX, TypeScript strict, Tailwind 4 via Vite e CSS custom centralizzato. Le versioni esatte installate sono in package.json e package-lock.json. Node 22.23.3 dichiarato. Non servono Workers, Functions, adapter SSR, database o servizi di ricerca esterni.

## Flusso dei dati

`content.config.ts` valida le collection `docs` e `sources` con Zod. Il loader glob legge MD/MDX e il loader file il registro JSON. Il router dinamico genera gli URL degli articoli; categorie, sidebar, correlati, ordine, breadcrumb e homepage derivano dalla collection.

Il namespace `it/` è parte dell’ID e dell’URL; lo schema accetta inizialmente solo `it`. Aggiungere una lingua richiede contenuti completi, estensione dello schema e gestione delle etichette di navigazione: nessuna pagina vuota viene generata ora.

`Base` fornisce metadata, header, tema, dialog ricerca e footer. `Article` gestisce struttura documentale, heading da render(), fonti e sequenza precedente/successivo. I correlati usano ID dichiarati, verificati nei test.

## Ricerca

Astro produce HTML → Pagefind indicizza solo `[data-pagefind-body]` degli articoli → i bundle indice vengono serviti da `/pagefind/`. La UI viene inizializzata solo aprendo la ricerca; non richiede backend. Titolo, descrizione, testo e categoria sono indicizzati. Pagefind gestisce highlight e sub-risultati; dialog nativo gestisce focus, Escape e ripristino del trigger. Ctrl/Cmd K apre il dialog.

## JavaScript

Solo interazioni: tema, copia clipboard, drawer e ricerca. Tutto il contenuto è disponibile in HTML. La clipboard richiede HTTPS o localhost; in caso di fallimento viene mostrato il testo da copiare manualmente.

## SEO

`PUBLIC_SITE_URL` abilita canonical, sitemap, URL social e JSON-LD Article. È validato come origine HTTPS. Senza origine il sito resta navigabile e non inventa il dominio. 404 con noindex. La preview Cloudflare può usare noindex via header del fornitore; verificare le impostazioni account.

## Sicurezza e privacy

Nessun segreto e nessun analytics. Preferenza tema in localStorage. `_headers` abilita nosniff, referrer policy e CSP per asset locali; inline script/style necessari per Astro e ricerca sono dichiarati esplicitamente. Il sito non effettua richieste applicative a servizi esterni. Link esterni aprono normali navigazioni.

## Limiti intenzionali

Nessun feed automatico delle patch, quotazione corrente, import automatico di evidenze private o garanzia del comportamento in-game. Asset community futuri passano dalla revisione documentata in CONTENT_GUIDE.
