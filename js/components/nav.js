import { logout, appPath } from '../utils/helpers.js';
import { AuthService } from '../services/AuthService.js';
import { getTheme, toggleTheme } from './theme.js';

const authService = new AuthService();

/** מציג את סרגל הניווט המשותף בכל הדפים */
export function renderNav(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const user = authService.getCurrentUser();
  const isDark = getTheme() === 'dark';

  let links = `<a href="${appPath('index.html')}">דף ראשי</a>`;

  if (user) {
    if (user.role === 'teacher') {
      links += `<a href="${appPath('teacher/index.html')}">אזור מורה</a>`;
      links += `<a href="${appPath('teacher/create-exam.html')}">יצירת מבחן</a>`;
    } else {
      links += `<a href="${appPath('student/index.html')}">אזור סטודנט</a>`;
      links += `<a href="${appPath('student/search.html')}">חיפוש מבחן</a>`;
    }
    links += `<a class="btn btn-secondary" href="${appPath('logout.html')}">התנתקות</a>`;
  } else {
    links += `<a href="${appPath('login.html')}">התחברות</a>`;
    links += `<a href="${appPath('register.html')}">הרשמה</a>`;
  }

  links += `<button type="button" class="btn btn-secondary" id="themeToggleBtn">${isDark ? 'מצב בהיר' : 'מצב כהה'}</button>`;

  container.innerHTML = `
    <nav class="navbar">
      <div class="inner">
        <div class="brand">מערכת מבחנים</div>
        <div class="links">${links}</div>
      </div>
    </nav>
  `;

  container.querySelector('#themeToggleBtn')?.addEventListener('click', () => {
    toggleTheme();
    renderNav(containerId);
  });
}

// שומרים את הפונקציה לשימוש ישיר מדפים אחרים
export { logout };
