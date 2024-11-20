const { authenticateToken, checkRole } = require("../auth/middleware");
const userController = require("../controllers/userController");

const userRoutes = {
  "/user/animals": {
    POST: [authenticateToken, checkRole(["user"]), userController.addAnimal],
    GET: [authenticateToken, checkRole(["user"]), userController.getMyAnimals],
  },
};

module.exports = userRoutes;
