const EMAIL_TO = "info@guzmanfix.com";

const i18n = {
  en: {
    tagline: "Maintenance • Repairs • Reliability",
    nav_services: "Services",
    nav_why: "Why us",
    nav_gallery: "Work",
    nav_contact: "Contact",
    cta_callback: "Request a callback",
    pill: "Fast response • Clean work • Clear communication",
    hero_title: "Reliable maintenance & repairs—done right.",
    hero_sub: "Apartment turns, punch lists, preventative maintenance, and home repairs. Professional results—without the hassle.",
    hero_cta_primary: "Request a callback",
    hero_cta_secondary: "View services",
    trust_1: "Typical response",
    trust_2: "Quality mindset",
    trust_3: "Professional service",
    card_title: "Get a quick estimate",
    card_sub: "Tell me what you need and I’ll reply with next steps.",
    form_name: "Name",
    form_phone: "Phone",
    form_service: "Service",
    form_details: "Details",
    form_besttime: "Best time to call",
    form_send: "Send",
    fineprint: "By submitting, you agree to be contacted by phone/text/email.",
    services_title: "Services",
    services_sub: "From small fixes to full punch lists—handled professionally.",
    s1_title: "Apartment maintenance",
    s1_desc: "Work orders, make-ready turns, punch lists, and preventative maintenance.",
    s2_title: "Plumbing",
    s2_desc: "Faucets, leaks, toilets, disposals, shut-offs, and basic repairs.",
    s3_title: "Electrical",
    s3_desc: "Switches, outlets, fixtures, fans, and troubleshooting (non-panel work).",
    s4_title: "Drywall & paint",
    s4_desc: "Patches, texture matching, caulking, touch-ups, and clean finishes.",
    s5_title: "Doors, locks & hardware",
    s5_desc: "Handles, locks, hinges, alignment, and replacements.",
    s6_title: "Fixtures & installs",
    s6_desc: "TV mounts, blinds, shelves, bathroom accessories, and more.",
    why_title: "Why choose us",
    why_sub: "Clear process, quality work, and respect for your property.",
    w1_title: "Clear communication",
    w1_desc: "You’ll know the plan, the cost, and the timeline—no surprises.",
    w2_title: "Clean finish",
    w2_desc: "We protect surfaces, clean as we go, and leave the site looking right.",
    w3_title: "Reliable scheduling",
    w3_desc: "On-time arrivals and realistic ETAs for every job.",
    w4_title: "Professional standards",
    w4_desc: "Tools, safety, and workmanship that property managers can trust.",
    gallery_title: "Recent work",
    gallery_sub: "Add your real photos later—these are placeholders.",
    callback_title: "Request a callback",
    callback_sub: "Leave your details and we’ll reach out.",
    footer_desc: "Maintenance & repair services.",
    footer_contact: "Contact",
    footer_area: "Serving: Clearwater & Tampa Bay",
    footer_hours: "Hours",
    footer_hours_val: "Mon–Sat • 8am–6pm",
    back_top: "Back to top",
    svc_general: "General maintenance",
    svc_plumbing: "Plumbing",
    svc_electrical: "Electrical",
    svc_drywall: "Drywall & paint",
    svc_turn: "Apartment turns",
  },
  es: {
    tagline: "Mantenimiento • Reparaciones • Confianza",
    nav_services: "Servicios",
    nav_why: "Por qué nosotros",
    nav_gallery: "Trabajos",
    nav_contact: "Contacto",
    cta_callback: "Solicitar llamada",
    pill: "Respuesta rápida • Trabajo limpio • Comunicación clara",
    hero_title: "Mantenimiento y reparaciones confiables—bien hecho.",
    hero_sub: "Turns de apartamentos, punch lists, mantenimiento preventivo y reparaciones del hogar. Resultados profesionales—sin complicaciones.",
    hero_cta_primary: "Solicitar llamada",
    hero_cta_secondary: "Ver servicios",
    trust_1: "Tiempo de respuesta",
    trust_2: "Enfoque en calidad",
    trust_3: "Servicio profesional",
    card_title: "Cotización rápida",
    card_sub: "Cuéntame qué necesitas y te respondo con los próximos pasos.",
    form_name: "Nombre",
    form_phone: "Teléfono",
    form_service: "Servicio",
    form_details: "Detalles",
    form_besttime: "Mejor hora para llamar",
    form_send: "Enviar",
    fineprint: "Al enviar, aceptas ser contactado por llamada/texto/correo.",
    services_title: "Servicios",
    services_sub: "Desde arreglos pequeños hasta punch lists completos—profesional.",
    s1_title: "Mantenimiento de apartamentos",
    s1_desc: "Work orders, turns, punch lists y mantenimiento preventivo.",
    s2_title: "Plomería",
    s2_desc: "Grifos, fugas, inodoros, disposals, válvulas y reparaciones básicas.",
    s3_title: "Eléctrico",
    s3_desc: "Switches, outlets, lámparas, ventiladores y diagnóstico (sin panel).",
    s4_title: "Drywall y pintura",
    s4_desc: "Parches, textura, sellado, retoques y acabados limpios.",
    s5_title: "Puertas, cerraduras y herrajes",
    s5_desc: "Manijas, cerraduras, bisagras, ajuste y reemplazos.",
    s6_title: "Instalaciones",
    s6_desc: "TV mounts, persianas, repisas, accesorios de baño y más.",
    why_title: "Por qué elegirnos",
    why_sub: "Proceso claro, trabajo de calidad y respeto por tu propiedad.",
    w1_title: "Comunicación clara",
    w1_desc: "Sabrás el plan, el costo y el tiempo—sin sorpresas.",
    w2_title: "Acabado limpio",
    w2_desc: "Protegemos superficies, limpiamos mientras trabajamos y dejamos todo bien.",
    w3_title: "Horario confiable",
    w3_desc: "Llegadas a tiempo y ETA realista para cada trabajo.",
    w4_title: "Estándares profesionales",
    w4_desc: "Herramientas, seguridad y calidad que un property manager confía.",
    gallery_title: "Trabajos recientes",
    gallery_sub: "Luego agregas tus fotos reales—estos son placeholders.",
    callback_title: "Solicitar llamada",
    callback_sub: "Deja tus datos y te contactamos.",
    footer_desc: "Servicios de mantenimiento y reparación.",
    footer_contact: "Contacto",
    footer_area: "Área: Clearwater y Tampa Bay",
    footer_hours: "Horario",
    footer_hours_val: "Lun–Sáb • 8am–6pm",
    back_top: "Volver arriba",
    svc_general: "Mantenimiento general",
    svc_plumbing: "Plomería",
    svc_electrical: "Eléctrico",
    svc_drywall: "Drywall y pintura",
    svc_turn: "Turns de apartamentos",
  }
};

