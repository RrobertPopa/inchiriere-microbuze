/* -------------------------------------------------------------
   Comun pentru toate paginile: contactul, antetul, meniul mobil.
   CONFIG — singurul loc unde se schimbă datele de contact.
   ------------------------------------------------------------- */
export const CONFIG = {
  telefon: '0724 436 295',            // afișat pe site
  whatsapp: '40724436295',            // internațional, fără + și spații
  email: 'contact@inchiriere-microbuze.ro',
};

const telHref = 'tel:+4' + CONFIG.telefon.replace(/\D/g, '');
const waBase = 'https://wa.me/' + CONFIG.whatsapp;
export const waText = (t) => waBase + '?text=' + encodeURIComponent(t);

export function pornesteComun() {
  // pe paginile de serviciu, WhatsApp-ul pleacă deja cu serviciul scris (data-scop pe <body>)
  const scop = document.body.dataset.scop;
  const mesaj = 'Bună ziua! Aș vrea o ofertă pentru un microbuz cu șofer' + (scop ? ` (${scop})` : '') + '.';

  document.querySelectorAll('.js-tel').forEach((a) => { a.href = telHref; });
  document.querySelectorAll('.js-tel-label').forEach((el) => { el.textContent = CONFIG.telefon; });
  document.querySelectorAll('.js-mail').forEach((a) => { a.href = 'mailto:' + CONFIG.email; a.textContent = CONFIG.email; });
  document.querySelectorAll('.js-wa').forEach((a) => {
    a.href = waText(mesaj);
    a.target = '_blank'; a.rel = 'noopener';
  });
  const an = document.getElementById('an');
  if (an) an.textContent = new Date().getFullYear();

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
}
