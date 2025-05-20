  // Gestion du thème clair/sombre synchronisé avec localStorage
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