// Mobile menu
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
hamburger?.addEventListener("click", () => {
  mobileNav.classList.toggle("show");
  mobileNav.setAttribute("aria-hidden", mobileNav.classList.contains("show") ? "false" : "true");
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Language toggle
const root = document.documentElement;
const langToggle = document.getElementById("langToggle");
const langLabel = document.getElementById("langLabel");

function applyLang(lang){
  root.setAttribute("data-lang", lang);
  langLabel.textContent = lang.toUpperCase();
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
}

let currentLang = "en";
langToggle?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  applyLang(currentLang);
});

// Forms -> mailto
function mailtoFromForm(form){
  const fd = new FormData(form);
  const name = (fd.get("name") || "").toString();
  const phone = (fd.get("phone") || "").toString();
  const service = (fd.get("service") || "").toString();
  const besttime = (fd.get("besttime") || "").toString();
  const details = (fd.get("details") || "").toString();

  const subject = encodeURIComponent(`Website request — ${name || "New lead"}`);
  const bodyLines = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    service ? `Service: ${service}` : null,
    besttime ? `Best time to call: ${besttime}` : null,
    "",
    "Details:",
    details || "(No details provided)"
  ].filter(Boolean);

  const body = encodeURIComponent(bodyLines.join("\n"));
  window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
}

document.getElementById("quickForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  mailtoFromForm(e.target);
});

document.getElementById("callbackForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  mailtoFromForm(e.target);
});

// Default language based on browser (optional)
const browserLang = (navigator.language || "en").toLowerCase();
if (browserLang.startsWith("es")) {
  currentLang = "es";
}
applyLang(currentLang);
