# Verifica della prima release

Verifiche eseguite l’8 ottobre 2026 sulla build statica locale, nella CI GitHub e sulla produzione Cloudflare. Il sito è pubblicato su **https://litness-wiki.pages.dev/**. I risultati locali e quelli di produzione sono distinti nelle sezioni seguenti.

## Risultati tecnici

| Verifica                    | Risultato effettivo                                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Installazione riproducibile | `npm ci` completato con lockfile                                                                                                        |
| Astro / TypeScript strict   | 0 errori, 0 warning, 0 hint                                                                                                             |
| ESLint                      | Passato                                                                                                                                 |
| Test editoriali Node        | 5 passati                                                                                                                               |
| Build statica               | 38 pagine HTML, 27 articoli in 8 categorie                                                                                              |
| Pagefind                    | 27 articoli italiani indicizzati; ricerca provata nel browser                                                                           |
| Risorse e anchor interni    | 3.367 riferimenti controllati, nessun riferimento mancante                                                                              |
| SEO senza dominio           | Canonical, sitemap e URL social assoluti omessi; nessun dominio di produzione inventato                                                 |
| SEO con origine configurata | Build con `https://example.com` come fixture: 37 URL in sitemap, 404 esclusa, canonical esatti, social card e schema Article verificati |

La fixture è stata rimossa ricostruendo il sito senza `PUBLIC_SITE_URL`. La build consegnata non pubblica URL verso example.com. I controlli SEO sono parte di `scripts/verify-build.mjs` e della build ordinaria.

