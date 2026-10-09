# Guida editoriale

## Aggiungere un articolo

Crea `src/content/docs/it/<categoria>/<slug>.mdx`, mantenendo lo slug leggibile e stabile. Campi obbligatori: title, description (20–220 caratteri), lang: it, category, order, status, published, updated, lastVerified (data o null), sources. Campi facoltativi: tags, related, featured, version.

```yaml
title: "Titolo della guida"
description: "Una descrizione concreta, utile per ricerca e SEO."
lang: "it"
category: "economia"
order: 80
status: "riferito"
published: "2026-10-08"
updated: "2026-10-08"
lastVerified: null
sources: ["COMM-07"]
related: ["it/economia/auction-house"]
tags: ["mercato"]
```

Non aggiornare lastVerified senza aver effettuato una verifica; non usare la data della build. Il campo status sintetizza la pagina, le singole affermazioni devono distinguere le fonti. Le categorie sono definite in `src/data/categories.json`.

## Fonti

Registra un ID univoco, titolo, tipo e URL quando disponibile in `sources.json`. Aggiungi accessed solo dopo la consultazione; observed per il periodo dell’osservazione; published per la patch. Un resoconto senza screenshot direttamente riesaminati è RIFERITO, non OSSERVATO. Fonti ufficiali più recenti prevalgono; conservare i conflitti con date e contesto.

Non attribuire allo staff dati community. Non pubblicare comandi, probabilità, livelli, conversioni, prezzi o soglie senza una prova. Una patch descrive modifiche, non necessariamente tutte le proprietà dell’oggetto.

## Componenti MDX

Gli import sono relativi al file. Per la struttura di primo livello attuale usa `../../../../components/mdx/`.

| Componente        | Proprietà                   | Uso                              |
| ----------------- | --------------------------- | -------------------------------- |
| Callout           | type, title                 | info, warning, verify, official  |
| Command           | syntax, description, source | comando copiabile                |
| DataTable         | caption                     | tabella con overflow locale      |
| MarketTable       | kind                        | shop, auction, charcoal dal JSON |
| FeeSummary        | nessuna                     | commissioni con provenienza      |
| Formula           | expression, label           | derivazione e assunzioni         |
| ItemCard          | name, category, status      | scheda oggetto/enchant           |
| SourceRef         | id                          | riferimento al registro          |
| ScreenshotGallery | images                      | src/alt/caption/width/height     |
| GuideLink         | href, title, description    | guida collegata                  |
| VersionBadge      | version, verified           | riferimento patch esplicito      |

Per tabelle JSX mantieni i tag annidati nello stesso blocco senza paragrafi Markdown fra tbody e tr. Per tabelle Markdown semplici usa un wrapper DataTable. Gli heading di secondo/terzo livello generano automaticamente il TOC; non inserire un secondo h1.

## Dati di mercato

`market.json` conserva date, valuta, provenienza, prezzi richiesti e vendite riferite separatamente. Non promuovere annunci a vendite. Non sovrascrivere le snapshot vecchie con dati nuovi; per espandere usare record datati o nuovi file e aggiornare il componente. Ogni tabella deve dichiarare quantità, unità e condizioni. I calcoli vanno separati dalle assunzioni.

## Import delle fonti interne

1. Ricevere una copia autorizzata di Litness_Wiki.md, dashboard o JSON.
2. Inventariare ogni record con ID originale, data e origine in una cartella di revisione esterna ai contenuti pubblici.
3. Separare dati pubblicabili e privati; oscurare chat, saldo, nickname e coordinate sensibili.
4. Riesaminare screenshot e confrontare le patch successive.
5. Integrare solo i record approvati in MDX/JSON, preservando il riferimento originale e lo stato corretto.
6. Eseguire verify ed E2E, poi richiedere revisione della PR.

Non viene eseguito alcun import automatico della dashboard privata. Nessuno screenshot community è incluso nella prima release.

## Catalogo enchant e revisioni video

Le schede provengono da `src/data/enchants.json`, validato dalla Content Collection `enchants`. Aggiungi una voce con ID stabile, descrizione originale, fonte, data osservazione e timestamp approssimativo. Campi non conosciuti si omettono o si impostano a `null`; un array conflitti vuoto significa soltanto che il tooltip mostra esplicitamente nessun conflitto. Le rarità e compatibilità derivano dai tooltip, non dal nome.

`procChance` è una percentuale tra 0 e 100; `averageYieldBonusPct` è un bonus medio separato e può superare 100. Non convertirli l’uno nell’altro. I valori descrivono il livello indicato, senza estrapolare scaling. Il catalogo filtra HTML statico con JavaScript minimo; tutte le schede restano leggibili e indicizzabili senza script. I collegamenti alle schede usano l’ID come anchor.

`src/data/observations-2026-10-09.json` conserva affermazioni, destinazione, provenienza, date e limiti della revisione. Una verifica parziale del video non promuove l’intero resoconto a osservazione diretta. I dettagli tagliati o assenti restano riferiti con una fonte separata; nella pagina il paragrafo o la scheda distingue i diversi stati. Il totale 81/102 richiede un censimento manuale deduplicato e un chiarimento sull’ambito del conteggio.

Non caricare le registrazioni originali nella repository pubblica: possono contenere nickname, chat e inventari privati. Conserva riferimenti testuali alle evidenze e sottoponi eventuali screenshot a revisione e consenso.
