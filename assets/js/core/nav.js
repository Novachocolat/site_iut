/**
 * File: nav.js
 * Description: Global navigation and layout bootstrapper.
 *
 * Injects and manages a consistent, sticky header and breadcrumb navigation on every page.
 *
 * Key Responsibilities:
 * - Injects a sticky header with the site brand, primary navigation, and theme toggle.
 * - Provides responsive behavior, collapsing the navigation into a "burger" menu on mobile devices.
 * - Synchronizes the color theme (light/dark) with `localStorage` (see theme.js).
 * - Moves the controls (search, theme toggle) between desktop and mobile containers.
 * - Inserts simple breadcrumb navigation below the header.
 * - Updates the CSS custom properties `--header-h` and `--breadcrumbs-h` used to offset the content.
 *
 * Debug: append `?navdebug=1` to a URL to enable extra logging.
 */
import { applyTheme, getSavedTheme, themeIcon } from './theme.js';

const HOME_URL = '/index.html';
const MOBILE_BREAKPOINT = 800; // Keep in sync with the media query in layout.css.
const SEARCH_ANALYTICS_DELAY_MS = 400;

const BREADCRUMB_TITLES = {
  'index.html': 'Home',
  'contact.html': 'Contact',
  'edeta.html': 'EDETA App',
  'notes.html': 'Grades'
};

const NAV_DEBUG = (() => {
  try { return /(?:^|[?&])navdebug=1(?:&|$)/.test(location.search); } catch (e) { return false; }
})();
const log = NAV_DEBUG ? (...args) => { try { console.debug('[nav]', ...args); } catch (e) {} } : () => {};

/** Sends an analytics event if the analytics module is loaded on this page. */
function track(name, params) {
  if (window.Analytics) window.Analytics.track(name, params);
}

/** @returns {string} The file name of the current page (defaults to index.html). */
function currentPageName() {
  return location.pathname.split('/').pop() || 'index.html';
}

/** Creates the header element and inserts it at the top of the body. */
function buildHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="brand" href="${HOME_URL}" aria-label="Portal Home">
      <img src="/assets/img/logo_iut.png" alt="IUT" loading="lazy" decoding="async" />
      <span>Portail IUT</span>
    </a>
    <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
    <div id="controls" class="header-controls" role="group" aria-label="Search and Theme">
      <input id="search" type="text" placeholder="Rechercher..." aria-label="Search">
      <button id="theme-toggle" aria-label="Toggle Theme"><i class="fa-regular fa-moon"></i></button>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);
  return header;
}

/** Injects minimal fallback CSS if the main stylesheet is missing. */
function ensureHeaderStyles() {
  try {
    if (document.querySelector('link[href*="layout.css"]')) return;
    log('layout.css not detected, injecting minimal fallback styles.');
    const style = document.createElement('style');
    style.textContent = `
      .site-header{position:fixed;top:0;left:0;right:0;z-index:1000;background:#fff;color:#111;padding:.6rem .8rem;box-shadow:0 2px 10px rgba(0,0,0,.08)}
      body{padding-top:60px}
    `;
    document.head.appendChild(style);
  } catch (e) {}
}

/** Marks the navigation link corresponding to the current page as 'active'. */
function markActiveLink(header) {
  const path = currentPageName().toLowerCase();
  header.querySelectorAll('nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    a.classList.toggle('active', href === path);
  });
}

/** Wires the theme toggle button. */
function setupThemeToggle(header) {
  const themeBtn = header.querySelector('#theme-toggle');
  const rootEl = document.documentElement;

  const theme = getSavedTheme();
  rootEl.setAttribute('data-theme', theme);
  if (themeBtn) themeBtn.innerHTML = themeIcon(theme);

  themeBtn?.addEventListener('click', () => {
    const newTheme = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    themeBtn.innerHTML = themeIcon(newTheme);
    track('theme_toggle', { theme: newTheme });
  });
}

/** Inserts breadcrumbs below the header (except on the home page). */
function setupBreadcrumbs(header) {
  const pageName = currentPageName();
  if (pageName === 'index.html') return;

  const title = BREADCRUMB_TITLES[pageName] || document.title || 'Page';
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
  breadcrumbs.innerHTML = `<a href="${HOME_URL}">Home</a> <span class="sep">›</span> <span>${title}</span>`;
  header.insertAdjacentElement('afterend', breadcrumbs);
}

/** Sends a debounced analytics event when the user types in the search box. */
function setupSearchAnalytics(header) {
  const searchInput = header.querySelector('#search');
  if (!searchInput) return;

  let timeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      track('search', { len: (searchInput.value || '').length, page: currentPageName() });
    }, SEARCH_ANALYTICS_DELAY_MS);
  });
}

function initNav() {
  const header = buildHeader();
  ensureHeaderStyles();
  markActiveLink(header);

  const rootEl = document.documentElement;
  const nav = header.querySelector('nav');
  const navToggle = header.querySelector('.nav-toggle');

  /** Updates CSS variables for the sticky header and breadcrumbs heights. */
  function updateHeights() {
    const headerHeight = header.offsetHeight || 56;
    const breadcrumbsHeight = document.querySelector('.breadcrumbs')?.offsetHeight || 0;
    rootEl.style.setProperty('--header-h', `${headerHeight}px`);
    rootEl.style.setProperty('--breadcrumbs-h', `${breadcrumbsHeight}px`);
    document.body.classList.add('has-sticky');
    if (nav) nav.style.top = `${headerHeight}px`; // Ensure mobile nav opens below header
  }

  /** Moves the controls (search, theme) between the desktop header and the mobile menu. */
  function placeControls() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const target = isMobile ? nav?.querySelector('.controls') : header.querySelector('#controls');
    if (!target) return;
    ['#search', '#theme-toggle'].forEach(selector => {
      const el = header.querySelector(selector);
      if (el && !target.contains(el)) target.appendChild(el);
    });
  }

  // Mobile menu toggle.
  navToggle?.addEventListener('click', () => {
    if (!nav) return;
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    track('menu_toggle', { state: isOpen ? 'open' : 'closed' });
    setTimeout(() => { updateHeights(); placeControls(); }, 60);
  });

  setupThemeToggle(header);
  setupBreadcrumbs(header);
  updateHeights();

  window.addEventListener('resize', () => setTimeout(() => { updateHeights(); placeControls(); }, 50));
  const logoImg = header.querySelector('.brand img');
  if (logoImg) {
    logoImg.addEventListener('load', () => setTimeout(updateHeights, 10));
    logoImg.addEventListener('error', () => setTimeout(updateHeights, 10));
  }

  placeControls();
  setupSearchAnalytics(header);
}

// Modules run before DOMContentLoaded fires, so the body is available by then.
document.addEventListener('DOMContentLoaded', initNav);
