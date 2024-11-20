class Animal {
  constructor(db) {
    this.collection = db.collection("animals");
  }

  async create(animalData) {
    try {
      const result = await this.collection.insertOne(animalData);
      return result;
    } catch (error) {
      console.error("Error creating animal:", error);
      throw error;
    }
  }

  async findById(id) {
    return await this.collection.findOne({ _id: id });
  }

  async findByOwner(ownerId) {
    return await this.collection.find({ ownerId }).toArray();
}

  async updateById(id, data) {
    return await this.collection.updateOne({ _id: id }, { $set: data });
  }

  async deleteById(id) {
    return await this.collection.deleteOne({ _id: id });
  }
}

module.exports = Animal;
