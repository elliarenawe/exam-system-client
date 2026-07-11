# Technical Document

## GitHub + Deploy
- Source repo: `https://github.com/Mohammad-Safadi/exam-system-client`
- GitHub Pages deploy URL: `https://mohammad-safadi.github.io/exam-system-client/`

## Site Pages and Navigation

| Page | Path | Access |
|------|------|--------|
| Home | `/index.html` | Public |
| Register | `/register.html` | Public |
| Login | `/login.html` | Public |
| Teacher Dashboard | `/teacher/index.html` | Teacher |
| Create Exam | `/teacher/create-exam.html` | Teacher |
| Exam Details | `/teacher/exam.html?id=...` | Teacher |
| Student Dashboard | `/student/index.html` | Student |
| Search Exam | `/student/search.html` | Student |
| Take Exam | `/student/take-exam.html?id=...` | Student |

Logout is available from navbar on authenticated pages and returns to home.

## JSON Storage Formats

### Users (`exam_users`)
```json
[
  {
    "id": "user_...",
    "name": "Demo Teacher",
    "idNumber": "123456789",
    "email": "teacher@demo.com",
    "password": "1234",
    "role": "teacher",
    "createdAt": "2026-07-11T12:00:00.000Z"
  }
]
```

### Exams (`exam_exams`)
```json
[
  {
    "id": "exam_...",
    "name": "JavaScript Basics",
    "description": "Intro quiz",
    "category": "Web",
    "code": "A1B2C3",
    "durationMinutes": 30,
    "teacherId": "user_...",
    "questions": [
      {
        "id": "question_...",
        "text": "What is JSON?",
        "options": ["Format", "Language", "Database", "Framework"],
        "correctIndex": 0
      }
    ],
    "createdAt": "2026-07-11T12:00:00.000Z",
    "updatedAt": "2026-07-11T12:00:00.000Z"
  }
]
```

### Results (`exam_results`)
```json
[
  {
    "id": "result_...",
    "examId": "exam_...",
    "studentId": "user_...",
    "answers": [0, 2, 1],
    "score": 67,
    "submittedAt": "2026-07-11T12:30:00.000Z"
  }
]
```

### Session (`currentUser`)
Stores the logged-in user object (same shape as one user entry).

## Main Flows

### Registration Flow
1. `register.html` → `register.js`
2. `AuthService.register()` creates `User`
3. User saved to `exam_users` in localStorage
4. Redirect to login

### Login Flow
1. `login.html` → `login.js`
2. `AuthService.login()` validates credentials
3. Session saved in `currentUser`
4. Redirect by role to teacher/student dashboard

### Teacher Exam Management Flow
1. Teacher creates exam in `createExam.js`
2. `ExamService.createExam()` stores exam JSON
3. Teacher adds questions in `examDetails.js`
4. `Exam.addQuestion()` updates exam object
5. Results visible via `ExamService.getResultsByExam()`

### Student Exam Flow
1. Student searches in `searchExam.js`
2. Opens `take-exam.html?id=...`
3. Submits answers → `ExamService.submitExam()`
4. Score calculated and saved in `exam_results`
5. History shown in `studentHome.js`

## Class Responsibilities

- **User**: account entity
- **Question**: one multiple-choice question
- **Exam**: exam metadata + question collection
- **ExamResult**: one student attempt
- **StorageService**: generic localStorage CRUD
- **AuthService**: auth + session
- **ExamService**: exam and result business logic
