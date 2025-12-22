function setLang(lang) {
  document.querySelectorAll("[data-en]").forEach(el => {
    el.innerText = el.dataset[lang];
  });
}

setLang("en");
