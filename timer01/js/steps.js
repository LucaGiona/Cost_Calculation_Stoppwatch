// ─── Hilfsfunktionen localStorage ────────────────────────────────────────────

function loadStepsForTitle(title) {
  return getDataStore().schritte[title] || [];
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
  const select    = document.getElementById('jobTitleSelect');
  const kalSelect = document.getElementById('kalTitelSelect');

  select.innerHTML = '<option value="">— Titel auswählen —</option>';
  if (kalSelect) kalSelect.innerHTML = '<option value="">— Titel auswählen —</option>';

  titles.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);

    if (kalSelect) {
      const kalOpt = document.createElement('option');
      kalOpt.value = t;
      kalOpt.textContent = t;
      kalSelect.appendChild(kalOpt);
    }
  });

  select.value = selectedValue || '';
}

function selectKalTitel() {
  const select = document.getElementById('kalTitelSelect');
  const input  = document.getElementById('importiertTitel');
  if (!select || !select.value) return;
  input.value = select.value;

  [
    'importiertZeit',
    'preisNetto', 'preisBrutto', 'umsatzStunde',
    'zeitStd', 'zeitMin', 'zeitSek',
    'prodStd', 'prodMin', 'prodSek'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function selectJobTitle() {
  const select = document.getElementById('jobTitleSelect');
  const input  = document.getElementById('jobTitleInput');
  const title  = select.value;
  if (!title) return;

  resetForTitleChange();

  input.value = title;
  appState.steps.currentSavedTitle = title;

  // Schritte des gewählten Titels laden
  appState.steps.list.length = 0;
  appState.steps.list.push(...loadStepsForTitle(title));
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

  const store = getDataStore();

  if (appState.steps.currentSavedTitle && appState.steps.currentSavedTitle !== title) {
    // Umbenennen: Steps-Key migrieren
    store.schritte[title] = store.schritte[appState.steps.currentSavedTitle] || [];
    delete store.schritte[appState.steps.currentSavedTitle];
    store.arbeitstitel = store.arbeitstitel.map(t => t === appState.steps.currentSavedTitle ? title : t);
    if (store.aktiverTitel === appState.steps.currentSavedTitle) store.aktiverTitel = title;
    saveDataStore(store);
    appState.steps.currentSavedTitle = title;
    renderTitleOptions(store.arbeitstitel, title);
  } else if (!appState.steps.currentSavedTitle) {
    // Neuer Titel
    if (!store.arbeitstitel.includes(title)) store.arbeitstitel.push(title);
    store.aktiverTitel = title;
    saveDataStore(store);
    appState.steps.currentSavedTitle = title;
    renderTitleOptions(store.arbeitstitel, title);
  }

  updateStepInputState();
}

// ─── Neuer Titel ─────────────────────────────────────────────────────────────

function newTitle() {
  resetForTitleChange();
  document.getElementById('jobTitleInput').value = '';
  document.getElementById('jobTitleSelect').value = '';
  appState.steps.list.length = 0;
  renderSteps();
  appState.steps.currentSavedTitle = null;
  updateStepInputState();
  document.getElementById('jobTitleInput').focus();
}

// ─── Titel löschen ────────────────────────────────────────────────────────────

function deleteTitle() {
  const title = document.getElementById('jobTitleInput').value.trim();
  if (!title) return;

  if (!confirm(`Arbeitstitel „${title}" und alle zugehörigen Schritte wirklich löschen?`)) return;

  const store = getDataStore();
  if (store.arbeitstitel.includes(title)) {
    delete store.schritte[title];
    store.arbeitstitel = store.arbeitstitel.filter(t => t !== title);
    if (store.aktiverTitel === title) store.aktiverTitel = null;
    saveDataStore(store);
    renderTitleOptions(store.arbeitstitel);
  }

  // Formular leeren
  document.getElementById('jobTitleInput').value = '';
  appState.steps.list.length = 0;
  renderSteps();
  appState.steps.currentSavedTitle = null;
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

  appState.steps.list.push(value);
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
    appState.steps.list.push(pendingStep);
    stepInput.value = '';
    renderSteps();
  }

  if (appState.steps.list.length === 0) {
    stepInput.focus();
    return;
  }

  const store = getDataStore();

  // Umbenennen: alten Titel entfernen wenn der Name geändert wurde
  if (appState.steps.currentSavedTitle && appState.steps.currentSavedTitle !== title) {
    delete store.schritte[appState.steps.currentSavedTitle];
    store.arbeitstitel = store.arbeitstitel.filter(t => t !== appState.steps.currentSavedTitle);
    if (store.aktiverTitel === appState.steps.currentSavedTitle) store.aktiverTitel = null;
  }

  // Schritte + Titel + aktiverTitel in einem Schreibvorgang speichern
  store.schritte[title] = [...appState.steps.list];
  if (!store.arbeitstitel.includes(title)) store.arbeitstitel.push(title);
  store.aktiverTitel = title;
  saveDataStore(store);

  renderTitleOptions(store.arbeitstitel, title);
  appState.steps.currentSavedTitle = title;

  const confirm = document.getElementById('saveConfirm');
  confirm.textContent = `„${title}": ${appState.steps.list.length} Schritt${appState.steps.list.length > 1 ? 'e' : ''} gespeichert.`;
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

function updateStepPlaceholder() {
  const input = document.getElementById('stepInput');
  if (!input || input.classList.contains('input--error')) return;
  input.placeholder = appState.steps.list.length > 0
    ? 'Noch mehr Schritte?'
    : 'z.B. Vorbereitung Utensilien';
}

function renderSteps() {
  const list = document.getElementById('stepList');
  list.innerHTML = '';
  appState.steps.list.forEach((step, index) => {
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
  updateStepPlaceholder();
}

function editStep(index) {
  const list = document.getElementById('stepList');
  const li   = list.children[index];

  const input = document.createElement('input');
  input.type  = 'text';
  input.value = appState.steps.list[index];
  input.className = 'step-edit-input';
  input.setAttribute('aria-label', `Schritt ${index + 1} bearbeiten`);

  const btnSave   = makeIconBtn('check', 'step-btn--save',   'Änderung speichern',    confirmEdit);
  const btnCancel = makeIconBtn('x',     'step-btn--cancel', 'Bearbeitung abbrechen', () => renderSteps());

  function confirmEdit() {
    const newValue = input.value.trim();
    if (newValue) appState.steps.list[index] = newValue;
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
  appState.steps.list.splice(index, 1);
  renderSteps();
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  migrateIfNeeded();

  // Initiale Zustand: Schritt-Eingabe deaktivieren solange kein Titel vorhanden
  updateStepInputState();

  // Alle gespeicherten Titel ins Dropdown laden
  const store = getDataStore();
  renderTitleOptions(store.arbeitstitel);

  // Letzten aktiven Titel + seine Schritte wiederherstellen
  const aktiverTitel = store.aktiverTitel;
  if (aktiverTitel && store.arbeitstitel.includes(aktiverTitel)) {
    document.getElementById('jobTitleInput').value = aktiverTitel;
    document.getElementById('jobTitleSelect').value = aktiverTitel;
    appState.steps.currentSavedTitle = aktiverTitel;
    appState.steps.list.push(...(store.schritte[aktiverTitel] || []));
    renderSteps();
    updateStepInputState();
  }

  // Icons für statische Buttons (Stift, Mülleimer) rendern
  lucide.createIcons();
});
