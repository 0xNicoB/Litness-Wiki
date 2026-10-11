# Audit editoriale — 12 ottobre 2026

Baseline ispezionata: `83e1b17`, comprendente le correzioni SEO successive alla revisione del 9 ottobre. Astro statico, MDX, tre Content Collections, Pagefind, navigazione automatica e CI esistenti. Stato Git iniziale pulito. Nessun AGENTS.md trovato.

## Matrice delle modifiche

| Argomento | Stato effettivo prima della revisione | Fonte più recente | Azione |
|---|---|---|---|
| Claim | Distanza 7 chunk; nessun comando operativo; dotazioni riferite | Patch 10/11 ottobre, regole 10 ottobre | Distanza 5, multi-claim, banca, membri, geometria e selezione; mantenere incerti costi/gratuità |
| Dungeon | Cooldown 24/36/48 ore dal video 9 ottobre; rimborso solo coda | Patch 9/10/11 ottobre | 8 ore successo, 6 sconfitta; premi; party personalizzabile e countdown |
| Mondo Risorse | Perdita inventario senza eccezioni, boss non dettagliati | Chat 4/6/8 ottobre, patch 10/11 | Eccezioni hotbar/armatura riferite; partecipazione boss e riepilogo |
| Home/teleport | RTP e home 2–75, sintassi operativa assente | Video 9, chat e patch 11 | Distinguere /home claim da /claim home, TPA 30 s e warp |
| Economia | Aliquote presenti, /sell incerto, sintassi AH mancante | Chat 7/9 e patch 11 | PAY minimo 10/cooldown 10 s, AH sintassi riferita, addebito ancora incompleto |
| Enchant | 15 schede da video, patch limitata agli strumenti | Patch 5/9/10/11 | Stato corrente Confusion/farming, fix, rassegna tutte le categorie, incudine |
| Entità | Cap osservati e regole 8 ottobre | Patch 10 | Correzione professione villager, nessuna eccezione nametag/minecart |
| Regole | Sintesi datata 3 ottobre, distanza 7 | Regolamento aggiornato 10 ottobre | Allineare condizioni, trust, video, mod, account e no rimborso |
| Ricompense | Daily datate, AFK riferito, playtime osservato | Video 9, chat 6, patch 10 | Riscatto daily, Souls, fly time, conto AFK/IP distinto da multi-account |
| Changelog | Copertura fino all’8 ottobre | Archivio ufficiale fino all’11 | Voci separate, vecchie regole esplicitamente storiche |
| SEO | Sitemap index e diretta pubblicizzati; workflow diagnostico on demand | Baseline attuale | Preservare configurazione e verificare XML/URL; nessuna promessa Google |

## Metodo e copertura

Tre JSON letti e unificati: 1.000 + 1.000 + 292 = **2.292 messaggi univoci**, nessun duplicato. Lettura cronologica di tutti i contenuti, con reply, contesto e correzioni successive; non solo selezione per parole chiave. Intervallo locale Europe/Rome: 01/10 13:49–11/10 23:51. L’archivio rappresenta un canale, non l’intero Discord.

Il dataset contiene autori e riferimenti ma non ruoli/prefix staff verificabili. Anche autori che si presentano come helper non sono automaticamente promossi a fonte ufficiale. Gli ID dei messaggi e la mappa di revisione restano nel registro privato. Nessun dump, nickname, offerte personali o media Discord è pubblicato. Gli allegati della chat sono metadati/URL, non file multimediali inclusi nello ZIP: il loro contenuto non è dichiarato verificato.

Consultati integralmente archivio news, changelog 5/7/8/9/10/11, patch enchant 5 e regolamento 10 ottobre. Alcune aperture dirette hanno dato errore; ricerca ufficiale e collegamenti dell’archivio hanno consentito la lettura. L’archivio contiene anche una guida PlayStation del 1 ottobre, verificata e collegata dalla guida d’accesso.

Video disponibili: due registrazioni del 9 ottobre, identiche per contenuto ai file già revisionati. La data dell’osservazione resta il 9 ottobre: i video precedono il rework e non provano i cooldown attuali. Nessuna cattura con dati personali viene aggiunta agli asset.

## Scoperte autonome da integrare o qualificare

- /help e tutorial tramite icona informativa; /spawn come ritorno allo spawn Survival; /changelog come consultazione in-game.
- Libri custom dai villager riferiti da più risposte; Curse of Permanence esclusa dalla vendita secondo la patch ufficiale. Nessuna rarità garantita.
- Raccolta possibile anche in Overworld, dove la rigenerazione dei minerali non è riferita; risorse del Mondo Risorse portabili in Survival.
- Ricompense AFK descritte come casuali; nessuna distribuzione o probabilità nota.
- Una risposta attribuisce AH 12% all’acquirente come maggiorazione, ma non prova tutte le condizioni: resta riferita.
- /sethome e /home corroborati da risposte; /delhome compare senza sintassi completa.
- Servizi di farm, trasporto, costruzione, libri e materiali: categorie osservate, senza listini, utenti o promesse di guadagno.
- Segnalazioni Bedrock su menu/texture e difficoltà GUI: problemi datati, non bug globali correnti accertati.
- Costo incudine confuso con numero di lavorazioni: non interpretare usura 39 come 39 operazioni.
- Consigli di usare nametag/barche contro cap, gratuità cumulativa claim, reset mondo/chest, spawn rate e wipe: non pubblicati come fatti correnti.
