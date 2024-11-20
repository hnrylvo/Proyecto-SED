const { authenticateToken, checkRole } = require("../auth/middleware");
const adminController = require("../controllers/adminController");

const adminRoutes = {
  "/admin/doctors": {
    POST: [
      authenticateToken,
      checkRole(["admin"]),
      adminController.createDoctor,
    ],
    GET: [
      authenticateToken,
      checkRole(["admin"]),
      adminController.getAllDoctors,
    ],
  },
  "/admin/doctors/:id": {
    // Nueva ruta para operaciones con ID
    DELETE: [
      authenticateToken,
      checkRole(["admin"]),
      adminController.deleteDoctor,
    ],
  },
};

module.exports = adminRoutes;
