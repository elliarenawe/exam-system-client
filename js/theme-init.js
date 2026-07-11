/** Apply saved theme before paint to avoid flash. */
(function applyStoredTheme() {
  const theme = localStorage.getItem('exam_theme') === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
