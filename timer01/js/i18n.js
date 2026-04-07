// ─── i18n.js ──────────────────────────────────────────────────────────────────

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  document.documentElement.lang = lang;
  localStorage.setItem('appLang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('langSelect');
  const savedLang = localStorage.getItem('appLang') || 'de';
  if (langSelect) langSelect.value = savedLang;
  applyTranslations(savedLang);

  langSelect?.addEventListener('change', e => applyTranslations(e.target.value));
});
