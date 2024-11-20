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
    req.query = Object.fromEntries(url.searchParams);  
    let matchedRoute = null;
    let params = {};

    // Buscar coincidencia de ruta, incluyendo rutas dinámicas
    Object.entries(routes).forEach(([routePath, handlers]) => {
      const routeParts = routePath.split("/");
      const urlParts = url.pathname.split("/");

      if (routeParts.length === urlParts.length) {
        let isMatch = true;
        const urlParams = {};

        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(":")) {
            // Es un parámetro
            const paramName = routeParts[i].slice(1);
            urlParams[paramName] = urlParts[i];
          } else if (routeParts[i] !== urlParts[i]) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          matchedRoute = handlers;
          params = urlParams;
        }
      }
    });

    if (!matchedRoute || !matchedRoute[req.method]) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "Not found" }));
    }

    // Agregar parámetros a req
    req.params = params;

    const handlers = Array.isArray(matchedRoute[req.method])
      ? matchedRoute[req.method]
      : [matchedRoute[req.method]];

    // Ejecutar handlers en secuencia
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      await new Promise((resolve) => {
        handler(req, res, resolve);
      });

      if (res.writableEnded) {
        break;
      }
    }
  } catch (error) {
    console.error("Request error:", error);
    if (!res.writableEnded) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
}

module.exports = { handleRequest };
