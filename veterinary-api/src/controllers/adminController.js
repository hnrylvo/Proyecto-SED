const { validateDoctorData, sanitizeInput } = require("../utils/validators");
const { Doctor } = require("../models");
const { encrypt } = require("../auth/encryption");
const { getDB } = require("../utils/database");
const { ObjectId } = require("mongodb");

const adminController = {
  createDoctor: async (req, res) => {
    try {
      const sanitizedData = validateDoctorData({
        nombre: req.body.nombre,
        email: req.body.email,
        especialidad: req.body.especialidad,
        telefono: req.body.telefono,
        fechaIngreso: req.body.fechaIngreso,
        matriculaProfesional: req.body.matriculaProfesional,
        password: req.body.password,
      });

      const doctorModel = new Doctor(getDB());

      // Check if email already exists
      const existingDoctor = await doctorModel.findByEmail(sanitizedData.email);
      if (existingDoctor) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Email already exists" }));
      }

      const doctor = await doctorModel.create({
        ...sanitizedData,
        password: encrypt(sanitizedData.password),
        role: "doctor",
      });

      res.statusCode = 201;
      res.end(
        JSON.stringify({
          message: "Doctor created successfully",
          doctorId: doctor.insertedId,
        })
      );
    } catch (error) {
      console.error("Error creating doctor:", error);
      res.statusCode = error.message.includes("Invalid") ? 400 : 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  getAllDoctors: async (req, res) => {
    try {
      const doctorModel = new Doctor(getDB());
      const doctors = await doctorModel.collection
        .find({})
        .project({
          password: 0,
          role: 0,
        })
        .toArray();

      res.statusCode = 200;
      res.end(JSON.stringify(doctors));
    } catch (error) {
      console.error("Error getting doctors:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  deleteDoctor: async (req, res) => {
    try {
      const { id } = req.params;

      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid ID format" }));
      }

      const doctorModel = new Doctor(getDB());
      const result = await doctorModel.delete(new ObjectId(id));

      if (result.deletedCount === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: "Doctor not found" }));
      }

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "Doctor deleted successfully",
        })
      );
    } catch (error) {
      console.error("Error deleting doctor:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

module.exports = adminController;
