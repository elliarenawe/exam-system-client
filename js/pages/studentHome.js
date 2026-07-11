import { renderNav } from '../components/nav.js';
import { requireAuth, formatDate } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js?v=2';

renderNav('nav');

const user = requireAuth(['student']);
if (!user) throw new Error('Unauthorized');

const examService = new ExamService();
document.getElementById('welcomeText').textContent = `שלום, ${user.name}`;

const results = examService.getResultsByStudent(user.id);
document.getElementById('averageScore').textContent = `${examService.getStudentAverage(user.id)}%`;
document.getElementById('examCount').textContent = String(results.length);

const historyList = document.getElementById('historyList');
if (!results.length) {
  historyList.innerHTML = '<p class="empty-state">עדיין לא ביצעת מבחנים.</p>';
} else {
  historyList.innerHTML = `
    <table class="table">
      <thead><tr><th>מבחן</th><th>ציון</th><th>תאריך</th></tr></thead>
      <tbody>
        ${results
          .map((result) => {
            const exam = examService.getExamById(result.examId);
            return `<tr><td><span dir="ltr" class="ltr-text">${exam?.name || result.examId}</span></td><td>${result.score}%</td><td>${formatDate(result.submittedAt)}</td></tr>`;
          })
          .join('')}
      </tbody>
    </table>
  `;
}
