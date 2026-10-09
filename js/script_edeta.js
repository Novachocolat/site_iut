/**
 * File: script_edeta.js
 * Description: Handles the light/dark theme toggling for the EDETA page.
 */

// Immediately apply the saved theme on script load to prevent FOUC (Flash of Unstyled Content).
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');

  // If a theme is saved in localStorage, apply it.
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    // Update the theme toggle button icon to reflect the current theme.
    if (themeToggle) {
      themeToggle.innerHTML = savedTheme === 'light'
        ? '<i class="fa-regular fa-moon"></i>' // Show moon icon for light theme
        : '<i class="fa-regular fa-sun"></i>';  // Show sun icon for dark theme
    }
  }

  // Add a click event listener to the theme toggle button.
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Determine the next theme.
      const currentTheme = body.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

      // Apply the new theme to the body and save it to localStorage.
      body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);

      // Update the button icon.
      themeToggle.innerHTML = nextTheme === 'light'
        ? '<i class="fa-regular fa-moon"></i>'
        : '<i class="fa-regular fa-sun"></i>';
    });
  }
})();
