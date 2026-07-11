import { renderNav } from '../components/nav.js';
import { requireAuth, formatDate } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js';

renderNav('nav');

const user = requireAuth(['teacher']);
if (!user) throw new Error('Unauthorized');

const examService = new ExamService();
document.getElementById('welcomeText').textContent = `Welcome, ${user.name}`;

function renderExams() {
  const exams = examService.getExamsByTeacher(user.id);
  const container = document.getElementById('examList');

  if (!exams.length) {
    container.innerHTML = '<p class="empty-state">No exams yet. Create your first exam.</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Category</th>
          <th>Questions</th>
          <th>Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${exams
          .map(
            (exam) => `
              <tr>
                <td>${exam.name}</td>
                <td><span class="badge">${exam.code}</span></td>
                <td>${exam.category}</td>
                <td>${exam.questions.length}</td>
                <td>${formatDate(exam.updatedAt)}</td>
                <td><a class="btn btn-secondary" href="exam.html?id=${exam.id}">Manage</a></td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
}

renderExams();
