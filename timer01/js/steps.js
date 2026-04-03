const steps = [];
let currentSavedTitle = null; // Aktuell geladener gespeicherter Titel (für Umbenennen/Löschen)

// ─── Hilfsfunktionen localStorage ────────────────────────────────────────────

function getStepsKey(title) {
  return `schritte_${title}`;
}

function getSavedTitles() {
  const raw = localStorage.getItem('arbeitstitel');
  return raw ? JSON.parse(raw) : [];
}

function loadStepsForTitle(title) {
  const raw = localStorage.getItem(getStepsKey(title));
  return raw ? JSON.parse(raw) : [];
}

function saveStepsForTitle(title) {
  localStorage.setItem(getStepsKey(title), JSON.stringify(steps));
}

// ─── Schritt-Input aktivieren / deaktivieren ──────────────────────────────────

function updateStepInputState() {
  const hasTitle = Boolean(document.getElementById('jobTitleInput').value.trim());
  document.getElementById('stepInput').disabled      = !hasTitle;
  document.getElementById('btnAddStep').disabled     = !hasTitle;
  document.getElementById('btnEditTitle').disabled   = !hasTitle;
  document.getElementById('btnDeleteTitle').disabled = !hasTitle;
  document.getElementById('btnSaveTitle').disabled   = !hasTitle;
}

// ─── Titel-Dropdown ───────────────────────────────────────────────────────────

function renderTitleOptions(titles, selectedValue = '') {
  const select = document.getElementById('jobTitleSelect');
  select.innerHTML = '<option value="">— Titel auswählen —</option>';
  titles.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
  select.value = selectedValue || '';
}

function selectJobTitle() {
  const select = document.getElementById('jobTitleSelect');
  const input  = document.getElementById('jobTitleInput');
  const title  = select.value;
  if (!title) return;

  input.value = title;
  currentSavedTitle = title;

  // Schritte des gewählten Titels laden
  steps.length = 0;
  steps.push(...loadStepsForTitle(title));
  renderSteps();
  updateStepInputState();
}

// ─── Titel bearbeiten ────────────────────────────────────────────────────────

function editTitle() {
  const input = document.getElementById('jobTitleInput');
  input.focus();
  input.select();
}

// ─── Titel speichern (nur Titel, ohne Schritte) ───────────────────────────────

function saveTitle() {
  const titleInput = document.getElementById('jobTitleInput');
  const title      = titleInput.value.trim();

  if (!title) {
    titleInput.classList.add('input--error');
    document.getElementById('jobTitleError').classList.remove('hidden');
    titleInput.focus();
    return;
  }

  titleInput.classList.remove('input--error');
  document.getElementById('jobTitleError').classList.add('hidden');

  if (currentSavedTitle && currentSavedTitle !== title) {
    // Umbenennen: Steps-Key migrieren
    const stepsData = localStorage.getItem(getStepsKey(currentSavedTitle));
    localStorage.removeItem(getStepsKey(currentSavedTitle));
    if (stepsData) localStorage.setItem(getStepsKey(title), stepsData);

    const titles = getSavedTitles().map(t => t === currentSavedTitle ? title : t);
    localStorage.setItem('arbeitstitel', JSON.stringify(titles));

    if (localStorage.getItem('aktiverTitel') === currentSavedTitle) {
      localStorage.setItem('aktiverTitel', title);
    }

    currentSavedTitle = title;
    renderTitleOptions(titles, title);
  } else if (!currentSavedTitle) {
    // Neuer Titel
    const titles = getSavedTitles();
    if (!titles.includes(title)) {
      titles.push(title);
      localStorage.setItem('arbeitstitel', JSON.stringify(titles));
    }
    localStorage.setItem('aktiverTitel', title);
    currentSavedTitle = title;
    renderTitleOptions(titles, title);
  }

  updateStepInputState();
}

// ─── Neuer Titel ─────────────────────────────────────────────────────────────

function newTitle() {
  document.getElementById('jobTitleInput').value = '';
  document.getElementById('jobTitleSelect').value = '';
  steps.length = 0;
  renderSteps();
  currentSavedTitle = null;
  updateStepInputState();
  document.getElementById('jobTitleInput').focus();
}

// ─── Titel löschen ────────────────────────────────────────────────────────────

function deleteTitle() {
  const title = document.getElementById('jobTitleInput').value.trim();
  if (!title) return;

  if (!confirm(`Arbeitstitel „${title}" und alle zugehörigen Schritte wirklich löschen?`)) return;

  // Aus localStorage entfernen falls gespeichert
  const titles = getSavedTitles();
  if (titles.includes(title)) {
    localStorage.removeItem(getStepsKey(title));
    const newTitles = titles.filter(t => t !== title);
    localStorage.setItem('arbeitstitel', JSON.stringify(newTitles));
    if (localStorage.getItem('aktiverTitel') === title) {
      localStorage.removeItem('aktiverTitel');
    }
    renderTitleOptions(newTitles);
  }

  // Formular leeren
  document.getElementById('jobTitleInput').value = '';
  steps.length = 0;
  renderSteps();
  currentSavedTitle = null;
  updateStepInputState();
}

// ─── Schritte hinzufügen ──────────────────────────────────────────────────────

function addStep() {
  const titleInput = document.getElementById('jobTitleInput');
  if (!titleInput.value.trim()) {
    titleInput.classList.add('input--error');
    document.getElementById('jobTitleError').classList.remove('hidden');
    titleInput.focus();
    return;
  }

  const input = document.getElementById('stepInput');
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }

  steps.push(value);
  renderSteps();
  input.value = '';
  input.focus();
}

