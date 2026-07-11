import { User } from '../models/User.js';
import { StorageService } from './StorageService.js';

/** Handles registration, login and session management. */
export class AuthService {
  constructor() {
    this.storage = new StorageService('exam_users');
    this.seedDemoUsers();
  }

  seedDemoUsers() {
    const users = this.storage.getAll();
    if (users.length) return;

    const teacher = new User({
      name: 'Demo Teacher',
      idNumber: '123456789',
      email: 'teacher@demo.com',
      password: '1234',
      role: 'teacher',
    });

    const student = new User({
      name: 'Demo Student',
      idNumber: '987654321',
      email: 'student@demo.com',
      password: '1234',
      role: 'student',
    });

    this.storage.saveAll([teacher.toJSON(), student.toJSON()]);
  }

  register({ name, idNumber, email, password, role }) {
    const users = this.storage.getAll();
    const exists = users.some((user) => user.email === email || user.idNumber === idNumber);
    if (exists) {
      throw new Error('User with this email or ID already exists');
    }

    const user = new User({ name, idNumber, email, password, role });
    this.storage.add(user.toJSON());
    return user;
  }

  login(email, password) {
    const userData = this.storage.getAll().find(
      (user) => user.email === email && user.password === password,
    );

    if (!userData) {
      throw new Error('Invalid email or password');
    }

    const user = User.fromJSON(userData);
    localStorage.setItem('currentUser', JSON.stringify(user.toJSON()));
    return user;
  }

  getCurrentUser() {
    const raw = localStorage.getItem('currentUser');
    return raw ? User.fromJSON(JSON.parse(raw)) : null;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
