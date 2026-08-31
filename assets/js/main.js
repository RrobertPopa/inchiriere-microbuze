/* =============================================================
   inchiriere-microbuze.ro — logica site-ului (vanilla, zero deps)
   ============================================================= */

/* -------------------------------------------------------------
   CONFIG — SINGURUL loc unde se modifică datele de contact.
   Schimbi aici și se actualizează în tot site-ul (butoane, footer,
   bara de jos de pe mobil și mesajul de WhatsApp).
   ------------------------------------------------------------- */
const CONFIG = {
  telefon:  "+40 700 000 000",                    // TODO: numărul real, afișat pe site
  whatsapp: "40700000000",                        // TODO: același număr, internațional, fără + și fără spații
  email:    "contact@inchiriere-microbuze.ro",    // TODO: adresa reală (sau șterge linia din footer)
};

/* ---------- aplică datele de contact peste tot ---------- */
const telHref = "tel:" + CONFIG.telefon.replace(/[^\d+]/g, "");
const waBase  = "https://wa.me/" + CONFIG.whatsapp;

document.querySelectorAll(".js-tel").forEach(a => { a.href = telHref; });
document.querySelectorAll(".js-tel-label").forEach(el => { el.textContent = CONFIG.telefon; });
document.querySelectorAll(".js-mail").forEach(a => {
  a.href = "mailto:" + CONFIG.email;
  a.textContent = CONFIG.email;
});
document.querySelectorAll(".js-wa").forEach(a => {
  a.href = waBase + "?text=" + encodeURIComponent("Bună ziua! Aș avea nevoie de o mașină cu șofer. ");
});
document.getElementById("an").textContent = new Date().getFullYear();

/* ---------- meniu mobil ---------- */
const burger = document.getElementById("burger");
const setMenu = (open) => {
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Închide meniul" : "Deschide meniul");
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
document.querySelectorAll("#mmenu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* ---------- header la scroll ---------- */
const hdr = document.getElementById("hdr");
const onScroll = () => hdr.classList.toggle("stuck", scrollY > 12);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

/* ---------- reveal la scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add("in"), i * 70);
    io.unobserve(e.target);
  });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

/* ---------- „Cere preț" de pe cardul de flotă preselectează mașina ---------- */
document.querySelectorAll(".js-quote").forEach(a => a.addEventListener("click", () => {
  const sel = document.getElementById("masina");
  const dorit = a.dataset.vehicle;
  [...sel.options].forEach(o => { if (o.text === dorit) sel.value = o.value; });
}));

/* ---------- formular → mesaj WhatsApp deja scris ---------- */
document.getElementById("quote").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const f = ev.target;

  // validare minimă, fără biblioteci
  const obligatorii = ["nume", "telefon", "plecare", "destinatie"];
  for (const id of obligatorii) {
    const el = f.elements[id];
    if (!el.value.trim()) {
      el.classList.add("err");
      el.focus();
      return;
    }
    el.classList.remove("err");
  }

  const candVal = f.elements.cand.value;
  const cand = candVal
    ? new Date(candVal).toLocaleString("ro-RO", { dateStyle: "short", timeStyle: "short" })
    : "de stabilit";

  const linii = [
    "Bună ziua! Aș dori o ofertă pentru o cursă cu șofer.",
    "",
    "Nume: "        + f.elements.nume.value.trim(),
    "Telefon: "     + f.elements.telefon.value.trim(),
    "Plecare: "     + f.elements.plecare.value.trim(),
    "Destinație: "  + f.elements.destinatie.value.trim(),
    "Data și ora: " + cand,
    "Persoane: "    + f.elements.pasageri.value,
    "Mașina: "      + f.elements.masina.value,
  ];
  const detalii = f.elements.detalii.value.trim();
  if (detalii) linii.push("Detalii: " + detalii);

  window.open(waBase + "?text=" + encodeURIComponent(linii.join("\n")), "_blank", "noopener");
});
