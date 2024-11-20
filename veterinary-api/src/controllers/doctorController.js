const { validateAnimalData, sanitizeInput } = require("../utils/validators");
const { Animal } = require("../models");
const { getDB } = require("../utils/database");
const { ObjectId } = require("mongodb");

const doctorController = {
  getAllAnimals: async (req, res) => {
    try {
      const animalModel = new Animal(getDB());
      const animals = await animalModel.collection
        .find({})
        .project({
          _id: 1,
          name: 1,
          species: 1,
          breed: 1,
          age: 1,
          weight: 1,
          medicalNotes: 1,
        })
        .toArray();

      res.statusCode = 200;
      res.end(JSON.stringify(animals));
    } catch (error) {
      console.error("Error getting all animals:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  searchAnimals: async (req, res) => {
    try {
      const query = sanitizeInput(req.query.query || "");

      const animalModel = new Animal(getDB());
      const animals = await animalModel.collection
        .find({
          $or: [
            { name: new RegExp(escapeRegExp(query), "i") },
            { species: new RegExp(escapeRegExp(query), "i") },
          ],
        })
        .project({
          _id: 1,
          name: 1,
          species: 1,
          breed: 1,
          age: 1,
          weight: 1,
          medicalNotes: 1,
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
      const { id } = req.params;
      const medicalNotes = sanitizeInput(req.body.medicalNotes);

      if (!medicalNotes) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Medical notes are required" }));
      }

      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid ID format" }));
      }

      const animalModel = new Animal(getDB());
      const result = await animalModel.collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            medicalNotes,
            updatedAt: new Date(),
          },
        }
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

// Helper to escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = doctorController;
