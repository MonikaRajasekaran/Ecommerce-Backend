require("dotenv").config();
const _ = require("lodash");
const httpStatus = require("http-status");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const accessCtrl = require("accessctrl");
const aclConfig = require("../../acl.json");
const APIError = require("../helpers/APIError.helper");
const ErrHandler = require("../exceptions/errHandler");
const ThrowHandler = require("../exceptions/throwHandler");
const Exceptions = require("../exceptions/exception");

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_APP_CLIENT_ID,
});

const unSecuredRoutes = [];
if (!aclConfig) {
  throw new Error("acl configuration json file not found : acl.json");
}

const addUnsecureRoute = (endPoint, methods, regex) => {
  const unsecureMethods = Array.isArray(methods) ? methods : [methods];
  unSecuredRoutes.push({ url: endPoint, methods: unsecureMethods, regex });
};

const findPath = (unsecured, find) => {
  return _.findIndex(unsecured, (o) => {
    if (o.regex) {
      return find.match(o.url);
    }
    return find === o.url;
  });
};

const checkUnsecured = (req, unSecured) => {
  const { path, method } = req;
  const index = findPath(unSecured, path);
  if (index >= 0) {
    if (unSecured[index].methods.indexOf(method) === -1) {
      return true;
    }
    return false;
  }
  return true;
};

const security = (req, res, next) => {
  const status = checkUnsecured(req, unSecuredRoutes);
  if (!status) {
    return next();
  }
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
    return verifier
      .verify(
        token // the JWT as string
      )
      .then((response) => {
        req.user = response;
        console.log("Token is valid. Payload:", response);
        return next();
      })
      .catch((e) => {
        return next(
          new ErrHandler({
            exceptions: Exceptions.UNAUTHORIZED,
            message: e.message,
          })
        );
      });
  }
  return next(new ErrHandler({ exceptions: Exceptions.UNAUTHORIZED }));
};

const accessRights = () => {
  return async (req, res, next) => {
    const { path, method, user } = req;
    if (!req.user) {
      const index = findPath(unSecuredRoutes, path);
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
    const status = accessCtrl.verifyPermission(user["cognito:groups"], path, method);

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
  security,
  accessRights,
  addUnsecureRoute,
};
