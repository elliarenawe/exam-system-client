import { renderNav } from '../components/nav.js';
import { AuthService } from '../services/AuthService.js';
import { appPath } from '../utils/helpers.js';

renderNav('nav');

const authService = new AuthService();
const form = document.getElementById('registerForm');
const message = document.getElementById('message');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.innerHTML = '';

  try {
    authService.register({
      name: document.getElementById('name').value.trim(),
      idNumber: document.getElementById('idNumber').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
      role: document.getElementById('role').value,
    });

    message.innerHTML = '<div class="alert alert-success">ההרשמה הצליחה. מעביר לדף התחברות...</div>';
    setTimeout(() => {
      window.location.href = appPath('login.html');
    }, 1000);
  } catch (error) {
    message.innerHTML = `<div class="alert alert-error">${error.message === 'User with this email or ID already exists' ? 'משתמש עם אימייל או ת.ז זה כבר קיים' : error.message}</div>`;
  }
});
