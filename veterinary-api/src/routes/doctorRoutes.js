const { authenticateToken, checkRole } = require("../auth/middleware");
const doctorController = require("../controllers/doctorController");

const doctorRoutes = {
  "/doctor/animals": {
    GET: [
      authenticateToken,
      checkRole(["doctor"]),
      doctorController.searchAnimals,
    ],
  },
  "/doctor/animals/:id/diagnosis": {
    PUT: [
      authenticateToken,
      checkRole(["doctor"]),
      doctorController.updateDiagnosis,
    ],
  },
};

module.exports = doctorRoutes;
