const { validateAnimalData, sanitizeInput } = require("../utils/validators");
const { Animal } = require("../models");
const { getDB } = require("../utils/database");

const userController = {
  addAnimal: async (req, res, next) => {
    try {
      // Validate and sanitize input
      const sanitizedData = validateAnimalData({
        name: req.body.name,
        species: req.body.species,
        age: req.body.age,
        weight: req.body.weight,
        breed: req.body.breed,
        medicalNotes: req.body.medicalNotes,
      });

      const animalModel = new Animal(getDB());
      const animal = await animalModel.create({
        ...sanitizedData,
        ownerId: sanitizeInput(req.user.id),
        createdAt: new Date(),
      });

      res.statusCode = 201;
      return res.end(
        JSON.stringify({
          message: "Animal added successfully",
          animalId: animal.insertedId,
        })
      );
    } catch (error) {
      console.error("Error adding animal:", error);
      res.statusCode = error.message.includes("Invalid") ? 400 : 500;
      return res.end(JSON.stringify({ error: error.message }));
    }
  },

  getMyAnimals: async (req, res) => {
    try {
      const animalModel = new Animal(getDB());
      const ownerId = sanitizeInput(req.user.id);

      // Validate MongoDB ObjectId
      if (!/^[0-9a-fA-F]{24}$/.test(ownerId)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid user ID format" }));
      }

      const animals = await animalModel.findByOwner(ownerId);

      res.statusCode = 200;
      res.end(JSON.stringify(animals));
    } catch (error) {
      console.error("Error getting animals:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

module.exports = userController;
