require("dotenv").config();
const { expressjwt: jwt } = require("express-jwt");
const _ = require("lodash");
const httpStatus = require("http-status");
const aclConfig = require("../../acl.json");
const APIError = require("../helpers/APIError.helper");
const userAccess = require("../users/services/userAccess.service");

const configuration = require("../../config/config");
const decrypter = require("../helpers/decrypter.helper");
const accessCtrl = require("accessctrl");

// Example of ROLE array : ['USER','ADMIN', 'MANAGER', 'ROOT']
const roles = JSON.parse(process.env.ROLE);

const config = {};
const unSecureRoots = [];
if (!process.env.JWT_SECRET) {
  throw new Error("Environment variable not found : JWT_SECRET");
}
if (!aclConfig) {
  throw new Error("acl configuration json file not found : acl.json");
}
const roleManager = {
  getMaxRole() {
    return roles[roles.length - 1];
  },

  hasRole(role, checkRole) {
    return roles.indexOf(role) >= roles.indexOf(checkRole);
  },

  isRoot(role) {
    return roles.indexOf(role) === roles.length - 1;
  },

  isUser(role) {
    return roles.indexOf(role) === 0;
  },
  getRoles() {
    return roles;
  },
  // if role is valid, normalize. Otherwise throw error
  isValid(role) {
    if (roles.indexOf(role) > -1) {
      return role;
    }
    throw new Error("Invalid Role");
  },
};

const permission = (allowed) => {
  const isAllowed = (req) => {
    if (roleManager.isUser(req.user.role) && config.userValidator) {
      return config.userValidator(req);
    }
    return roleManager.hasRole(req.user.role, allowed);
  };

  return (req, res, next) => {
    if (req.user && isAllowed(req)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
const security = jwt({
  algorithms: ["HS256"],
  secret: (req, payload) => {
    return new Promise((resolve, reject) => {
      try {
        const value = decrypter.decrypt(configuration.extras.jwt_secret);

        return resolve(value);
      } catch (e) {
        return reject(e);
      }
    });
  },
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const parsedData = parseJwt(token);
      parsedData.role = JSON.parse(parsedData.role);
      req.user = parsedData;
      return token;
    }
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
}).unless({ path: unSecureRoots });

const addUnsecureRoute = (endPoint, methods, regex) => {
  const unsecureMethods = Array.isArray(methods) ? methods : [methods];
  unSecureRoots.push({ url: endPoint, methods: unsecureMethods, regex });
};

const findPath = (unsecured, find) => {
  return _.findIndex(unsecured, (o) => {
    if (o.regex) {
      return find.match(o.url);
    }
    return find === o.url;
  });
};

const accessRights = () => {
  return async (req, res, next) => {
    const { path, method, user } = req;
    if (!req.user) {
      const index = findPath(unSecureRoots, path);
      if (index >= 0) {
        return next();
      }
      return next(
        new APIError(
          "Forbidden to access this resource",
          httpStatus.FORBIDDEN,
          true,
          "UnauthorizedError"
        )
      );
    }
    const status = accessCtrl.verifyPermission(user.role, path, method);

    if (!status) {
      return next(
        new APIError(
          "Forbidden to access this resource",
          httpStatus.FORBIDDEN,
          true,
          "UnauthorizedError"
        )
      );
    }
    return next();
  };
};

module.exports = {
  roleManager,
  permission,
  security,
  accessRights,
  addUnsecureRoute,
};

// removed options from module.exports
