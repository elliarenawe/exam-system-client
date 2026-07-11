import { generateId, generateExamCode } from '../utils/helpers.js';
import { Question } from './Question.js';

/** Exam created by a teacher. */
export class Exam {
  constructor({
    id,
    name,
    description = '',
    category = 'General',
    code,
    durationMinutes = 30,
    teacherId,
    questions = [],
  }) {
    this.id = id || generateId('exam');
    this.name = name;
    this.description = description;
    this.category = category;
    this.code = code || generateExamCode();
    this.durationMinutes = Number(durationMinutes);
    this.teacherId = teacherId;
    this.questions = questions.map((q) => (q instanceof Question ? q : Question.fromJSON(q)));
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
  }

  addQuestion(questionData) {
    this.questions.push(new Question(questionData));
    this.updatedAt = new Date().toISOString();
  }

  updateQuestion(questionId, questionData) {
    const index = this.questions.findIndex((q) => q.id === questionId);
    if (index === -1) return false;
    this.questions[index] = new Question({ ...questionData, id: questionId });
    this.updatedAt = new Date().toISOString();
    return true;
  }

  removeQuestion(questionId) {
    this.questions = this.questions.filter((q) => q.id !== questionId);
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      code: this.code,
      durationMinutes: this.durationMinutes,
      teacherId: this.teacherId,
      questions: this.questions.map((q) => q.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromJSON(data) {
    const exam = new Exam(data);
    exam.createdAt = data.createdAt;
    exam.updatedAt = data.updatedAt;
    return exam;
  }
}
