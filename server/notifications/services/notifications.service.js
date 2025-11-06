/* eslint-disable global-require */
const admin = require("firebase-admin");
const config = require("../../../config/config");
// const serviceAccount = require('../../../businessbank-1e082-firebase-adminsdk-cb3u6-f661467f9a.json');
const Constants = require("../../helpers/Constants");

const decrypter = require("../../helpers/decrypter.helper");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
let twilio;
(async () => {
  twilio = require("twilio")(
    decrypter.decrypt(config.extras.twilio_account_ssid),
    decrypter.decrypt(config.extras.twilio_auth_token)
  );
})();

module.exports.sendNotificationsInBulk = async (
  notficationType = Constants.FIREBASE.NOTIFICATION_TYPE.SILENT,
  deviceInfo,
  options
) => {
  return new Promise((resolve, reject) => {
    const message = {
      tokens: deviceInfo.registrationTokens,
    };

    if (notficationType === Constants.FIREBASE.NOTIFICATION_TYPE.NORMAL) {
      message.notification = {
        title: options.title || null,
        body: options.body || null,
      };
    } else {
      message.apns = {
        headers: {
          priority: "5",
          "apns-push-type": "background",
        },
        payload: {
          aps: {
            "content-available": 1,
          },
        },
      };
    }

    if (options.data) {
      message.data = options.data;
    }

    admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        if (response.failureCount > 0) {
          const notRegisteredToken = [];
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              if (
                resp.error &&
                resp.error.code &&
                resp.error.code ===
                  Constants.FIREBASE.SEND_API_ERROR_CODES
                    .REGTOKEN_NOT_REGISTERED
              ) {
                notRegisteredToken.push(deviceInfo.registrationTokens[idx]);
              }
              failedTokens.push(deviceInfo.registrationTokens[idx]);
            }
          });

          response.failedTokens = failedTokens;
          response.notRegisteredToken = notRegisteredToken;
        }

        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

module.exports.sendSms = (to, message) =>
  twilio.messages.create({
    from: Constants.MOBILE_NUMBER,
    to,
    body: message,
  });
