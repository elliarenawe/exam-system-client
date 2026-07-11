import { renderNav } from '../components/nav.js';
import { AuthService } from '../services/AuthService.js';
import { appPath } from '../utils/helpers.js';

renderNav('nav');

const authService = new AuthService();
const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.innerHTML = '';

  try {
    const user = authService.login(
      document.getElementById('email').value.trim(),
      document.getElementById('password').value,
    );

    window.location.href = user.role === 'teacher' ? appPath('teacher/index.html') : appPath('student/index.html');
  } catch (error) {
    message.innerHTML = `<div class="alert alert-error">${error.message === 'Invalid email or password' ? 'אימייל או סיסמה שגויים' : error.message}</div>`;
  }
});
