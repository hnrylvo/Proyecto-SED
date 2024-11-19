const { Doctor } = require('../models');
const { encrypt } = require('../auth/encryption');

async function createDoctor(req, res) {
    const { name, specialization, email, password } = req.body;

    try {
        const doctorModel = new Doctor(getDB());
        
        // Create doctor with auth credentials
        const doctor = await doctorModel.create({
            name,
            specialization,
            email,
            password: encrypt(password),
            role: 'doctor'
        });

        res.status(201).json({
            message: 'Doctor created successfully',
            doctorId: doctor.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}