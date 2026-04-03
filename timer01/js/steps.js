const steps = [];

function addStep() {
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

function saveSteps() {
  if (steps.length === 0) {
    document.getElementById('stepInput').focus();
    return;
  }

  const titleInput = document.getElementById('jobTitleInput');
  const title = titleInput.value.trim();

  localStorage.setItem('arbeitsschritte', JSON.stringify(steps));

  // Arbeitstitel speichern falls vorhanden
  if (title) {
    const titles = getSavedTitles();
    if (!titles.includes(title)) {
      titles.push(title);
      localStorage.setItem('arbeitstitel', JSON.stringify(titles));
      renderTitleOptions(titles, title);
    }
  }

  const confirm = document.getElementById('saveConfirm');
  confirm.textContent = `${steps.length} Schritt${steps.length > 1 ? 'e' : ''} gespeichert.`;
  confirm.classList.remove('hidden');

  setTimeout(() => confirm.classList.add('hidden'), 3000);
}

function selectJobTitle() {
  const select = document.getElementById('jobTitleSelect');
  const input  = document.getElementById('jobTitleInput');
  if (select.value) input.value = select.value;
}

function getSavedTitles() {
  const raw = localStorage.getItem('arbeitstitel');
  return raw ? JSON.parse(raw) : [];
}

function renderTitleOptions(titles, selectedValue = '') {
  const select = document.getElementById('jobTitleSelect');
  select.innerHTML = '<option value="">— Titel auswählen —</option>';
  titles.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    if (t === selectedValue) opt.selected = true;
    select.appendChild(opt);
  });
}

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
  const li = list.children[index];

  const input = document.createElement('input');
  input.type = 'text';
  input.value = steps[index];
  input.className = 'step-edit-input';
  input.setAttribute('aria-label', `Schritt ${index + 1} bearbeiten`);

  const btnSave   = makeIconBtn('check',  'step-btn--save',   'Änderung speichern',   confirmEdit);
  const btnCancel = makeIconBtn('x',      'step-btn--cancel', 'Bearbeitung abbrechen', () => renderSteps());

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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('stepInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addStep();
  });

  // Gespeicherte Schritte wiederherstellen
  const savedSteps = localStorage.getItem('arbeitsschritte');
  if (savedSteps) {
    steps.push(...JSON.parse(savedSteps));
    renderSteps();
  }

  // Gespeicherte Titel in Dropdown laden
  renderTitleOptions(getSavedTitles());
});
