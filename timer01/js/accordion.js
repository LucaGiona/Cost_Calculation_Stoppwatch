document.querySelectorAll('.section-heading').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', !expanded);

    const targetId = btn.getAttribute('aria-controls');
    const content = document.getElementById(targetId);

    if (content) {
      content.classList.toggle('open', !expanded);
    }
  });
});