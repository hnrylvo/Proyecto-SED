class Doctor {
  constructor(db) {
      this.collection = db.collection('doctors');
  }

  async create(doctorData) {
      const existingDoctor = await this.collection.findOne({ email: doctorData.email });
      if (existingDoctor) {
          throw new Error('Email already exists');
      }
      return await this.collection.insertOne(doctorData);
  }

  async findAll() {
      return await this.collection.find({}).toArray();
  }

  async findOne(query) {
      return await this.collection.findOne(query);
  }

  async delete(id) {
      const { ObjectId } = require('mongodb');
      return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Doctor;