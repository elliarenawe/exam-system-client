/** Wrapper around localStorage with JSON serialization. */
export class StorageService {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  getAll() {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  saveAll(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  add(item) {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  update(id, updatedItem) {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = updatedItem;
    this.saveAll(items);
    return updatedItem;
  }

  remove(id) {
    const items = this.getAll().filter((item) => item.id !== id);
    this.saveAll(items);
  }

  findById(id) {
    return this.getAll().find((item) => item.id === id) || null;
  }
}
