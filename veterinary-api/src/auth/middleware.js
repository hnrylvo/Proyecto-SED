const { decrypt } = require("./encryption");

function authenticateToken(req, res, next) {
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

    req.user = { id: userId, role };
    next();
  } catch (error) {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: "Invalid token" }));
  }
}

function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ error: "Access denied" }));
    }
    return next(); // Agregar return
  };
}

function logout(req, res, next) {
  // Agregar next
  if (!res.headersSent) {
    res.setHeader(
      "Set-Cookie",
      "token=; HttpOnly; Secure; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );
  }
  res.statusCode = 200;
  return next(); // Agregar return y next
}

async function handleRequest(req, res, routeHandlers) {
  if (Array.isArray(routeHandlers)) {
    let index = 0;
    const next = async () => {
      if (index < routeHandlers.length) {
        await routeHandlers[index++](req, res, next);
      }
    };
    await next();
  } else if (typeof routeHandlers === "function") {
    await routeHandlers(req, res);
  }
}

module.exports = {
  handleRequest,
  authenticateToken,
  checkRole,
  logout,
};
