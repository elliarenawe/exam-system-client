/** Path helpers for pages in root and nested folders. */
export function appPath(relativePath) {
  const inSubfolder = /\/(teacher|student)\//.test(window.location.pathname);
  return inSubfolder ? `../${relativePath}` : relativePath;
}

/** Supported question difficulty levels. */
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'קל' },
  { value: 'medium', label: 'בינוני' },
  { value: 'hard', label: 'קשה' },
];

export function getDifficultyLabel(value) {
  return DIFFICULTY_LEVELS.find((level) => level.value === value)?.label || value;
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateExamCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function formatDate(isoString) {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('he-IL');
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function requireAuth(allowedRoles = []) {
  const raw = localStorage.getItem('currentUser');
  if (!raw) {
    window.location.href = appPath('login.html');
    return null;
  }

  const user = JSON.parse(raw);
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    window.location.href = user.role === 'teacher' ? appPath('teacher/index.html') : appPath('student/index.html');
    return null;
  }

  return user;
}

export function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = appPath('index.html');
}

export function calculateScore(exam, answers) {
  let correct = 0;
  exam.questions.forEach((question, index) => {
    if (Number(answers[index]) === Number(question.correctIndex)) {
      correct += 1;
    }
  });

  const total = exam.questions.length || 1;
  return Math.round((correct / total) * 100);
}
