/**
 * File: nav.js
 * Description: Global navigation and layout bootstrapper.
 *
 * This script is responsible for dynamically injecting and managing a consistent,
 * sticky header and breadcrumb navigation across all pages of the site.
 *
 * Key Responsibilities:
 * - Injects a sticky header with the site brand, primary navigation, and theme toggle.
 * - Provides responsive behavior, collapsing the navigation into a "burger" menu on mobile devices.
 * - Synchronizes the color theme (light/dark) with `localStorage` and applies it to the `<html>` element.
 * - Dynamically places controls (search, theme toggle) in the correct location for desktop vs. mobile.
 * - Inserts simple breadcrumb navigation below the header.
 * - Updates CSS custom properties (`--header-h`, `--breadcrumbs-h`) to allow other content to correctly position itself below the sticky elements.
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // A debug flag to enable extra logging, activated by a URL parameter.
    const NAV_DEBUG = (function() {
      try { return /(?:^|[?&])navdebug=1(?:&|$)/.test(location.search); } catch (e) { return false; }
    })();
    const log = NAV_DEBUG ? (...args) => { try { console.debug('[nav]', ...args); } catch (e) {} } : () => {};

    // Create the header element with its inner HTML structure.
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="Portal Home">
        <img src="img/logo_iut.png" alt="IUT" loading="lazy" decoding="async" />
        <span>Portail IUT</span>
      </a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      <div id="controls" class="header-controls" role="group" aria-label="Search and Theme">
        <input id="search" type="text" placeholder="Rechercher..." aria-label="Search">
        <button id="theme-toggle" aria-label="Toggle Theme"><i class="fa-regular fa-moon"></i></button>
      </div>
    `;

    // Insert the header at the top of the body.
    document.body.insertBefore(header, document.body.firstChild);

    // Inject minimal fallback CSS if the main stylesheet is missing.
    (function ensureHeaderStyles() {
      try {
        const hasMainCss = !!document.querySelector('link[href$="css/style_index.css"],link[href*="style_index.css"]');
        if (!hasMainCss) {
          log('style_index.css not detected, injecting minimal fallback styles.');
          const style = document.createElement('style');
          style.textContent = `
            .site-header{position:fixed;top:0;left:0;right:0;z-index:1000;background:#fff;color:#111;padding:.6rem .8rem;box-shadow:0 2px 10px rgba(0,0,0,.08)}
            body{padding-top:60px}
          `;
          document.head.appendChild(style);
        }
      } catch (e) {}
    })();

    /**
     * Marks the navigation link corresponding to the current page as 'active'.
     */
    function markActiveLink() {
      const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      header.querySelectorAll('nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        const isActive = (href === path) || (path === '' && href === 'index.html');
        a.classList.toggle('active', isActive);
      });
    }
    markActiveLink();

    // --- Mobile Navigation Toggle ---
    const navToggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('nav');
    navToggle?.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      if (window.Analytics) window.Analytics.track('menu_toggle', { state: nav.classList.contains('open') ? 'open' : 'closed' });
      setTimeout(() => { updateHeights(); placeControls(); }, 60);
    });

    // --- Theme Synchronization ---
    const themeBtn = header.querySelector('#theme-toggle');
    const rootEl = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    rootEl.setAttribute('data-theme', currentTheme);
    if (themeBtn) themeBtn.innerHTML = currentTheme === 'light' ? '<i class="fa-regular fa-moon"></i>' : '<i class="fa-regular fa-sun"></i>';
    
    themeBtn?.addEventListener('click', () => {
      const newTheme = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      rootEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeBtn.innerHTML = newTheme === 'light' ? '<i class="fa-regular fa-moon"></i>' : '<i class="fa-regular fa-sun"></i>';
      if (window.Analytics) window.Analytics.track('theme_toggle', { theme: newTheme });
    });

    // --- Breadcrumbs ---
    const titles = { 
      'index.html': 'Home', 
      'contact.html': 'Contact',
      'edeta.html': 'EDETA App',
      'notes.html': 'Grades'
    };
    const pagePath = (location.pathname.split('/').pop() || 'index.html');
    const currentTitle = titles[pagePath] || document.title || 'Page';
    if (pagePath !== 'index.html') {
      const bc = document.createElement('nav');
      bc.className = 'breadcrumbs';
      bc.setAttribute('aria-label', 'Breadcrumb');
      bc.innerHTML = `<a href="index.html">Home</a> <span class="sep">›</span> <span>${currentTitle}</span>`;
      header.insertAdjacentElement('afterend', bc);
    }
    
    /**
     * Updates CSS variables for sticky header and breadcrumbs heights.
     */
    function updateHeights() {
      const h = header.offsetHeight || 56;
      const b = document.querySelector('.breadcrumbs')?.offsetHeight || 0;
      rootEl.style.setProperty('--header-h', `${h}px`);
      rootEl.style.setProperty('--breadcrumbs-h', `${b}px`);
      document.body.classList.add('has-sticky');
      if (nav) nav.style.top = `${h}px`; // Ensure mobile nav opens below header
    }
    updateHeights();
    window.addEventListener('resize', () => setTimeout(() => { updateHeights(); placeControls(); }, 50));
    const logoImg = header.querySelector('.brand img');
    if (logoImg) {
      logoImg.addEventListener('load', () => setTimeout(updateHeights, 10));
      logoImg.addEventListener('error', () => setTimeout(updateHeights, 10));
    }

    /**
     * Dynamically repositions controls (search, theme) between the main header
     * and the mobile navigation menu based on viewport size.
     */
    function placeControls() {
      const isMobile = window.innerWidth <= 800;
      const searchInput = header.querySelector('#search');
      const themeToggle = header.querySelector('#theme-toggle');

      const desktopControls = header.querySelector('#controls');
      const mobileControls = nav.querySelector('.controls');

      if (isMobile) {
        // Move all controls into the mobile navigation container
        [searchInput, themeToggle].forEach(el => {
          if (el && mobileControls && !mobileControls.contains(el)) mobileControls.appendChild(el);
        });
      } else {
        // Move all controls to the desktop header controls container
        [searchInput, themeToggle].forEach(el => {
          if (el && desktopControls && !desktopControls.contains(el)) desktopControls.appendChild(el);
        });
      }
    }
    placeControls();

    // Debounced analytics for search input.
    const searchInput = header.querySelector('#search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (window.Analytics) {
            window.Analytics.track('search', {
              len: (searchInput.value || '').length,
              page: (pagePath || 'index.html')
            });
          }
        }, 400);
      });
    }
  });
})();
