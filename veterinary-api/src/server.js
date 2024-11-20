const http = require("http");
const { handleRequest } = require("./routes");
const { connectDB } = require("./utils/database");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization" // Añadir Authorization
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Logging with morgan
  morgan("dev")(req, res, () => {
    handleRequest(req, res);
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
