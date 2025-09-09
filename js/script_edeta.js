// Apply saved theme on load
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.innerHTML = savedTheme === 'light'
      ? '<i class="fa-regular fa-moon"></i>'
      : '<i class="fa-regular fa-sun"></i>';
  }
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.innerHTML = next === 'light'
      ? '<i class="fa-regular fa-moon"></i>'
      : '<i class="fa-regular fa-sun"></i>';
  });
}
