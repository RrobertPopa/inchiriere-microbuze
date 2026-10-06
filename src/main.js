import './style.css';
import { porneste } from './relief.js';
import { pornesteComun, waText } from './comun.js';

pornesteComun();

/* ---------- lumea ---------- */
const canvas = document.getElementById('relief');
if (!porneste(canvas, document.getElementById('etichete'))) canvas.remove();

/* ---------- câți sunteți ---------- */
const slider = document.getElementById('persoane-slider');
const nr = document.getElementById('persoane-nr');
const rez = document.getElementById('persoane-rez');
function recomanda() {
  const n = Number(slider.value);
  nr.textContent = n;
  slider.style.setProperty('--p', ((n - 1) / (slider.max - 1)) * 100 + '%');
  if (n <= 8) rez.innerHTML = `Vă ajunge un <strong>Renault Trafic</strong> sau un <strong>Mercedes Vito</strong>. ${n === 8 ? 'Toate cele opt locuri, ocupate.' : `Mai rămân ${8 - n} ${8 - n === 1 ? 'loc liber' : 'locuri libere'}.`}`;
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
