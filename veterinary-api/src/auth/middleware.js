const { decrypt } = require("./encryption");
const { User } = require("../models");
const { Doctor } = require("../models");
const { getDB } = require("../utils/database");
const { ObjectId } = require("mongodb");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: "Authentication required" }));
  }

  try {
    const decoded = decrypt(token);
    const [userId, role, timestamp] = decoded.split(":");

    if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Token expired" }));
    }

    // Initialize database models
    const db = getDB();
    const userModel = new User(db);
    const doctorModel = new Doctor(db);

    // Verify user exists and role matches database
    let user;
    try {
      if (role === "doctor") {
        // Usar findOne con el ObjectId
        user = await doctorModel.findOne({ _id: new ObjectId(userId) });
      } else {
        // Para usuarios regulares y admin
        user = await userModel.findById(userId);
      }
    } catch (error) {
      console.error("Database lookup error:", error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }

    // Si no se encuentra el usuario o el rol no coincide
    if (!user) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    if (user.role !== role) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: "Invalid role" }));
    }

    req.user = {
      id: userId,
      role,
      verified: true,
      email: user.email,
      nombre: user.nombre,
    };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.statusCode = 403;
    res.end(JSON.stringify({ error: "Invalid token" }));
  }
}

function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (
      !req.user ||
      !req.user.verified ||
      !allowedRoles.includes(req.user.role)
    ) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: "Access denied" }));
    }
    return next();
  };
}

function logout(req, res, next) {
  if (!res.headersSent) {
    res.setHeader(
      "Set-Cookie",
      "token=; HttpOnly; Secure; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
  }
  res.statusCode = 200;
  return next();
}

module.exports = {
  authenticateToken,
  checkRole,
  logout,
};
