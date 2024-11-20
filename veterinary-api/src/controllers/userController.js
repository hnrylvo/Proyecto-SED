const { Animal } = require("../models");
const { getDB } = require("../utils/database");

const userController = {
  addAnimal: async (req, res, next) => {
    const { name, species, age, weight, breed, medicalNotes } = req.body;
    const ownerId = req.user.id;

    try {
      const animalModel = new Animal(getDB());
      const animal = await animalModel.create({
        name,
        species,
        age,
        weight,
        breed,
        medicalNotes,
        ownerId,
        createdAt: new Date(),
      });

      res.statusCode = 201;
      return res.end(
        JSON.stringify({
          message: "Animal added successfully",
        })
      );
    } catch (error) {
      console.error("Error adding animal:", error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
  getMyAnimals: async (req, res) => {
    try {
      const animalModel = new Animal(getDB());
      const ownerId = req.user.id; // ID del usuario autenticado

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
