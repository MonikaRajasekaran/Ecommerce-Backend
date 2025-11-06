const sgMail = require("@sendgrid/mail");
const config = require("../../../config/config");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);
const decrypter = require("../../helpers/decrypter.helper");

(async () => {
  sgMail.setApiKey(decrypter.decrypt(config.extras.sendgrid_api_key));
})();

module.exports.sendEmail = (
  mail,
  templateData,
  templateId,
  useTemplate = true,
  options = { subject: null, html: null }
) =>
  new Promise((resolve, reject) => {
    const msg = {};
    msg.from = config.extras.email.from;

    if (useTemplate) {
      msg.to = mail.receiver;
      msg.cc = mail.cc ? mail.cc : [];
      msg.templateId = templateId;
      msg.dynamic_template_data = templateData;
    } else {
      if (!options.subject && !options.html) {
        reject(new Error("Invalid Parameters"));
      }
      msg.to = mail.receiver;
      msg.subject = options.subject;
      msg.html = templateData.html;
    }
    return sgMail
      .send(msg)
      .then((response) => {
        logger.info(
          `Mail sent successfully to ${
            mail.receiver
          }. Got response: ${JSON.stringify(response[0])}`
        );
        resolve(response);
      })
      .catch((e) => {
        logger.error(
          `Failed to send mail to ${
            mail.receiver
          }. Got response: ${JSON.stringify(e)}`
        );
        reject(e);
      });
  });
