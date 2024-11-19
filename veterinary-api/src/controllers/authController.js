const { encrypt } = require("../auth/encryption");
const { validateEmail, validatePassword } = require("../utils/validators");
const { User, Doctor } = require("../models");
const { getDB } = require("../utils/database");

const authController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!validateEmail(email) || !validatePassword(password)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Invalid email or password" }));
    }

    try {
      const userModel = new User(getDB());
      const existingUser = await userModel.findByEmail(email);

      if (existingUser) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Email already exists" }));
      }

      const encryptedPassword = encrypt(password);
      const user = await userModel.create({
        email,
        password: encryptedPassword,
        name,
        role: "user",
      });

      res.statusCode = 201;
      res.end(
        JSON.stringify({
          message: "User created successfully",
          userId: user.insertedId,
        })
      );
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const userModel = new User(getDB());
      const doctorModel = new Doctor(getDB());

      const user = await userModel.findByEmail(email);
      const doctor = await doctorModel.findOne({ email });

      const account = user || doctor;

      if (!account || encrypt(password) !== account.password) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: "Invalid credentials" }));
      }

      const token = encrypt(`${account._id}:${account.role}:${Date.now()}`);
      console.log("Token generado:", token);

      // Configurar la cookie correctamente
      res.setHeader(
        "Set-Cookie",
        `token=${token}; Path=/; Max-Age=86400; SameSite=Lax` // Quita HttpOnly para poder leerla
      );

      res.end(
        JSON.stringify({
          role: account.role,
          token: token,
        })
      );
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

module.exports = authController;
