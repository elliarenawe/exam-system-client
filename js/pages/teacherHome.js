import { renderNav } from '../components/nav.js';
import { requireAuth, formatDate } from '../utils/helpers.js';
import { ExamService } from '../services/ExamService.js';

renderNav('nav');

const user = requireAuth(['teacher']);
if (!user) throw new Error('Unauthorized');

const examService = new ExamService();
document.getElementById('welcomeText').textContent = `שלום, ${user.name}`;

/** מציג את רשימת המבחנים של המורה המחובר */
function renderExams() {
  const exams = examService.getExamsByTeacher(user.id);
  const container = document.getElementById('examList');

  if (!exams.length) {
    container.innerHTML = '<p class="empty-state">עדיין לא נוצרו מבחנים. לחץ על "יצירת מבחן חדש".</p>';
    return;
  }

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>שם</th>
          <th>קוד</th>
          <th>קטגוריה</th>
          <th>שאלות</th>
          <th>עודכן</th>
          <th>פעולות</th>
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
                <td><a class="btn btn-secondary" href="exam.html?id=${exam.id}">ניהול</a></td>
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
}

renderExams();
