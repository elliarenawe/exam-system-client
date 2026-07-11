import { renderNav } from '../components/nav.js';
import { requireAuth } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js';

renderNav('nav');

const user = requireAuth(['teacher']);
if (!user) throw new Error('Unauthorized');

const examService = new ExamService();
const form = document.getElementById('createExamForm');
const message = document.getElementById('message');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const exam = examService.createExam({
    name: document.getElementById('name').value.trim(),
    description: document.getElementById('description').value.trim(),
    category: document.getElementById('category').value.trim(),
    durationMinutes: document.getElementById('durationMinutes').value,
    teacherId: user.id,
  });

  window.location.href = `exam.html?id=${exam.id}`;
});
