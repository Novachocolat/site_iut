// Thème
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    themeToggle.addEventListener('click', () => {
      const current = body.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', next);
      themeToggle.innerHTML = next === 'light'
        ? '<i class="fa-regular fa-moon"></i> Sombre'
        : '<i class="fa-regular fa-sun"></i> Clair';
    });

    // Recherche intelligente
    document.getElementById('search').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
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