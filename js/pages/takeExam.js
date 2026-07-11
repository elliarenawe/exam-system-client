import { renderNav } from '../components/nav.js';
import { requireAuth, getQueryParam } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js';

renderNav('nav');

const user = requireAuth(['student']);
if (!user) throw new Error('Unauthorized');

const examId = getQueryParam('id');
const examService = new ExamService();
const exam = examService.getExamById(examId);

if (!exam) {
  document.body.innerHTML = '<main class="container"><div class="card">Exam not found.</div></main>';
  throw new Error('Exam not found');
}

document.getElementById('examTitle').textContent = exam.name;
document.getElementById('examMeta').textContent = `${exam.category} • ${exam.durationMinutes} minutes • ${exam.questions.length} questions`;

const questionsContainer = document.getElementById('questionsContainer');

if (!exam.questions.length) {
  questionsContainer.innerHTML = '<p class="empty-state">This exam has no questions yet.</p>';
} else {
  questionsContainer.innerHTML = exam.questions
    .map(
      (question, index) => `
        <div class="question-block">
          <strong>Question ${index + 1}:</strong> ${question.text}
          ${question.options
            .map(
              (option, optionIndex) => `
                <label class="option-row">
                  <input type="radio" name="question_${index}" value="${optionIndex}" required>
                  <span>${option}</span>
                </label>
              `,
            )
            .join('')}
        </div>
      `,
    )
    .join('');
}

document.getElementById('takeExamForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const answers = exam.questions.map((_, index) => {
    const selected = document.querySelector(`input[name="question_${index}"]:checked`);
    return selected ? Number(selected.value) : -1;
  });

  const result = examService.submitExam(exam.id, user.id, answers);
  document.getElementById('resultBox').innerHTML = `
    <div class="alert alert-success">
      Exam submitted successfully. Your score: <strong>${result.score}%</strong>
      <div style="margin-top:12px;">
        <a class="btn btn-secondary" href="index.html">Back to Dashboard</a>
      </div>
    </div>
  `;
  event.target.querySelector('button[type="submit"]').disabled = true;
});
