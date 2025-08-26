# Poker peer-to-peer Solana senza chiave privata sul backend

## Flusso
- Pagamenti buy-in, fee, abbonamento effettuati dagli utenti tramite wallet (Phantom, Backpack).
- Il backend riceve la firma della transazione e verifica su Solana.
- Fee e buy-in vanno al wallet: `DZoHMBRyTzShZC9dwQ2HgFwhSjUE2xWLEDypKoa2Mcp3`
- Nessuna chiave privata sul backend/server!

## Deploy frontend su Netlify
- Metti tutto in `frontend/`
- Connetti Netlify alla repo e pubblica la directory `dist`
- Configura il backend URL in produzione

## Deploy backend
- Avvia con `npm install && npm start` in `backend/`
- (opzionale) Deploy su Render, Vercel, Fly.io, Railway ecc.

## Sicurezza
- Nessuna chiave privata su server!
- Tutte le tx sono direttamente firmate dagli utenti.

---
