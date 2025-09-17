// Applique le thème sauvegardé au chargement
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = savedTheme === 'light'
    ? '<i class="fa-regular fa-moon"></i>'
    : '<i class="fa-regular fa-sun"></i>';
}
themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.innerHTML = next === 'light'
    ? '<i class="fa-regular fa-moon"></i>'
    : '<i class="fa-regular fa-sun"></i>';
});

// Recherche intelligente + easter egg "rickroll"
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  if (q === "rickroll") {
    window.location.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0";
    return;
  }
  document.querySelectorAll('section').forEach(section => {
    let found = false;
    section.querySelectorAll('.card,li').forEach(el => {
      const match = el.textContent.toLowerCase().includes(q);
      el.style.display = match ? '' : 'none';
      if (match) found = true;
    });
    section.style.display = found || q === '' ? '' : 'none';
  });
});