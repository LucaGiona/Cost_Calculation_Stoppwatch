// ─── costKalkulation.js ───────────────────────────────────────────────────────
// Berechnet den Umsatz pro gewähltem Zeitraum basierend auf:
//   - der importierten Messzeit (aus der Session)
//   - dem Preis Brutto
//   - dem gewählten Produktionszeitraum (15 / 30 / 45 min oder Manuell)

// ─── Hilfsfunktion: "MM:SS.cs" oder "HH:MM:SS.cs" → Minuten ─────────────────

function parseDurationToMinutes(str) {
  if (!str || !str.trim()) return NaN;
  const parts = str.trim().split(':');
  let totalSeconds = 0;

  if (parts.length === 3) {
    // HH:MM:SS.cs
    totalSeconds =
      parseInt(parts[0], 10) * 3600 +
      parseInt(parts[1], 10) * 60 +
      parseFloat(parts[2]);
  } else if (parts.length === 2) {
    // MM:SS.cs
    totalSeconds =
      parseInt(parts[0], 10) * 60 +
      parseFloat(parts[1]);
  } else {
    return NaN;
  }

  return totalSeconds / 60;
}

// ─── Umsatz neu berechnen ─────────────────────────────────────────────────────

function recalcUmsatz() {
  const bruttoInput   = document.getElementById('preisBrutto');
  const importZeit    = document.getElementById('importiertZeit');
  const produktionSel = document.getElementById('produktionZeit');
  const produktionMan = document.getElementById('produktionManual');
  const umsatzField   = document.getElementById('umsatzStunde');

  if (!bruttoInput || !importZeit || !produktionSel || !umsatzField) return;

  const brutto = parseInputValue(bruttoInput.value);
  if (!Number.isFinite(brutto) || brutto <= 0) {
    umsatzField.value = '';
    return;
  }

  const measuredMinutes = parseDurationToMinutes(importZeit.value);
  if (!Number.isFinite(measuredMinutes) || measuredMinutes <= 0) {
    umsatzField.value = '';
    return;
  }

  const selectedMinutes = produktionSel.value === 'manual'
    ? parseInputValue(produktionMan.value)
    : Number(produktionSel.value);

  if (!Number.isFinite(selectedMinutes) || selectedMinutes <= 0) {
    umsatzField.value = '';
    return;
  }

  const faktor = selectedMinutes / measuredMinutes;
  umsatzField.value = formatForInput(faktor * brutto);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function setupCostKalkulation() {
  const produktionSel = document.getElementById('produktionZeit');
  const produktionMan = document.getElementById('produktionManual');
  const bruttoInput   = document.getElementById('preisBrutto');

  if (!produktionSel || !produktionMan || !bruttoInput) return;

  function toggleManualInput() {
    const isManual = produktionSel.value === 'manual';
    produktionMan.classList.toggle('hidden', !isManual);
    const unitSpan = produktionMan.nextElementSibling;
    if (unitSpan) unitSpan.classList.toggle('hidden', !isManual);
    if (isManual) produktionMan.focus();
  }

  toggleManualInput(); // Initialzustand setzen

  produktionSel.addEventListener('change', () => {
    toggleManualInput();
    recalcUmsatz();
  });

  produktionMan.addEventListener('input', recalcUmsatz);
  bruttoInput.addEventListener('input',   recalcUmsatz);
}

document.addEventListener('DOMContentLoaded', setupCostKalkulation);
