# inchiriere-microbuze.ro — Roby Tours

Site de prezentare: închiriere microbuze cu șofer (Mercedes Sprinter, Renault Trafic).
Vite + three.js (harta de relief din fundal). Brief-ul: `BRIEF.md`.

## Lucru local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # rezultatul în dist/
```

## Unde se schimbă lucrurile

| Ce | Unde |
|---|---|
| telefon, WhatsApp, e-mail | `CONFIG` la începutul lui `src/main.js` (+ `telephone` din JSON-LD în `index.html`) |
| texte | `index.html` |
| stil | `src/style.css` |
| harta 3D și traseul | `src/relief.js` |
| poze | `public/foto/` — se înlocuiesc păstrând numele |

Formularul nu are backend: compune mesajul și deschide WhatsApp. Nimic nu se stochează.

## Publicare (Hostinger prin Git)

1. Push pe `main` → GitHub Actions (`.github/workflows/hostinger.yml`) rulează `npm run build`
   și pune conținutul lui `dist/` pe branch-ul **`hostinger`**.
2. În hPanel → Website → **GIT**, repository-ul e legat de branch-ul **`hostinger`**
   (nu `main`), directory `public_html`. Apoi **Deploy** (sau auto-deploy prin webhook).

`public/.htaccess` ține fișierele din `assets/` (cu hash în nume) în cache un an, iar
`index.html` se revalidează mereu, ca vizitatorii să vadă imediat versiunea nouă.

Site-ul vechi (vanilla) e păstrat în `_vechi/`.
