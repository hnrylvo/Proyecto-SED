// models/Animal.js
class Animal {
    constructor(db) {
        this.collection = db.collection('animals');
    }

    async create(animalData) {
        return await this.collection.insertOne(animalData);
    }
}

module.exports = Animal;