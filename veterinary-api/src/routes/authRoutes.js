const { getDB } = require("../utils/database");
const { encrypt } = require("../auth/encryption");
const { User, Doctor } = require("../models");
const {
  authenticateToken,
  logout,
  handleRequest,
} = require("../auth/middleware");

const authRoutes = {
  "/auth/register": {
    POST: async (req, res) => {
      const { email, password, name } = req.body;

      try {
        const userModel = new User(getDB());
        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {
          res.statusCode = 400; // Establece el código de estado manualmente
          return res.end(JSON.stringify({ error: "Email already exists" }));
        }

        const encryptedPassword = encrypt(password);
        const user = await userModel.create({
          email,
          password: encryptedPassword,
          name,
          role: "user",
        });

        res.statusCode = 201; // Establece el código de estado manualmente
        res.end(
          JSON.stringify({
            message: "User created successfully",
            userId: user.insertedId,
          })
        );
      } catch (error) {
        res.statusCode = 500; // Establece el código de estado manualmente
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    },
  },
  "/auth/login": {
    POST: async (req, res) => {
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

        // Set cookie
        res.setHeader(
          "Set-Cookie",
          `token=${token}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax`
        );

        // Enviar token y role en el response body
        res.end(
          JSON.stringify({
            token: token,
            role: account.role,
          })
        );
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    },
  },
  "/auth/logout": {
    POST: async (req, res) => {
      // Procesa los middlewares manualmente
      await handleRequest(req, res, [logout]);

      // Si aún no se ha enviado la respuesta, envía un mensaje de éxito
      if (!res.writableEnded) {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Logged out successfully" }));
      }
    },
  },
};

module.exports = authRoutes;
