# Diario ABC

🇬🇧 [Read in English](README.md)

---

Un diario delle emozioni privato, interamente nel browser, costruito attorno al modello ABC della Terapia Cognitivo-Comportamentale. Identifica le tue emozioni, compila il modulo strutturato ed esporta un PDF pulito da condividere con il tuo terapeuta.

🔗 Live: **abc-diary.vercel.app**

## Panoramica

L'app segue la struttura TCC a tre sezioni:

* **A — Situazione** — cosa è successo, quando, dove e con chi
* **B — Pensieri** — cosa ti è passato per la mente
* **C — Conseguenze** — come ti sei sentito, cosa hai fatto e cosa avresti voluto fare diversamente

Una **Ruota delle Emozioni** interattiva ti guida da un'emozione generica a una più precisa su tre livelli, aiutandoti a dare un nome a sensazioni altrimenti difficili da esprimere.

## Funzionalità

* Ruota delle Emozioni interattiva con gerarchia a tre anelli
* Visualizzazione a bolle
* Modalità chiara e scura
* Italiano e inglese
* Esportazione PDF con un clic
* Totalmente privato — nessun backend, nessun tracciamento, i dati non lasciano mai il dispositivo

## Privacy

Tutti i dati sono conservati esclusivamente in memoria e cancellati alla chiusura della pagina. L'unico dato persistente è la preferenza della lingua, salvata in `localStorage`. Nulla viene trasmesso all'esterno.

## Esecuzione in locale

```bash
git clone https://github.com/WhtNoiz/diario-abc.git
cd abc-diary
npm install
npm run dev
```

## Licenza

© 2026 WhtNoiz — **CC BY 4.0**
