# Contribuire

Per una correzione apri un’Issue con pagina, affermazione, fonte e data. I template distinguono errore, nuova meccanica e miglioramento UI.

Per cambiare codice o testi usa un branch e una pull request. Non committare dist, node_modules, credenziali, evidenze private o screenshot senza consenso.

```bash
npm ci
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
```

Per modifiche editoriali leggi [CONTENT_GUIDE](docs/CONTENT_GUIDE.md). Mantieni date e stato, non presentare prezzi storici come correnti e non trasformare annunci in vendite. Le fonti ufficiali prevalgono se più recenti. Una prova ricevuta e una prova direttamente verificata sono stati diversi.

Per modifiche all’interfaccia controlla desktop/mobile, focus, ricerca e reduced motion. Screenshot di QA possono rimanere negli artifact della CI; non aggiungerli inutilmente al repository.

Le proposte vengono revisionate prima di integrarle. Supporto del server e controversie appartengono allo staff ufficiale, non alla wiki.

Contribuendo codice originale accetti la licenza MIT del progetto; i testi originali sono CC BY 4.0. Non importare materiale con diritti incompatibili.
