const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const doctorRoutes = require("./doctorRoutes");
const userRoutes = require("./userRoutes");

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// routes/index.js
async function handleRequest(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "POST" || req.method === "PUT") {
      req.body = await parseBody(req);
    }

    const routes = {
      ...adminRoutes,
      ...authRoutes,
      ...doctorRoutes,
      ...userRoutes,
    };

    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = routes[url.pathname];

    if (!route || !route[req.method]) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "Not found" }));
    }

    const handlers = Array.isArray(route[req.method])
      ? route[req.method]
      : [route[req.method]];

    // Middleware chain handler
    let currentHandlerIndex = 0;

    const executeNextHandler = async () => {
      if (currentHandlerIndex >= handlers.length) return;

      const handler = handlers[currentHandlerIndex];
      currentHandlerIndex++;

      await handler(req, res, executeNextHandler);
    };

    await executeNextHandler();
  } catch (error) {
    console.error("Request error:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
}
module.exports = { handleRequest };
