const THEME_KEY = 'exam_theme';

/** Returns the active theme name. */
export function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Applies light or dark theme and persists the choice. */
export function setTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
}

/** Toggles between light and dark mode. */
export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
