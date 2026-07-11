import { renderNav } from '../components/nav.js';
import { requireAuth } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js?v=2';

renderNav('nav');

requireAuth(['student']);

const examService = new ExamService();
const form = document.getElementById('searchForm');
const resultsContainer = document.getElementById('searchResults');
const availableContainer = document.getElementById('availableExams');

function renderExamCards(exams, container) {
  if (!exams.length) {
    container.innerHTML = '<p class="empty-state">לא נמצאו מבחנים.</p>';
    return;
  }

  container.innerHTML = exams
    .map(
      (exam) => `
        <div class="card">
          <h3>${exam.name}</h3>
          <p>${exam.description || 'אין תיאור'}</p>
          <p><span class="badge">${exam.code}</span> ${exam.category} • ${exam.questions.length} שאלות</p>
          <a class="btn btn-primary" href="take-exam.html?id=${exam.id}">התחל מבחן</a>
        </div>
      `,
    )
    .join('');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('query').value.trim();
  renderExamCards(examService.searchExams(query), resultsContainer);
});

// הצגת כל המבחנים הזמינים בטעינת הדף
renderExamCards(examService.getAllExams(), availableContainer);
