import { logout, appPath } from '../utils/helpers.js';
import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

export function renderNav(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const user = authService.getCurrentUser();

  let links = `<a href="${appPath('index.html')}">Home</a>`;

  if (user) {
    if (user.role === 'teacher') {
      links += `<a href="${appPath('teacher/index.html')}">Teacher Dashboard</a>`;
      links += `<a href="${appPath('teacher/create-exam.html')}">Create Exam</a>`;
    } else {
      links += `<a href="${appPath('student/index.html')}">Student Dashboard</a>`;
      links += `<a href="${appPath('student/search.html')}">Search Exam</a>`;
    }
    links += `<button class="btn btn-secondary" id="logoutBtn">Logout</button>`;
  } else {
    links += `<a href="${appPath('login.html')}">Login</a>`;
    links += `<a href="${appPath('register.html')}">Register</a>`;
  }

  container.innerHTML = `
    <nav class="navbar">
      <div class="inner">
        <div class="brand">Exam System</div>
        <div class="links">${links}</div>
      </div>
    </nav>
  `;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}
