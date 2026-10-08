# Design system

## Ricerca del riferimento

Riferimento: https://litness.gg/, consultato l’8 ottobre 2026. Homepage ispezionata nel browser desktop a 1363 px, inclusi menu e tema scuro. Ispezionata anche la pagina interna enchant. Colori e font misurati tramite computed style del DOM, non stimati da un’immagine. La fonte ufficiale usa paesaggi voxel dorati, un logo fiamma/fulmine, superfici crema e CTA pill con ombra inferiore.

| Token osservato | Valore      | Utilizzo nella wiki         |
| --------------- | ----------- | --------------------------- |
| Crema           | #FBF1E2     | sfondo                      |
| Marrone         | #3B2A1E     | testo e blocco introduttivo |
| Arancione       | #FC6C00     | CTA e accenti               |
| Scuro           | #1C140E     | sfondo dark                 |
| Titoli          | Paytone One | heading e brand originale   |
| Testo           | Nunito      | corpo e navigazione         |
| CTA             | pill        | copia IP e pulsanti         |

Le varianti `--surface`, `--border`, `--muted` e `--brand-text` sono adattamenti della wiki, documentati in `src/styles/global.css`. L’arancione puro non viene usato per piccolo testo su crema: l’accento testuale più scuro garantisce leggibilità. Le CTA hanno testo marrone per migliorare il contrasto.

## UI originale

Hero con paesaggio voxel originale e gradiente leggibile; otto categorie con icone Lucide uniformi; percorso iniziale evidenziato su superficie marrone. Nessun logo ufficiale copiato, asset proprietario o contatore simulato. La fiamma della wiki è un simbolo distinto e il sottotitolo identifica subito la natura indipendente.

Titoli home 64–88 px, sezioni 31–39 px, articoli 34–43 px, testo 15–18 px. Card 18 px di raggio, pill 999 px, comandi/tabelle 12 px. Spaziature principalmente 8/12/16/20/24/32 px, larghezza portale 1224 px. Ombre leggere e movimento hover di 2–4 px.

## Responsive e accessibilità

Breakpoint 1300, 1080, 800 e 520 px. Articoli a tre colonne su desktop; TOC collassabile sotto 1080 px; drawer di navigazione sotto 800 px. Griglia categorie 4→2 colonne, articoli 3→2→1. Tabelle in contenitori scorrevoli accessibili da tastiera.

Focus 3 px, skip link, dialog nativi con focus trap ed Escape, target principali 39–47 px, animazioni disattivate con reduced motion. Tema sistema iniziale e scelta locale persistente. Nessuna dipendenza da Google Fonts.

La ricerca visiva del sito ufficiale su viewport mobile è registrata separatamente in QA quando effettivamente eseguita: non è dedotta da quella desktop. Le verifiche responsive della wiki usano Chromium e screenshot reali.
