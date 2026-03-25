/**
 * File: script_notes.js
 * Description: Handles a local theme toggle specifically for the notes page.
 * 
 * Note: This script provides theme-switching functionality that is likely redundant.
 * The global navigation script (`js/common/nav.js`) already manages the theme
 * for the entire site by setting the 'data-theme' attribute on the root `<html>` element.
 * This script targets a separate button (`#notes-theme-toggle`) and modifies the `<body>`
 * attribute, which may be a remnant of an older design.
 */
(function() {
  const themeToggle = document.getElementById('notes-theme-toggle');
  const body = document.body;

  // On script load, apply the theme saved in localStorage.
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
      // Update the button icon to reflect the current theme.
      themeToggle.innerHTML = savedTheme === 'light'
        ? '<i class="fa-regular fa-moon"></i>' // Moon for light theme
        : '<i class="fa-regular fa-sun"></i>';   // Sun for dark theme
    }
  }

  // Add a click listener to the local theme toggle button.
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

      // Apply the new theme to the body and save the preference.
      body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);

      // Update the button icon.
      if (themeToggle) {
        themeToggle.innerHTML = nextTheme === 'light'
          ? '<i class="fa-regular fa-moon"></i>'
          : '<i class="fa-regular fa-sun"></i>';
      }
    });
  }
})();