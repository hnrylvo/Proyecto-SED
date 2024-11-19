// models/Doctor.js
class Doctor {
  constructor(db) {
      this.collection = db.collection('doctors');
  }

  async findOne(query) {
      return await this.collection.findOne(query);
  }
}

module.exports = Doctor;