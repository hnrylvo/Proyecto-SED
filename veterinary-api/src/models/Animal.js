class Animal {
    constructor(db) {
        this.collection = db.collection('animals');
    }
 
    async findAll() {
        return await this.collection.find({}).toArray();
    }
 }

module.exports = Animal;