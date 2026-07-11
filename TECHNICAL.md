# מסמך טכני – מערכת מבחנים

## GitHub + Deploy
| | כתובת |
|---|--------|
| קוד מקור | https://github.com/Mohammad-Safadi/exam-system-client |
| אתר חי | https://mohammad-safadi.github.io/exam-system-client/ |

## דפים וניווט

```
index.html ──► login.html / register.html
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
 teacher/index.html    student/index.html
         │                     │
         ├── create-exam.html  ├── search.html
         └── exam.html         └── take-exam.html

logout.html ──► index.html (מכל דף דרך navbar)
```

| דף | נתיב | גישה |
|----|------|------|
| דף ראשי | `/index.html` | ציבורי |
| הרשמה | `/register.html` | ציבורי |
| התחברות | `/login.html` | ציבורי |
| התנתקות | `/logout.html` | מחוברים |
| אזור מורה | `/teacher/index.html` | מורה |
| יצירת מבחן | `/teacher/create-exam.html` | מורה |
| פרטי מבחן | `/teacher/exam.html?id=...` | מורה (בעלים בלבד) |
| אזור סטודנט | `/student/index.html` | סטודנט |
| חיפוש | `/student/search.html` | סטודנט |
| ביצוע מבחן | `/student/take-exam.html?id=...` | סטודנט |

## פורמט JSON ב-localStorage

### משתמשים – `exam_users`
```json
[{
  "id": "user_...",
  "name": "Demo Teacher",
  "idNumber": "123456789",
  "email": "teacher@demo.com",
  "password": "1234",
  "role": "teacher",
  "createdAt": "2026-07-11T12:00:00.000Z"
}]
```

### מבחנים – `exam_exams`
```json
[{
  "id": "exam_...",
  "name": "JavaScript Basics",
  "description": "מבחן דemo",
  "category": "Web",
  "code": "A1B2C3",
  "durationMinutes": 30,
  "teacherId": "user_...",
  "questions": [{
    "id": "question_...",
    "text": "מה זה JSON?",
    "options": ["פורמט", "שפה", "DB", "Framework"],
    "correctIndex": 0
  }],
  "createdAt": "...",
  "updatedAt": "..."
}]
```

### תוצאות – `exam_results`
```json
[{
  "id": "result_...",
  "examId": "exam_...",
  "studentId": "user_...",
  "answers": [0, 2, 1],
  "score": 67,
  "submittedAt": "..."
}]
```

### Session – `currentUser`
אובייקט User של המשתמש המחובר.

## UML – מחלקות עיקריות

```mermaid
classDiagram
    class User {
      +String id
      +String name
      +String idNumber
      +String email
      +String password
      +String role
      +toJSON()
      +fromJSON()
    }

    class Question {
      +String id
      +String text
      +Array options
      +Number correctIndex
    }

    class Exam {
      +String id
      +String name
      +String code
      +String teacherId
      +Question[] questions
      +addQuestion()
      +updateQuestion()
      +removeQuestion()
    }

    class ExamResult {
      +String id
      +String examId
      +String studentId
      +Array answers
      +Number score
    }

    class StorageService {
      +getAll()
      +saveAll()
      +add()
      +update()
      +remove()
    }

    class AuthService {
      -StorageService storage
      +register()
      +login()
      +getCurrentUser()
    }

    class ExamService {
      -StorageService examStorage
      -StorageService resultStorage
      +createExam()
      +updateExam()
      +deleteExam()
      +searchExams()
      +submitExam()
    }

    Exam *-- Question
    AuthService --> StorageService
    AuthService --> User
    ExamService --> StorageService
    ExamService --> Exam
    ExamService --> ExamResult
```

## Flows מרכזיים

### Flow 1 – הרשמה והתחברות
```mermaid
sequenceDiagram
    participant Page as register/login.html
    participant Auth as AuthService
    participant LS as localStorage

    Page->>Auth: register(userData)
    Auth->>LS: exam_users.push(User.toJSON())
    Page->>Auth: login(email, password)
    Auth->>LS: currentUser = User.toJSON()
    Page->>Page: redirect by role
```

### Flow 2 – מורה יוצר מבחן
```mermaid
sequenceDiagram
    participant T as teacher/create-exam.js
    participant ES as ExamService
    participant LS as localStorage

    T->>ES: createExam({name, teacherId, ...})
    ES->>LS: exam_exams.push(Exam.toJSON())
    T->>T: redirect to exam.html?id=
```

### Flow 3 – סטודנט מבצע מבחן
```mermaid
sequenceDiagram
    participant S as takeExam.js
    participant ES as ExamService
    participant LS as localStorage

    S->>ES: getExamById(id)
    S->>S: collect answers + timer
    S->>ES: submitExam(examId, studentId, answers)
    ES->>ES: calculateScore()
    ES->>LS: exam_results.push(ExamResult.toJSON())
    S->>S: show score + correct answers
```

## אחריות מחלקות

| מחלקה | אחריות |
|--------|---------|
| `User` | ישות משתמש (מורה/סטודנט) |
| `Question` | שאלה אמריקאית עם אפשרויות |
| `Exam` | מבחן + אוסף שאלות |
| `ExamResult` | ניסיון הגשה של סטודנט |
| `StorageService` | עטיפה ל-localStorage |
| `AuthService` | אימות והרשאות |
| `ExamService` | לוגיקת מבחנים וציונים |
