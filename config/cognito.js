const cognito = require('awscognito-js');
const config = require('../config/config');
const decrypter = require('../server/helpers/decrypter.helper');

module.exports = () => async (req, res, next) => {
  try {
    const cognitoConfig = {
      clientId: await decrypter.decrypt(config.extras.aws.clientId),
      userPoolId: await decrypter.decrypt(config.extras.aws.userPoolId),
      region: config.extras.aws.aws_region,
      accessKeyId: await decrypter.decrypt(config.extras.aws.accessKeyId),
      accessSecretKey: await decrypter.decrypt(config.extras.aws.accessSecretKey),
    };

    cognito.configure(cognitoConfig);
    req.cognito = cognito;
  } catch (error) {
    console.error('Cognito initialization failed:', error.message);
    req.cognito = null;
  }
  
  next();
};
