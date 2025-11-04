// Homepage: simple section filter by search query + fun easter egg
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search');
  if (!input) return;
  input.addEventListener('input', e => {
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
});