Ambiente locale: Node 24.19.0, npm 11.9.0; runtime dichiarato per Cloudflare: Node 22.16.0. Il download standard del browser Playwright non è riuscito nell’ambiente disponibile. Per i test locali è stato usato Chromium 153.0.8010.0, distribuito dal pacchetto npm `@sparticuz/chromium`, con `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Il browser e il pacchetto temporaneo non fanno parte della repository. La CI installa Chromium tramite Playwright.

## Funzioni e accessibilità

Playwright: **21 test passati, 1 escluso intenzionalmente** (drawer mobile nel progetto desktop).

- Homepage, categorie e apertura degli articoli.
- Ricerca Pagefind: risultati reali, evidenziazione, apertura dei risultati, Ctrl+K ed Escape.
- Copia IP e `/dungeon leave`, con rilettura della clipboard.
- Drawer: apertura, chiusura, restituzione del focus, categorie e apertura di Auction House.
- Anchor dell’indice e fonti degli articoli.
- Tema scuro, persistenza e rispetto di reduced motion.
- Assenza di overflow orizzontale alle dimensioni desktop, Pixel 7 e 320 px.
- Axe WCAG 2 A/AA e 2.1 AA su homepage, articolo lungo, tabella storica, 404, ricerca, drawer e tema scuro: nessuna violazione rilevata nelle pagine testate.

Non è una certificazione completa di accessibilità. Non sono state inviate issue reali: link precompilati e template sono predisposti, senza generare segnalazioni di prova nella repository pubblica.

## Controllo visivo

Screenshot reali della build: homepage desktop e mobile, articolo lungo, tabella economica, ricerca aperta, drawer mobile, 404 e tema scuro. Sono stati aperti e controllati; i PNG sono nel pacchetto di consegna sotto `verification/`.

Corretti durante il controllo: caption delle tabelle, allineamento delle categorie nel drawer, etichette italiane della ricerca, spazi nel testo indicizzato, nome accessibile del marchio e header su schermi da 320 px.

Il sito ufficiale è stato ispezionato visivamente su desktop, in tema chiaro/scuro e nella pagina interna enchant. I token sono stati ricavati dagli stili del DOM. L’ispezione visiva del sito ufficiale su viewport mobile non è stata eseguita: il browser di ricerca disponibile non esponeva quel controllo. La wiki è stata invece verificata realmente su viewport mobile.

## Lighthouse

Lighthouse 13.5.0, modalità mobile standard, preview locale, dopo la build finale dell’interfaccia. Report JSON inclusi nella consegna.

| Pagina            | Performance | Accessibility | Best Practices | SEO |
| ----------------- | ----------: | ------------: | -------------: | --: |
| Homepage          |          96 |           100 |            100 | 100 |
| Storico economico |          91 |           100 |            100 | 100 |

Nessun audit binario fallito nei due report. Sono misure locali, non misure della produzione Cloudflare; i risultati variano con hardware, rete e provider.

## Limiti editoriali

Le pagine ufficiali indicate nel registro fonti sono state lette. I resoconti community conservano lo stato RIFERITO e non ricevono una data di verifica: screenshot originali, tariffe dungeon correnti, addebito esatto AH/plot, tassa trade, dettagli rank e condizioni dei plot richiedono nuove evidenze. Prezzi e annunci del 7 ottobre sono storici; gli annunci non dimostrano vendite concluse.

Il catalogo enchant copre le modifiche documentate agli strumenti. Il catalogo completo di armi e armature è una futura estensione, con collegamento alla patch ufficiale. Non sono inclusi screenshot community non autorizzati. L’importazione futura richiede revisione manuale e conservazione della provenienza.

Il verificatore automatico controlla link interni, asset e anchor. Non è stato eseguito un crawler di disponibilità di tutti i link esterni; le fonti ufficiali principali sono state consultate direttamente.

## Stato GitHub e Cloudflare

Aggiornamento dell’8 ottobre 2026 dopo la riconfigurazione delle connessioni.

L’accesso GitHub è ripristinato: la scrittura tramite integrazione è riuscita. Il progetto completo è pubblicato su `main` con il commit `57b478c5234f7260084f5f82a8fb2721bb2fead6`, preceduto dall’inizializzazione `22ae6d5c2d969a33a71e670de1728306f2998d90`. Non è stato usato force push. La cronologia locale precedente è conservata nei branch `implementation-local` e `prepared-release` e nel bundle già consegnato.

L’errore Cloudflare **8000011** non si è ripresentato dopo la riconfigurazione. Il progetto Git `litness-wiki` è stato creato e collegato a questa repository, produzione `main`, preview abilitate per tutti i branch. Node 22.16.0 e l’origine SEO reale sono configurati per entrambi gli ambienti. Nessuna modifica a credenziali o DNS.

La build Cloudflare del commit `5d23d1b228995d2ec9693330bec9768f416c4309` ha completato clone, build e pubblicazione. Deployment `953b1d01-75d1-4a84-8dfb-bcd4a2873320`, stato `success`, completato l’8 ottobre 2026 alle 10:23:51 UTC. La prima build è stata avviata manualmente tramite API sul progetto Git: non è stato usato Direct Upload.

GitHub Actions è passato per entrambi i commit `57b478c` e `5d23d1b`: installazione, verifiche tecniche, build e suite E2E. Run: [37746193392](https://github.com/0xNicoB/Litness-Wiki/actions/runs/37746193392) e [37746413186](https://github.com/0xNicoB/Litness-Wiki/actions/runs/37746413186).

## Verifiche sulla produzione

- Otto endpoint HTTP controllati: homepage, dungeon, storico economico, robots, sitemap index, sitemap, indice Pagefind e percorso inesistente. Sette risposte 200 e una 404 personalizzata, come previsto.
- Canonical e schema Article puntano all’origine reale. Sitemap con 37 URL; Pagefind con 27 articoli italiani. Robots include il riferimento alla sitemap. Header CSP presenti.
- Nel browser cloud: ricerca «villager» con due risultati reali, apertura dell’articolo, navigazione al dungeon, copia IP e `/dungeon leave` riletti dalla clipboard, Ctrl+K, Escape e cambio tema verificati.
- Articolo dungeon controllato visivamente in tema chiaro e scuro; nessun overflow orizzontale nella viewport desktop. Le verifiche mobile documentate sopra riguardano la build locale e la CI.

La suite Playwright completa contro l’hostname pubblico non ha potuto navigare da Chromium locale: 21 casi terminati con `net::ERR_EMPTY_RESPONSE` prima di caricare la pagina, un caso escluso intenzionalmente. Non è un risultato E2E superato sulla produzione. Le richieste HTTP e il browser cloud hanno invece raggiunto il sito; i test funzionali remoti sopra sono stati effettuati in quel browser. `PLAYWRIGHT_BASE_URL` consente di ripetere l’intera suite da un ambiente con accesso all’hostname pubblico.
