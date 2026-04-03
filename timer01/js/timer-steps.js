// ─── timer-steps.js ───────────────────────────────────────────────────────────
// Verbindet die Stoppuhr mit den definierten Arbeitsschritten.
// Voraussetzung: stopwatch.js (mit getElapsed()), steps.js sind geladen.

let sessionActive    = false;
let currentStepIndex = 0;
let stepStartTime    = 0;       // getElapsed()-Wert beim Start des aktuellen Schritts
let stepDurations    = [];      // ms pro Schritt

// ─── Hilfsfunktion: ms → "MM:SS.hh" ──────────────────────────────────────────

function formatDuration(ms) {
  const cs      = Math.floor((ms % 1000) / 10);
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000) % 60;
  const hours   = Math.floor(ms / 3600000);

  if (hours > 0) {
    return pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds) + '.' + pad2(cs);
  }
  return pad2(minutes) + ':' + pad2(seconds) + '.' + pad2(cs);
}

function pad2(n) {
  return n.toString().padStart(2, '0');
}

// ─── Session starten ──────────────────────────────────────────────────────────

function startSession() {
  // Schritte müssen vorhanden sein
  if (typeof steps === 'undefined' || steps.length === 0) {
    alert('Bitte zuerst Arbeitsschritte definieren und speichern.');
    return;
  }

  // Stoppuhr starten (falls noch nicht läuft)
  start();

  sessionActive    = true;
  currentStepIndex = 0;
  stepStartTime    = getElapsed();
  stepDurations    = [];

  renderSessionState();
  updateSessionButtons();
}

// ─── Nächster Schritt ─────────────────────────────────────────────────────────

function nextStep() {
  if (!sessionActive) return;

  const duration = getElapsed() - stepStartTime;
  stepDurations[currentStepIndex] = duration;

  // Zeit neben dem Schritt anzeigen
  showStepTime(currentStepIndex, duration);

  currentStepIndex++;
  stepStartTime = getElapsed();

  if (currentStepIndex >= steps.length) {
    endSession();
    return;
  }

  renderSessionState();
  updateSessionButtons();
}

// ─── Session beenden ──────────────────────────────────────────────────────────

function endSession() {
  pause(); // Stoppuhr anhalten

  sessionActive = false;

  const total = stepDurations.reduce((sum, d) => sum + d, 0);
  showTotal(total);
  updateSessionButtons();
}

// ─── Session abbrechen ───────────────────────────────────────────────────────

function cancelSession() {
  if (!sessionActive) return;
  sessionActive = false;
  stop(); // Stoppuhr zurücksetzen
  clearSessionUI();
  updateSessionButtons();
}

// ─── UI: aktiven Schritt hervorheben, abgeschlossene markieren ────────────────

function renderSessionState() {
  const listItems = document.querySelectorAll('#stepList li');

  listItems.forEach((li, i) => {
    li.classList.remove('step--active', 'step--done', 'step--pending');

    if (i < currentStepIndex) {
      li.classList.add('step--done');
    } else if (i === currentStepIndex) {
      li.classList.add('step--active');
      // Scroll in Sicht
      li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      li.classList.add('step--pending');
    }
  });
}

// ─── UI: Zeit neben einem Schritt einblenden ──────────────────────────────────

function showStepTime(index, ms) {
  const listItems = document.querySelectorAll('#stepList li');
  if (!listItems[index]) return;

  // Vorhandenes Zeit-Badge entfernen falls vorhanden
  const existing = listItems[index].querySelector('.step-time');
  if (existing) existing.remove();

  const badge = document.createElement('span');
  badge.className = 'step-time';
  badge.textContent = formatDuration(ms);
  listItems[index].appendChild(badge);
}

// ─── UI: Total anzeigen ───────────────────────────────────────────────────────

function showTotal(ms) {
  let totalEl = document.getElementById('sessionTotal');
  if (!totalEl) {
    totalEl = document.createElement('div');
    totalEl.id = 'sessionTotal';
    totalEl.className = 'session-total';
    document.getElementById('stepList').after(totalEl);
  }
  totalEl.innerHTML =
    '<span class="session-total__label">Total</span>' +
    '<span class="session-total__time">' + formatDuration(ms) + '</span>';
  totalEl.classList.remove('hidden');
}

// ─── UI: Session-UI zurücksetzen ──────────────────────────────────────────────

function clearSessionUI() {
  document.querySelectorAll('#stepList li').forEach(li => {
    li.classList.remove('step--active', 'step--done', 'step--pending');
    const badge = li.querySelector('.step-time');
    if (badge) badge.remove();
  });

  const totalEl = document.getElementById('sessionTotal');
  if (totalEl) totalEl.classList.add('hidden');
}

// ─── Buttons ein-/ausblenden ──────────────────────────────────────────────────

function updateSessionButtons() {
  const btnStart  = document.getElementById('btnSessionStart');
  const btnNext   = document.getElementById('btnSessionNext');
  const btnCancel = document.getElementById('btnSessionCancel');

  if (!btnStart || !btnNext || !btnCancel) return;

  if (sessionActive) {
    btnStart.classList.add('hidden');
    btnNext.classList.remove('hidden');
    btnCancel.classList.remove('hidden');

    // Letzter Schritt: Button-Text anpassen
    if (currentStepIndex === steps.length - 1) {
      btnNext.textContent = 'Fertig';
    } else {
      btnNext.textContent = 'Nächster Schritt';
    }
  } else {
    btnStart.classList.remove('hidden');
    btnNext.classList.add('hidden');
    btnCancel.classList.add('hidden');
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  updateSessionButtons();

  // Wenn Stoppuhr-Stop gedrückt wird, Session ebenfalls abbrechen
  const originalStop = window.stop;
  window.stop = function () {
    originalStop();
    if (sessionActive) {
      sessionActive = false;
      clearSessionUI();
      updateSessionButtons();
    }
  };
});
