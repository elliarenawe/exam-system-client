import { renderNav } from '../components/nav.js';
import { requireAuth, getQueryParam } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js?v=2';

renderNav('nav');

const user = requireAuth(['student']);
if (!user) throw new Error('Unauthorized');

const examId = getQueryParam('id');
const examService = new ExamService();
const exam = examService.getExamById(examId);

if (!exam) {
  document.body.innerHTML = '<main class="container"><div class="card">המבחן לא נמצא.</div></main>';
  throw new Error('Exam not found');
}

document.getElementById('examTitle').innerHTML = `<span dir="ltr" class="ltr-text block">${exam.name}</span>`;
document.getElementById('examMeta').innerHTML = `<span dir="ltr" class="ltr-text">${exam.category}</span> • ${exam.durationMinutes} דקות • ${exam.questions.length} שאלות`;

const questionsContainer = document.getElementById('questionsContainer');
const timerBox = document.getElementById('timerBox');
const form = document.getElementById('takeExamForm');
let remainingSeconds = exam.durationMinutes * 60;
let timerId = null;

/** מציג טיימר למבחן – תוספת מעבר לדרישות הבסיסיות */
function startTimer() {
  timerBox.textContent = `זמן שנותר: ${formatTime(remainingSeconds)}`;

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    timerBox.textContent = `זמן שנותר: ${formatTime(remainingSeconds)}`;

    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      submitExam(true);
    }
  }, 1000);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

if (!exam.questions.length) {
  questionsContainer.innerHTML = '<p class="empty-state">למבחן זה אין שאלות עדיין.</p>';
  document.getElementById('submitBtn').disabled = true;
} else {
  questionsContainer.innerHTML = exam.questions
    .map(
      (question, index) => `
        <div class="question-block">
          <p class="question-title">
            <bdi class="rtl-label">שאלה ${index + 1}:</bdi>
            <span dir="ltr" class="ltr-text">${question.text}</span>
          </p>
          ${question.options
            .map(
              (option, optionIndex) => `
                <label class="option-row">
                  <input type="radio" name="question_${index}" value="${optionIndex}" required>
                  <span dir="ltr" class="ltr-text">${option}</span>
                </label>
              `,
            )
            .join('')}
        </div>
      `,
    )
    .join('');

  startTimer();
}

function buildCorrectAnswersReview(answers) {
  return exam.questions
    .map((question, index) => {
      const selected = answers[index];
      const isCorrect = selected === question.correctIndex;
      return `
        <div class="question-block">
          <p class="question-title">
            <bdi class="rtl-label">שאלה ${index + 1}:</bdi>
            <span dir="ltr" class="ltr-text">${question.text}</span>
          </p>
          ${isCorrect ? '✅ נכון' : `❌ שגוי – התשובה הנכונה: <span dir="ltr" class="ltr-text">${question.options[question.correctIndex]}</span>`}
        </div>
      `;
    })
    .join('');
}

function submitExam(autoSubmitted = false) {
  if (timerId) clearInterval(timerId);

  const answers = exam.questions.map((_, index) => {
    const selected = document.querySelector(`input[name="question_${index}"]:checked`);
    return selected ? Number(selected.value) : -1;
  });

  const result = examService.submitExam(exam.id, user.id, answers);

  document.getElementById('resultBox').innerHTML = `
    <div class="alert alert-success">
      ${autoSubmitted ? 'הזמן נגמר – המבחן נשלח אוטומטית.<br>' : ''}
      המבחן נשלח בהצלחה. הציון שלך: <strong>${result.score}%</strong>
      <h3 style="margin-top:16px;">סקירת תשובות</h3>
      ${buildCorrectAnswersReview(answers)}
      <div style="margin-top:12px;">
        <a class="btn btn-secondary" href="index.html">חזרה לאזור הסטודנט</a>
      </div>
    </div>
  `;

  form.querySelector('#submitBtn').disabled = true;
  form.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.disabled = true;
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitExam(false);
});
