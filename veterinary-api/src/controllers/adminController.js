// adminController.js
const { Doctor } = require('../models');
const { encrypt } = require('../auth/encryption');
const { getDB } = require('../utils/database');

const adminController = {
   createDoctor: async (req, res) => {
       const { name, specialization, email, password } = req.body;

       try {
           const doctorModel = new Doctor(getDB());
           
           const doctor = await doctorModel.create({
               name,
               specialization,
               email,
               password: encrypt(password),
               role: 'doctor'
           });

           res.statusCode = 201;
           res.end(JSON.stringify({
               message: 'Doctor created successfully',
               doctorId: doctor.insertedId
           }));
       } catch (error) {
           res.statusCode = 500;
           res.end(JSON.stringify({ error: 'Internal server error' }));
       }
   },

   getAllDoctors: async (req, res) => {
       try {
           const doctorModel = new Doctor(getDB());
           const doctors = await doctorModel.findAll();

           res.statusCode = 200;
           res.end(JSON.stringify(doctors));
       } catch (error) {
           res.statusCode = 500;
           res.end(JSON.stringify({ error: 'Internal server error' }));
       }
   },

   deleteDoctor: async (req, res) => {
       try {
           const { id } = req.params;
           const doctorModel = new Doctor(getDB());
           
           await doctorModel.delete(id);

           res.statusCode = 200;
           res.end(JSON.stringify({ 
               message: 'Doctor deleted successfully' 
           }));
       } catch (error) {
           res.statusCode = 500;
           res.end(JSON.stringify({ error: 'Internal server error' }));
       }
   }
};

module.exports = adminController;