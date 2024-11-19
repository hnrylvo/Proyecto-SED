const { Animal } = require("../models");
const { getDB } = require("../utils/database");

const userController = {
  addAnimal: async (req, res, next) => {
    const { name, species, age, weigth, breed, medicalNotes } = req.body;
    const ownerId = req.user.id;

    console.log("Campos recibidos:", {
      name,
      species,
      age,
      weigth,
      breed,
      medicalNotes,
      ownerId,
    });

    try {
      const animalModel = new Animal(getDB());
      const animal = await animalModel.create({
        name,
        species,
        age,
        weigth,
        breed,
        medicalNotes,
        ownerId,
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
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

module.exports = userController;
