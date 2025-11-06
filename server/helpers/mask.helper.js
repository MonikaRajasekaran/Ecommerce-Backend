const _ = require("lodash");

module.exports.string = (text, options) => {
  const defaultConfig = {
    percentage: 100,
    startFrom: "MID",
    enum: {
      MID: "MID",
      START: "START",
      END: "END",
    },
  };
  const config = _.extend({}, defaultConfig, options);
  if (config.percentage) {
    const length = text.length;
    if (config.percentage < 100) {
      const perCharacter = 100 / length;
      const limit = Math.floor(config.percentage / perCharacter);
      config.remain = length - limit;
      config.start = 0;
      config.end = length - 1;
      config.mid = Math.floor(config.remain / 2);
      config.numberOfcharacter = limit;
    } else {
      config.start = 0;
      config.end = length - 1;
      config.numberOfcharacter = length;
      config.startFrom = "START";
    }
  }
  let masked;
  const s = "#".repeat(config.numberOfcharacter);
  if (config.startFrom === config.enum.START) {
    masked = text.replace(text.substring(0, config.numberOfcharacter), s);
  } else if (config.startFrom === config.enum.MID) {
    masked = text.replace(
      text.substring(config.mid, config.numberOfcharacter),
      s
    );
  } else if (config.startFrom === config.enum.END) {
    const start = config.end - config.numberOfcharacter;
    masked = text.replace(text.substring(start, config.end), s);
  }
  return masked;
};
