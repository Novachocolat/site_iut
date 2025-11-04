(function(){
  /**
   * Global navigation & layout bootstrapper
   * - Injects a sticky header with brand, centered nav, responsive controls (search + theme)
   * - Adds a simple breadcrumb right under the header
   * - Syncs theme with localStorage and exposes a toggle
   * - Handles mobile menu open/close and adjusts CSS variables for sticky spacing
   * - Marks active nav link based on current page and wires dynamic links (Admin/Connexion)
   *
   * Dependencies: fontawesome (icons), optional Analytics (window.Analytics), optional Firebase Auth roles via window.currentUserRoles
   * DOM side-effects: inserts <header.site-header> at top of <body> and <nav.breadcrumbs> after it
   */
  document.addEventListener('DOMContentLoaded', function(){
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="Accueil Portail IUT">
        <img src="img/logo_iut.png" alt="IUT" loading="lazy" decoding="async" />
        <span>Portail IUT</span>
      </a>
      <nav aria-label="Navigation principale">
        <a href="index.html">Accueil</a>
        <a href="actualites.html">Actualités</a>
        <a href="contact.html">Contact</a>
        <div class="controls" role="group" aria-label="Actions (mobile)"></div>
      </nav>
      <button class="nav-toggle" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
      <div id="controls" class="header-controls" role="group" aria-label="Recherche et thème">
        <input id="search" type="text" placeholder="Rechercher..." aria-label="Rechercher">
        <button id="theme-toggle" aria-label="Basculer le thème"><i class="fa-regular fa-moon"></i></button>
      </div>
    `;

    // Insert at top of body
    const first = document.body.firstChild;
    document.body.insertBefore(header, first);

    // Active link: highlight current page in the header nav
    const path = (location.pathname.split('/').pop()||'index.html').toLowerCase();
    /**
     * Mark the current page link as active in the header nav.
     * Uses the last segment of the URL (e.g. `login.html`).
     */
    function markActiveLink(){
      header.querySelectorAll('nav a').forEach(a => {
        const href = (a.getAttribute('href')||'').toLowerCase();
        const isActive = (href === path) || (path === '' && href === 'index.html');
        a.classList.toggle('active', isActive);
      });
    }
    markActiveLink();

    // Admin link (only for editor/admin)
    /**
     * Ensure the Admin link is present only for users with editor/admin roles.
     */
    function ensureAdminLink(){
      const roles = (window.currentUserRoles) || { admin:false, editor:false };
      const has = roles.admin || roles.editor;
      const navEl = header.querySelector('nav');
      const existing = navEl.querySelector('a[href="admin.html"]');
      if (has && !existing){
        const link = document.createElement('a');
        link.href = 'admin.html';
        link.textContent = 'Admin';
        navEl.appendChild(link);
      } else if (!has && existing){ existing.remove(); }
    }
  ensureAdminLink();
  window.addEventListener('authchange', ()=>{ ensureAdminLink(); markActiveLink(); });

    // Login link (only when logged out)
    /**
     * Ensure the Connexion link is present only when the user is logged out.
     */
    function ensureLoginLink(){
      const loggedIn = !!(window.currentUser);
      const navEl = header.querySelector('nav');
      let loginLink = navEl.querySelector('a[href="login.html"]');
      if (!loggedIn) {
        if (!loginLink) {
          loginLink = document.createElement('a');
          loginLink.href = 'login.html';
          loginLink.textContent = 'Connexion';
          navEl.appendChild(loginLink);
        }
      } else {
        if (loginLink) loginLink.remove();
      }
    }
  ensureLoginLink();
  window.addEventListener('authchange', ()=>{ ensureLoginLink(); markActiveLink(); });
  // Also re-mark after links are (re)inserted
  markActiveLink();

    // Mobile toggle
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('nav');
    toggle?.addEventListener('click', ()=>{
      nav.classList.toggle('open');
      try { window.Analytics && window.Analytics.track('menu_toggle', { state: nav.classList.contains('open') ? 'open' : 'closed' }); } catch {}
      // Recompute header/breadcrumb spacing shortly after toggle
      setTimeout(()=>{
        const h = header.offsetHeight || 56;
        const b = document.querySelector('.breadcrumbs')?.offsetHeight || 0;
        document.documentElement.style.setProperty('--header-h', h + 'px');
        document.documentElement.style.setProperty('--breadcrumbs-h', b + 'px');
      }, 50);
  // Move controls to the appropriate container after toggle
  setTimeout(placeControls, 60);
    });

    // Theme sync (global)
    const themeBtn = header.querySelector('#theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      body.setAttribute('data-theme', savedTheme);
      themeBtn.innerHTML = savedTheme === 'light' ? '<i class="fa-regular fa-moon"></i>' : '<i class="fa-regular fa-sun"></i>';
    }
    themeBtn.addEventListener('click', ()=>{
      const current = body.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeBtn.innerHTML = next === 'light' ? '<i class="fa-regular fa-moon"></i>' : '<i class="fa-regular fa-sun"></i>';
      try { window.Analytics && window.Analytics.track('theme_toggle', { theme: next }); } catch {}
    });

  // Breadcrumbs (simple: Accueil > Page courante)
    const titles = {
      'index.html': 'Accueil',
      'actualites.html': 'Actualités',
      'contact.html': 'Contact',
      'edeta.html': 'EDETA',
      'notes.html': 'Notes',
      'privacy.html': 'Confidentialité',
      'maintenance.html': 'Maintenance',
      'crash.html': 'Jinxé',
      '404.html': 'Erreur 404',
      '500.html': 'Erreur 500'
    };
    const currentTitle = titles[path] || document.title || 'Page';
    const bc = document.createElement('nav');
    bc.className = 'breadcrumbs';
    bc.setAttribute('aria-label','Fil d\'Ariane');
    bc.innerHTML = `<a href="index.html">Accueil</a> <span class="sep">›</span> <span>${currentTitle}</span>`;
    header.insertAdjacentElement('afterend', bc);

    // Set CSS vars for sticky spacing and add class
    /**
     * Update CSS variables used to offset the content based on header/breadcrumb heights.
     */
    function updateHeights(){
      const h = header.offsetHeight || 56;
      const b = bc.offsetHeight || 0;
      document.documentElement.style.setProperty('--header-h', h + 'px');
      document.documentElement.style.setProperty('--breadcrumbs-h', b + 'px');
      document.body.classList.add('has-sticky');
    }
    updateHeights();
    window.addEventListener('resize', ()=>{
      // small delay to allow reflow when nav opens/closes
      setTimeout(()=>{ updateHeights(); placeControls(); }, 50);
    });

    // Move search + theme between desktop header right and mobile menu
  const searchInput = header.querySelector('#search');
    const headerControls = header.querySelector('#controls');
    const mobileControls = nav.querySelector('.controls');
    /**
     * Place search input and theme button in the right container depending on viewport/menu state.
     * Maintains the order: search first, then theme.
     */
    function placeControls(){
      const isMobile = window.innerWidth <= 800 || nav.classList.contains('open');
      if (isMobile) {
        if (mobileControls) {
          if (searchInput && !mobileControls.contains(searchInput)) mobileControls.appendChild(searchInput);
          if (themeBtn && !mobileControls.contains(themeBtn)) mobileControls.appendChild(themeBtn);
        }
      } else {
        if (headerControls) {
          if (searchInput && !headerControls.contains(searchInput)) headerControls.appendChild(searchInput);
          if (themeBtn && !headerControls.contains(themeBtn)) headerControls.appendChild(themeBtn);
        }
      }
      // ensure order: search first, then theme
      if (searchInput && themeBtn && searchInput.parentElement === themeBtn.parentElement) {
        const parent = searchInput.parentElement;
        if (parent.firstElementChild !== searchInput) parent.insertBefore(searchInput, parent.firstElementChild);
        if (searchInput.nextElementSibling !== themeBtn) parent.insertBefore(themeBtn, searchInput.nextElementSibling);
      }
    }
    placeControls();

    // Analytics: track search input length (debounced)
    if (searchInput){
      let t; const deb = ()=>{ clearTimeout(t); t = setTimeout(()=>{
        try { window.Analytics && window.Analytics.track('search', { len: (searchInput.value||'').length, page: (path||'index.html') }); } catch {}
      }, 400); };
      searchInput.addEventListener('input', deb);
    }
  });
})();
