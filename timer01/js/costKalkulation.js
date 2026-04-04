// ─── costKalkulation.js ───────────────────────────────────────────────────────
// Berechnet den Umsatz pro gewähltem Zeitraum basierend auf:
//   - der importierten Messzeit (aus der Session)
//   - dem Preis Brutto
//   - dem gewählten Produktionszeitraum (15 / 30 / 45 min oder Manuell)

// ─── Hilfsfunktion: Zeiteingabe → Minuten ────────────────────────────────────
// Akzeptiert:  "30"        → 30 Sekunden
//              "1-30"      → 1 Min 30 Sek  (auch "1:30")
//              "1-30-00"   → 1 Std 30 Min  (auch "1:30:00")
// Auch aus Session: "MM:SS.cs" / "HH:MM:SS.cs"

function parseDurationToMinutes(str) {
  if (!str || !str.trim()) return NaN;

  // Trennzeichen normalisieren: - und : beide erlaubt
  const parts = str.trim().replace(/-/g, ':').split(':');

  if (parts.length === 1) {
    // Nur eine Zahl → Sekunden
    const sec = parseFloat(parts[0]);
    return Number.isFinite(sec) && sec >= 0 ? sec / 60 : NaN;
  }

  if (parts.length === 2) {
    // MM:SS(.cs)
    const min = parseInt(parts[0], 10);
    const sec = parseFloat(parts[1]);
    if (!Number.isFinite(min) || !Number.isFinite(sec)) return NaN;
    return min + sec / 60;
  }

  if (parts.length === 3) {
    // HH:MM:SS(.cs)
    const hr  = parseInt(parts[0], 10);
    const min = parseInt(parts[1], 10);
    const sec = parseFloat(parts[2]);
    if (!Number.isFinite(hr) || !Number.isFinite(min) || !Number.isFinite(sec)) return NaN;
    return hr * 60 + min + sec / 60;
  }

  return NaN;
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

  const zeitManuell = document.getElementById('zeitManuell');
  const zeitStr = (importZeit.value.trim() || (zeitManuell && zeitManuell.value.trim()));
  const measuredMinutes = parseDurationToMinutes(zeitStr);
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

  const zeitManuell = document.getElementById('zeitManuell');
  if (zeitManuell) {
    zeitManuell.addEventListener('input', () => {
      const val = zeitManuell.value.trim();
      if (val === '') {
        zeitManuell.classList.remove('input--error');
      } else {
        const minutes = parseDurationToMinutes(val);
        zeitManuell.classList.toggle('input--error', !Number.isFinite(minutes) || minutes <= 0);
      }
      recalcUmsatz();
    });
  }
}

document.addEventListener('DOMContentLoaded', setupCostKalkulation);
