const { encrypt } = require("../auth/encryption");
const {
  validateEmail,
  validatePassword,
  sanitizeInput,
} = require("../utils/validators");
const { User, Doctor } = require("../models");
const { getDB } = require("../utils/database");

const authController = {
  register: async (req, res) => {
    try {
      const email = sanitizeInput(req.body.email);
      const password = sanitizeInput(req.body.password);
      const name = sanitizeInput(req.body.name);

      if (!validateEmail(email) || !validatePassword(password)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid email or password" }));
      }

      if (!name || name.length < 2) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid name" }));
      }

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
        createdAt: new Date(),
      });

      res.statusCode = 201;
      res.end(
        JSON.stringify({
          message: "User created successfully",
          userId: user.insertedId,
        })
      );
    } catch (error) {
      console.error("Registration error:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },

  login: async (req, res) => {
    try {
      const email = sanitizeInput(req.body.email);
      const password = sanitizeInput(req.body.password);

      if (!email || !password) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({ error: "Email and password required" })
        );
      }

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

      res.setHeader(
        "Set-Cookie",
        `token=${token}; Path=/; Max-Age=86400; SameSite=Strict`
      );

      res.end(
        JSON.stringify({
          role: account.role,
          token,
        })
      );
    } catch (error) {
      console.error("Login error:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  },
};

module.exports = authController;
