import './style.css';
import { porneste } from './relief.js';
import credite from './credite.json';

/* -------------------------------------------------------------
   CONFIG — singurul loc unde se schimbă datele de contact.
   ------------------------------------------------------------- */
const CONFIG = {
  telefon: '0724 436 295',            // afișat pe site
  whatsapp: '40724436295',            // internațional, fără + și spații
  email: 'contact@inchiriere-microbuze.ro',
};

const telHref = 'tel:+4' + CONFIG.telefon.replace(/\D/g, '');
const waBase = 'https://wa.me/' + CONFIG.whatsapp;
const waText = (t) => waBase + '?text=' + encodeURIComponent(t);

document.querySelectorAll('.js-tel').forEach((a) => { a.href = telHref; });
document.querySelectorAll('.js-tel-label').forEach((el) => { el.textContent = CONFIG.telefon; });
document.querySelectorAll('.js-mail').forEach((a) => { a.href = 'mailto:' + CONFIG.email; a.textContent = CONFIG.email; });
document.querySelectorAll('.js-wa').forEach((a) => {
  a.href = waText('Bună ziua! Aș vrea o ofertă pentru un microbuz cu șofer.');
  a.target = '_blank'; a.rel = 'noopener';
});
document.getElementById('an').textContent = new Date().getFullYear();

/* credite foto: fiecare autor cu link la pagina lui de pe Commons */
{
  const autori = new Map();
  for (const c of credite) if (!autori.has(c.autor)) autori.set(c.autor, c.pagina);
  const el = document.getElementById('credite-lista');
  el.textContent = '';
  [...autori].forEach(([autor, pagina], i) => {
    if (i) el.append(', ');
    const a = document.createElement('a');
    a.href = pagina; a.textContent = autor; a.target = '_blank'; a.rel = 'noopener';
    el.append(a);
  });
}

/* ---------- lumea ---------- */
const canvas = document.getElementById('relief');
if (!porneste(canvas, document.getElementById('etichete'))) canvas.remove();

/* ---------- antet ---------- */
const antet = document.getElementById('antet');
const umple = () => antet.classList.toggle('plin', window.scrollY > 24);
umple();
window.addEventListener('scroll', umple, { passive: true });

/* ---------- meniu mobil ---------- */
const burger = document.getElementById('burger');
const meniu = document.getElementById('meniu');
function comuta(deschide) {
  burger.setAttribute('aria-expanded', String(deschide));
  burger.setAttribute('aria-label', deschide ? 'Închide meniul' : 'Deschide meniul');
  document.body.classList.toggle('meniu-deschis', deschide);
  antet.classList.toggle('plin', deschide || window.scrollY > 24);
  if (deschide) {
    meniu.hidden = false;
    requestAnimationFrame(() => meniu.classList.add('deschis'));
  } else {
    meniu.classList.remove('deschis');
    setTimeout(() => { if (!meniu.classList.contains('deschis')) meniu.hidden = true; }, 260);
  }
}
burger.addEventListener('click', () => comuta(burger.getAttribute('aria-expanded') !== 'true'));
meniu.addEventListener('click', (e) => { if (e.target.closest('a')) comuta(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !meniu.hidden) { comuta(false); burger.focus(); } });
matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) comuta(false); });

/* ---------- câți sunteți ---------- */
const slider = document.getElementById('persoane-slider');
const nr = document.getElementById('persoane-nr');
const rez = document.getElementById('persoane-rez');
function recomanda() {
  const n = Number(slider.value);
  nr.textContent = n;
  slider.style.setProperty('--p', ((n - 1) / (slider.max - 1)) * 100 + '%');
  if (n <= 8) rez.innerHTML = `Vă ajunge un <strong>Renault Trafic</strong>. ${n === 8 ? 'Toate cele opt locuri, ocupate.' : `Mai rămân ${8 - n} ${8 - n === 1 ? 'loc liber' : 'locuri libere'}.`}`;
  else if (n <= 20) rez.innerHTML = 'Vă trebuie un <strong>Mercedes Sprinter</strong>. Încap toți, cu bagaje.';
  else rez.innerHTML = 'Sunteți mai mulți de 20. <strong>Sunați-ne</strong> și vedem ce mașini sunt libere pentru data voastră.';
}
slider.addEventListener('input', recomanda);
recomanda();

/* ---------- butoanele care precompletează formularul ---------- */
const form = document.getElementById('formular');
document.querySelectorAll('.js-alege').forEach((a) => {
  a.addEventListener('click', () => {
    if (a.dataset.masina) form.masina.value = a.dataset.masina;
    if (a.dataset.scop && !form.detalii.value) form.detalii.value = a.dataset.scop + '. ';
    if (a.closest('.flota') && !form.persoane.value) form.persoane.value = slider.value;
  });
});

/* ---------- formularul → WhatsApp ---------- */
const eroare = document.getElementById('formular-eroare');
form.data.min = new Date().toISOString().slice(0, 10);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const lipsa = [...form.querySelectorAll('[required]')].filter((c) => !c.value.trim());
  form.querySelectorAll('.camp').forEach((c) => c.classList.remove('gresit'));
  lipsa.forEach((c) => c.closest('.camp').classList.add('gresit'));
  if (lipsa.length) {
    eroare.hidden = false;
    eroare.textContent = 'Mai completați: ' + lipsa.map((c) => form.querySelector(`label[for="${c.id}"]`).firstChild.textContent.trim().toLowerCase()).join(', ') + '.';
    lipsa[0].focus();
    return;
  }
  eroare.hidden = true;
  const d = form.data.value ? new Date(form.data.value + 'T12:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const text = [
    'Bună ziua! Aș vrea o ofertă pentru un microbuz cu șofer.',
    '',
    `Nume: ${form.nume.value.trim()}`,
    `Telefon: ${form.telefon.value.trim()}`,
    `Plecare din: ${form.plecare.value.trim()}`,
    `Destinație: ${form.destinatie.value.trim()}`,
    `Data: ${d}`,
    `Persoane: ${form.persoane.value}`,
    `Mașina: ${form.masina.value}`,
    form.detalii.value.trim() ? `Detalii: ${form.detalii.value.trim()}` : '',
  ].filter((r, i) => r || i === 1).join('\n');
  window.open(waText(text), '_blank', 'noopener');
});
