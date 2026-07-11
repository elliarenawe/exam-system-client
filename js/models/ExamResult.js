import { generateId } from '../utils/helpers.js';

/** Stores a student's submitted exam attempt. */
export class ExamResult {
  constructor({ id, examId, studentId, answers = [], score = 0 }) {
    this.id = id || generateId('result');
    this.examId = examId;
    this.studentId = studentId;
    this.answers = answers;
    this.score = score;
    this.submittedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      examId: this.examId,
      studentId: this.studentId,
      answers: this.answers,
      score: this.score,
      submittedAt: this.submittedAt,
    };
  }

  static fromJSON(data) {
    const result = new ExamResult(data);
    result.submittedAt = data.submittedAt;
    return result;
  }
}
