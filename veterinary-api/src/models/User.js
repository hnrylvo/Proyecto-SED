class User {
  constructor(db) {
      this.collection = db.collection('users');
  }

  async findByEmail(email) {
      return await this.collection.findOne({ email });
  }

  async create(userData) {
      return await this.collection.insertOne(userData);
  }
}

module.exports = User;