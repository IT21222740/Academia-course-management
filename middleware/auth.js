const jwt = require("jsonwebtoken");
const { JWT_SECRET, allowedUrls } = require("../util/config");

const authenticate = (req, _res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    if (!token) {
      const error = new Error("Authentication failed.");
      error.status = 400;
      throw error;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        const error = new Error("Authentication failed.");
        error.status = 400;
        throw error;
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const checkAllowed = (req, _res, next) => {
  try {
    const userRole = req.user.role;
    const currentUrl = req.route.path;
    const currentMethod = req.method;

    const allowed =
      allowedUrls[userRole]?.find(
        (permission) =>
          permission.url === currentUrl &&
          permission.methods.includes(currentMethod)
      );

    if (allowed) {
      next();
    } else {
      const error = new Error(`Access denied for ${userRole}.`);
      error.status = 403;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.authenticate = authenticate;
exports.checkAllowed = checkAllowed;