// ─── Speichern ────────────────────────────────────────────────────────────────

function saveSteps() {
  const titleInput = document.getElementById('jobTitleInput');
  const titleError = document.getElementById('jobTitleError');
  const title      = titleInput.value.trim();

  if (!title) {
    titleInput.classList.add('input--error');
    titleError.classList.remove('hidden');
    titleInput.focus();
    return;
  }

  titleInput.classList.remove('input--error');
  titleError.classList.add('hidden');

  // Noch nicht hinzugefügten Schritt im Input automatisch übernehmen
  const stepInput = document.getElementById('stepInput');
  const pendingStep = stepInput.value.trim();
  if (pendingStep) {
    steps.push(pendingStep);
    stepInput.value = '';
    renderSteps();
  }

  if (steps.length === 0) {
    stepInput.focus();
    return;
  }

  // Umbenennen: alten Titel entfernen wenn der Name geändert wurde
  if (currentSavedTitle && currentSavedTitle !== title) {
    localStorage.removeItem(getStepsKey(currentSavedTitle));
    const oldTitles = getSavedTitles().filter(t => t !== currentSavedTitle);
    localStorage.setItem('arbeitstitel', JSON.stringify(oldTitles));
    if (localStorage.getItem('aktiverTitel') === currentSavedTitle) {
      localStorage.removeItem('aktiverTitel');
    }
  }

  // Schritte unter dem (ggf. neuen) Titel-Key speichern
  saveStepsForTitle(title);

  // Titel in die globale Liste aufnehmen (falls neu)
  const titles = getSavedTitles();
  if (!titles.includes(title)) {
    titles.push(title);
    localStorage.setItem('arbeitstitel', JSON.stringify(titles));
  }
  renderTitleOptions(titles, title);
  currentSavedTitle = title;

  // Letzten aktiven Titel merken (für Reload)
  localStorage.setItem('aktiverTitel', title);

  const confirm = document.getElementById('saveConfirm');
  confirm.textContent = `„${title}": ${steps.length} Schritt${steps.length > 1 ? 'e' : ''} gespeichert.`;
  confirm.classList.remove('hidden');
  setTimeout(() => confirm.classList.add('hidden'), 3000);
}

// ─── Schritte rendern ─────────────────────────────────────────────────────────

function makeIconBtn(iconName, className, ariaLabel, onClick) {
  const btn = document.createElement('button');
  btn.className = `step-btn ${className}`;
  btn.setAttribute('aria-label', ariaLabel);
  btn.innerHTML = `<i data-lucide="${iconName}"></i>`;
  btn.onclick = onClick;
  return btn;
}

function renderSteps() {
  const list = document.getElementById('stepList');
  list.innerHTML = '';
  steps.forEach((step, index) => {
    const li = document.createElement('li');

    const text = document.createElement('span');
    text.className = 'step-text';
    text.textContent = step;

    const btnEdit   = makeIconBtn('pencil',  'step-btn--edit',   `Schritt ${index + 1} bearbeiten`, () => editStep(index));
    const btnDelete = makeIconBtn('trash-2', 'step-btn--delete', `Schritt ${index + 1} löschen`,    () => deleteStep(index));

    li.appendChild(text);
    li.appendChild(btnEdit);
    li.appendChild(btnDelete);
    list.appendChild(li);
  });

  lucide.createIcons();
}

function editStep(index) {
  const list = document.getElementById('stepList');
  const li   = list.children[index];

  const input = document.createElement('input');
  input.type  = 'text';
  input.value = steps[index];
  input.className = 'step-edit-input';
  input.setAttribute('aria-label', `Schritt ${index + 1} bearbeiten`);

  const btnSave   = makeIconBtn('check', 'step-btn--save',   'Änderung speichern',    confirmEdit);
  const btnCancel = makeIconBtn('x',     'step-btn--cancel', 'Bearbeitung abbrechen', () => renderSteps());

  function confirmEdit() {
    const newValue = input.value.trim();
    if (newValue) steps[index] = newValue;
    renderSteps();
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  confirmEdit();
    if (e.key === 'Escape') renderSteps();
  });

  li.innerHTML = '';
  li.appendChild(input);
  li.appendChild(btnSave);
  li.appendChild(btnCancel);
  lucide.createIcons();
  input.focus();
  input.select();
}

function deleteStep(index) {
  steps.splice(index, 1);
  renderSteps();
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Initiale Zustand: Schritt-Eingabe deaktivieren solange kein Titel vorhanden
  updateStepInputState();

  document.getElementById('stepInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addStep();
  });

  // Fehlermeldung wegblenden und Input-State aktualisieren sobald der User tippt
  document.getElementById('jobTitleInput').addEventListener('input', () => {
    document.getElementById('jobTitleInput').classList.remove('input--error');
    document.getElementById('jobTitleError').classList.add('hidden');
    updateStepInputState();
  });


  // Alle gespeicherten Titel ins Dropdown laden
  const titles = getSavedTitles();
  renderTitleOptions(titles);

  // Letzten aktiven Titel + seine Schritte wiederherstellen
  const aktiverTitel = localStorage.getItem('aktiverTitel');
  if (aktiverTitel && titles.includes(aktiverTitel)) {
    document.getElementById('jobTitleInput').value = aktiverTitel;
    document.getElementById('jobTitleSelect').value = aktiverTitel;
    currentSavedTitle = aktiverTitel;
    steps.push(...loadStepsForTitle(aktiverTitel));
    renderSteps();
    updateStepInputState();
  }
});
