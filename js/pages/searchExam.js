import { renderNav } from '../components/nav.js';
import { requireAuth } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js';

renderNav('nav');

requireAuth(['student']);

const examService = new ExamService();
const form = document.getElementById('searchForm');
const resultsContainer = document.getElementById('searchResults');

function renderResults(exams) {
  if (!exams.length) {
    resultsContainer.innerHTML = '<p class="empty-state">No exams found.</p>';
    return;
  }

  resultsContainer.innerHTML = exams
    .map(
      (exam) => `
        <div class="card">
          <h3>${exam.name}</h3>
          <p>${exam.description || 'No description'}</p>
          <p><span class="badge">${exam.code}</span> ${exam.category} • ${exam.questions.length} questions</p>
          <a class="btn btn-primary" href="take-exam.html?id=${exam.id}">Start Exam</a>
        </div>
      `,
    )
    .join('');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('query').value.trim();
  renderResults(examService.searchExams(query));
});

renderResults(examService.getAllExams());
