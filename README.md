# inchiriere-microbuze.ro

Site de prezentare pentru transport persoane cu șofer (autoturisme, dube, microbuze).
Vanilla HTML/CSS/JS, fără build, fără dependențe. Se poate deschide direct cu dublu-click
pe `index.html` (toate căile sunt relative).

## Structură

```
index.html
assets/
  css/style.css     stilul complet
  js/main.js        CONFIG contact + meniu + reveal + formular WhatsApp
  img/              fotografii (numerele de înmatriculare blurate)
```

## Datele de contact — un singur loc

Toate butoanele „Sună", linkurile WhatsApp și emailul se generează din blocul `CONFIG`
de la începutul lui `assets/js/main.js`:

```js
const CONFIG = {
  telefon:  "+40 7xx xxx xxx",   // afișat pe site
  whatsapp: "407xxxxxxxx",       // internațional, fără + și fără spații
  email:    "contact@inchiriere-microbuze.ro",
};
```

Mai trebuie actualizat manual numărul din JSON-LD (`"telephone"`), la finalul `index.html`.

## Formularul

Nu trimite email și nu are backend: compune un mesaj complet (nume, telefon, plecare,
destinație, dată, număr persoane, mașină, detalii) și deschide WhatsApp cu textul gata scris.
Nimic nu se stochează pe site.

## Fotografii

Stock Pexels (licență liberă, comercial). Numerele de înmatriculare vizibile au fost
acoperite prin blur. Când există poze reale cu mașinile, se înlocuiesc fișierele din
`assets/img/` păstrând aceleași nume.

## Publicare pe Hostinger prin Git

hPanel → Website → **GIT** → *Create a new repository*:

- Repository: `https://github.com/RrobertPopa/inchiriere-microbuze.git`
- Branch: `main`
- Directory: `public_html`

Apoi **Deploy**. La fiecare `git push` se apasă din nou *Deploy* (sau se activează
auto-deploy prin webhook-ul afișat de Hostinger, adăugat în GitHub la
Settings → Webhooks).
