const { Animal } = require("../models");
const { getDB } = require("../utils/database");

const doctorController = {
  getAllAnimals: async (req, res) => {
    try {
      const animalModel = new Animal(getDB());
      const animals = await animalModel.collection.find({}).toArray();
      res.statusCode = 200;
      res.end(JSON.stringify(animals));
    } catch (error) {
      console.error("Error getting all animals:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  searchAnimals: async (req, res) => {
    const query = req.query.query || "";
    try {
      const animalModel = new Animal(getDB());
      const animals = await animalModel.collection
        .find({
          $or: [
            { name: new RegExp(query, "i") },
            { species: new RegExp(query, "i") },
          ],
        })
        .toArray();
      res.statusCode = 200;
      res.end(JSON.stringify(animals));
    } catch (error) {
      console.error("Error searching animals:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  updateDiagnosis: async (req, res) => {
    try {
      const { id } = req.params; // Changed from animalId to id
      const { medicalNotes } = req.body;

      console.log("Updating diagnosis for animal:", id);
      console.log("New diagnosis:", medicalNotes);

      const animalModel = new Animal(getDB());
      const { ObjectId } = require("mongodb");

      const result = await animalModel.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { medicalNotes: medicalNotes } }
      );

      if (result.matchedCount === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: "Animal not found" }));
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Diagnosis updated successfully" }));
    } catch (error) {
      console.error("Error updating diagnosis:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

module.exports = doctorController;
