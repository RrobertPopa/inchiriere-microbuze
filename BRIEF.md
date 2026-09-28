# BRIEF — Roby Tours (inchiriere-microbuze.ro), refacere 2026-09-29

**Autoritate estetică:** lumea „Hartă de relief" (hârtie de hartă topografică + curbe de nivel randate în WebGL), aleasă din nișă; referința lui Robert (alextouring.ro) dă doar conținutul, nu forma.
**Nișă:** 7. Transport și închirieri (`02-nise.md`)
**Tipar pornire:** structura nișei (vehicul real sus → flota cu locuri și dotări → cerere de ofertă → zone → contact). Schimbat: lumea implicită „fotografie vie / industrial" devine hartă de relief, fiindcă ce vinde Roby e drumul întreg (circuite prin țară), iar pozele disponibile sunt de expoziție, nu de drum.

Autorat sub delegare explicită („go for it", Robert, 2026-09-29). Fără pasul de trei direcții, la cererea lui.

## Ce vinde
Tot grupul pleacă împreună, cu un microbuz Mercedes Sprinter sau Renault Trafic și cu șofer inclus, fără ca cineva din grup să conducă.

## Ce face vizitatorul
Cere ofertă: pe WhatsApp (formular care compune mesajul) sau sună. Eticheta peste tot: „Cere ofertă".

## Lume · strigăt · accent
Lume: hartă de relief pe hârtie caldă (#efe9dd), cerneală grafit (#1d2126), curbe de nivel în shader · Strigăt: 7/10 · Accent: roșu-cărămidă #b8431f (traseul) · Interzis: auriu pe negru (consumat de vechiul Roby Tours), albastru-logistic.

## Referință
https://www.alextouring.ro/ — de acolo se preia: flota prezentată ca microbuze mari, „șofer inclus" ca argument, CTA „Cere ofertă de preț" + telefon + WhatsApp vizibile peste tot. Nu se preia forma (template generic).

## Assets
Doar fotografii Mercedes Sprinter și Renault Trafic (cerință Robert). Toate de pe Wikimedia Commons, CC BY-SA 4.0 (Matti Blume, Anthony Levrot, Crazy1880, Lukas 3z), credite în subsol, lista în `credite.json`. **Sunt ilustrative, nu mașinile lui Roby.** Când există poze cu flota reală, se înlocuiesc fișierele din `public/foto/`.
Contact real: 0724 436 295 (telefon + WhatsApp), contact@inchiriere-microbuze.ro.

## Ce NU are voie pe pagină
- recenzii, note, „X clienți mulțumiți", ani de experiență — nu avem date
- prețuri concrete (nu le avem) — doar „preț fix, spus înainte de plecare"
- paintball / karting (le face agenția, nu Roby)
- autoturism 4+1 și minivan 7+1 (scoase: Robert vrea doar Sprinter și Trafic)
- dotări neconfirmate (Wi-Fi, TV, frigider). Rămân doar cele de pe site-ul vechi: aer condiționat, loc de bagaje, prize
- ⚠️ de confirmat cu tatăl: câte Sprintere / Trafice, configurațiile exacte (16+1? 19+1? 20+1?)

## Amprentă (verificat contra nișei, înainte de cod)
Lume: hartă de relief (curbe de nivel WebGL pe hârtie) · Act tipografic: Archivo lățit (wdth 125, wght 800) la clamp(44px, 11vw, 176px), „Tot grupul, într-un drum." · Lucrul care se mișcă: traseul roșu care se desenează peste relief pe măsură ce derulezi, cu un punct (microbuzul) în vârful lui.
Diferă de: Roby Tours vechi (bandă închisă, auriu pe negru, grotesk greu, insigna 20+1) pe toate trei. Singurul alt site de transport din FINGERPRINTS.
