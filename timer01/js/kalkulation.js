function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatForInput(value) {
  if (!Number.isFinite(value)) return '';
  return roundCurrency(value).toFixed(2);
}

function parseInputValue(value) {
  if (typeof value !== 'string') return NaN;
  const normalized = value.replace(',', '.').trim();
  if (!normalized) return NaN;
  return Number(normalized);
}

function setupKalkulation() {
  const nettoInput = document.getElementById('preisNetto');
  const bruttoInput = document.getElementById('preisBrutto');
  const mwstSelect = document.getElementById('mwstSatz');

  if (!nettoInput || !bruttoInput || !mwstSelect) return;

  let activeSource = null;

  function getTaxRate() {
    return Number(mwstSelect.value) / 100;
  }

  function updateFromNetto() {
    const netto = parseInputValue(nettoInput.value);
    if (!Number.isFinite(netto)) {
      bruttoInput.value = '';
      return;
    }

    const brutto = netto * (1 + getTaxRate());
    bruttoInput.value = formatForInput(brutto);
  }

  function updateFromBrutto() {
    const brutto = parseInputValue(bruttoInput.value);
    if (!Number.isFinite(brutto)) {
      nettoInput.value = '';
      return;
    }

    const netto = brutto / (1 + getTaxRate());
    nettoInput.value = formatForInput(netto);
  }

  nettoInput.addEventListener('focus', () => {
    activeSource = 'netto';
  });

  bruttoInput.addEventListener('focus', () => {
    activeSource = 'brutto';
  });

  nettoInput.addEventListener('input', () => {
    activeSource = 'netto';
    updateFromNetto();
  });

  bruttoInput.addEventListener('input', () => {
    activeSource = 'brutto';
    updateFromBrutto();
  });

  mwstSelect.addEventListener('change', () => {
    if (activeSource === 'brutto') {
      updateFromBrutto();
      return;
    }

    updateFromNetto();
  });
}

document.addEventListener('DOMContentLoaded', setupKalkulation);