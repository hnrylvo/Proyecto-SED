const { Animal } = require("../models");

async function searchAnimals(req, res) {
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
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateDiagnosis(req, res) {
  const { animalId } = req.params;
  const { diagnosis } = req.body;

  try {
    const animalModel = new Animal(getDB());
    await animalModel.updateDiagnosis(animalId, diagnosis);
    res.json({ message: "Diagnosis updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
