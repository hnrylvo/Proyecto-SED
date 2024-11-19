const http = require("http");
const { handleRequest } = require("./routes");
const { connectDB } = require("./utils/database");
const morgan = require('morgan');
const cors = require('cors'); // Requiere el paquete cors

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  cors()(req, res, () => {
    // Usar morgan como middleware para registrar las solicitudes
    morgan('dev')(req, res, () => {
      handleRequest(req, res);
    });
  });
});

async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();