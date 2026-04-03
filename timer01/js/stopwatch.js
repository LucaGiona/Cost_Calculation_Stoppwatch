let startTime = 0;
let elapsed = 0;
let timerInterval = null;
let running = false;

function getElapsed() { return elapsed; }

function updateDisplay() {
  const total = elapsed;
  const ms = Math.floor((total % 1000) / 10);
  const seconds = Math.floor(total / 1000) % 60;
  const minutes = Math.floor(total / 60000) % 60;
  const hours = Math.floor(total / 3600000);

  document.getElementById('display').childNodes[0].textContent =
    pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  document.getElementById('millis').textContent = '.' + pad(ms);
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function start() {
  if (running) return;
  running = true;
  startTime = Date.now() - elapsed;
  timerInterval = setInterval(() => {
    elapsed = Date.now() - startTime;
    updateDisplay();
  }, 10);
}

function pause() {
  if (!running) return;
  running = false;
  clearInterval(timerInterval);
}

function stop() {
  running = false;
  clearInterval(timerInterval);
  elapsed = 0;
  updateDisplay();
}
