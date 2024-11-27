class User {
  constructor(id, username, password, createdAt) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt || new Date();
  }

  static fromDatabase(row) {
    return new User(row.id, row.username, row.password, row.createdAt);
  }
}

module.exports = User;
