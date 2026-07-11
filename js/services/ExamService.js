import { Exam } from '../models/Exam.js';
import { ExamResult } from '../models/ExamResult.js';
import { StorageService } from './StorageService.js';
import { calculateScore } from '../utils/helpers.js';

/** CRUD operations for exams and student results. */
export class ExamService {
  constructor() {
    this.examStorage = new StorageService('exam_exams');
    this.resultStorage = new StorageService('exam_results');
    this.seedDemoExam();
  }

  seedDemoExam() {
    if (this.examStorage.getAll().length) return;

    const users = new StorageService('exam_users').getAll();
    const teacher = users.find((user) => user.role === 'teacher');
    if (!teacher) return;

    this.createExam({
      name: 'JavaScript Basics',
      description: 'Demo exam for testing the system',
      category: 'Web Dev',
      durationMinutes: 15,
      teacherId: teacher.id,
      questions: [
        {
          text: 'What does JSON stand for?',
          options: ['JavaScript Object Notation', 'Java Source Object', 'Joint System Object', 'Java Standard Output'],
          correctIndex: 0,
          difficulty: 'easy',
        },
        {
          text: 'Where is app data stored in this project?',
          options: ['MySQL', 'MongoDB', 'localStorage', 'Cookies only'],
          correctIndex: 2,
          difficulty: 'medium',
        },
      ],
    });
  }

  getAllExams() {
    return this.examStorage.getAll().map((data) => Exam.fromJSON(data));
  }

  getExamsByTeacher(teacherId) {
    return this.getAllExams().filter((exam) => exam.teacherId === teacherId);
  }

  getExamById(examId) {
    const data = this.examStorage.findById(examId);
    return data ? Exam.fromJSON(data) : null;
  }

  createExam(examData) {
    const exam = new Exam(examData);
    this.examStorage.add(exam.toJSON());
    return exam;
  }

  updateExam(examId, examData) {
    const existing = this.getExamById(examId);
    if (!existing) return null;

    const updated = new Exam({ ...existing.toJSON(), ...examData, id: examId });
    updated.createdAt = existing.createdAt;
    updated.updatedAt = new Date().toISOString();
    this.examStorage.update(examId, updated.toJSON());
    return updated;
  }

  deleteExam(examId) {
    this.examStorage.remove(examId);
    const results = this.resultStorage.getAll().filter((result) => result.examId !== examId);
    this.resultStorage.saveAll(results);
  }

  searchExams(query) {
    const normalized = query.trim().toLowerCase();
    const codeQuery = query.trim().toUpperCase();
    return this.getAllExams().filter(
      (exam) =>
        exam.name.toLowerCase().includes(normalized) ||
        exam.code.toUpperCase() === codeQuery,
    );
  }

  getCategories() {
    const categories = new Set(this.getAllExams().map((exam) => exam.category).filter(Boolean));
    return [...categories].sort((a, b) => a.localeCompare(b, 'he'));
  }

  /** Filter exams by text, category, and question difficulty. */
  filterExams({ query = '', category = '', difficulty = '' } = {}) {
    let exams = query.trim() ? this.searchExams(query) : this.getAllExams();

    if (category) {
      exams = exams.filter((exam) => exam.category === category);
    }

    if (difficulty) {
      exams = exams.filter((exam) => exam.questions.some((question) => question.difficulty === difficulty));
    }

    return exams;
  }

  submitExam(examId, studentId, answers) {
    const exam = this.getExamById(examId);
    if (!exam) throw new Error('Exam not found');

    const score = calculateScore(exam, answers);
    const result = new ExamResult({ examId, studentId, answers, score });
    this.resultStorage.add(result.toJSON());
    return result;
  }

  getResultsByExam(examId) {
    return this.resultStorage.getAll().filter((result) => result.examId === examId);
  }

  getResultsByStudent(studentId) {
    return this.resultStorage.getAll().filter((result) => result.studentId === studentId);
  }

  getStudentAverage(studentId) {
    const results = this.getResultsByStudent(studentId);
    if (!results.length) return 0;
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(total / results.length);
  }
}
