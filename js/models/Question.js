import { generateId } from '../utils/helpers.js';

/** Multiple-choice question for an exam. */
export class Question {
  constructor({ id, text, options = [], correctIndex = 0 }) {
    this.id = id || generateId('question');
    this.text = text;
    this.options = options;
    this.correctIndex = Number(correctIndex);
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      options: this.options,
      correctIndex: this.correctIndex,
    };
  }

  static fromJSON(data) {
    return new Question(data);
  }
}
