const { Animal } = require("../models");
const { getDB } = require("../utils/database");

const doctorController = {
  getAllAnimals: async (req, res) => {
    try {
      const animalModel = new Animal(getDB());
      const animals = await animalModel.findAll();
      res.statusCode = 200;
      res.end(JSON.stringify(animals));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  searchAnimals: async (req, res) => {
    const { query } = req.query;

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
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  updateDiagnosis: async (req, res) => {
    const { animalId } = req.params;
    const { diagnosis } = req.body;

    try {
      const animalModel = new Animal(getDB());
      await animalModel.updateDiagnosis(animalId, diagnosis);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Diagnosis updated successfully" }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

module.exports = doctorController;
