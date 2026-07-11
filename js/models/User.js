import { generateId } from '../utils/helpers.js';

/** Represents a teacher or student account. */
export class User {
  constructor({ id, name, idNumber, email, password, role }) {
    this.id = id || generateId('user');
    this.name = name;
    this.idNumber = idNumber;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      idNumber: this.idNumber,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
    };
  }

  static fromJSON(data) {
    const user = new User(data);
    user.createdAt = data.createdAt;
    return user;
  }
}
