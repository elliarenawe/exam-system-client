import { renderNav } from '../components/nav.js';
import { requireAuth, getQueryParam, formatDate } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js?v=2';
import { StorageService } from '../services/StorageService.js';

renderNav('nav');

const user = requireAuth(['teacher']);
if (!user) throw new Error('Unauthorized');

const examId = getQueryParam('id');
const examService = new ExamService();
const userStorage = new StorageService('exam_users');

let exam = examService.getExamById(examId);

if (!exam) {
  document.body.innerHTML = '<main class="container"><div class="card">המבחן לא נמצא.</div></main>';
  throw new Error('Exam not found');
}

// מורה יכול לנהל רק מבחנים שיצר בעצמו
if (exam.teacherId !== user.id) {
  document.body.innerHTML = '<main class="container"><div class="card">אין הרשאה לערוך מבחן זה.</div></main>';
  throw new Error('Forbidden');
}

function renderExamInfo() {
  document.getElementById('examTitle').textContent = exam.name;
  document.getElementById('examInfo').innerHTML = `
    <p><strong>ID:</strong> ${exam.id}</p>
    <p><strong>קוד מבחן:</strong> <span class="badge">${exam.code}</span></p>
    <p><strong>קטגוריה:</strong> ${exam.category}</p>
    <p><strong>משך זמן:</strong> ${exam.durationMinutes} דקות</p>
    <div class="form-group"><label>תיאור</label><textarea id="description">${exam.description}</textarea></div>
    <div class="grid-2">
      <div class="form-group"><label>שם המבחן</label><input id="name" value="${exam.name}"></div>
      <div class="form-group"><label>קטגוריה</label><input id="category" value="${exam.category}"></div>
    </div>
    <div class="form-group"><label>משך זמן (דקות)</label><input id="durationMinutes" type="number" value="${exam.durationMinutes}"></div>
  `;
}

function renderQuestions() {
  const container = document.getElementById('questionsList');
  if (!exam.questions.length) {
    container.innerHTML = '<p class="empty-state">אין שאלות עדיין.</p>';
    return;
  }

  container.innerHTML = exam.questions
    .map(
      (question, index) => `
        <div class="question-block">
          <strong>שאלה ${index + 1}:</strong> ${question.text}
          <ul>${question.options.map((option, optionIndex) => `<li>${optionIndex === question.correctIndex ? '✅' : ''} ${option}</li>`).join('')}</ul>
          <button class="btn btn-danger remove-question" data-id="${question.id}">מחק שאלה</button>
        </div>
      `,
    )
    .join('');

  container.querySelectorAll('.remove-question').forEach((button) => {
    button.addEventListener('click', () => {
      exam.removeQuestion(button.dataset.id);
      examService.updateExam(exam.id, exam.toJSON());
      exam = examService.getExamById(exam.id);
      renderQuestions();
    });
  });
}

function renderResults() {
  const results = examService.getResultsByExam(exam.id);
  const users = userStorage.getAll();
  const container = document.getElementById('resultsList');

  if (!results.length) {
    container.innerHTML = '<p class="empty-state">אין הגשות תלמידים עדיין.</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead><tr><th>סטודנט</th><th>ציון</th><th>תאריך הגשה</th></tr></thead>
      <tbody>
        ${results
          .map((result) => {
            const student = users.find((item) => item.id === result.studentId);
            return `<tr><td>${student?.name || result.studentId}</td><td>${result.score}%</td><td>${formatDate(result.submittedAt)}</td></tr>`;
          })
          .join('')}
      </tbody>
    </table>
  `;
}

document.getElementById('saveExamBtn').addEventListener('click', () => {
  exam = examService.updateExam(exam.id, {
    name: document.getElementById('name').value.trim(),
    description: document.getElementById('description').value.trim(),
    category: document.getElementById('category').value.trim(),
    durationMinutes: document.getElementById('durationMinutes').value,
    questions: exam.questions.map((q) => q.toJSON()),
    teacherId: user.id,
  });
  alert('המבחן עודכן בהצלחה');
  renderExamInfo();
});

document.getElementById('deleteExamBtn').addEventListener('click', () => {
  if (confirm('למחוק את המבחן?')) {
    examService.deleteExam(exam.id);
    window.location.href = 'index.html';
  }
});

document.getElementById('addQuestionForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const options = [...document.querySelectorAll('.option-input')]
    .map((input) => input.value.trim())
    .filter(Boolean);

  exam.addQuestion({
    text: document.getElementById('questionText').value.trim(),
    options,
    correctIndex: document.getElementById('correctIndex').value,
  });

  examService.updateExam(exam.id, exam.toJSON());
  exam = examService.getExamById(exam.id);
  event.target.reset();
  renderQuestions();
});

renderExamInfo();
renderQuestions();
renderResults();
