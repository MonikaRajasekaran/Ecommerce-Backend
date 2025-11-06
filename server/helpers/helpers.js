const _ = require("lodash");
const axios = require("axios");
const CONSTANTS = require("./Constants");

class utils {
  static async awaitWrap(func) {
    return func
      .then((data) => ({ error: null, data }))
      .catch((e) => ({ error: e, data: null }));
  }

  static async fetchBase64(url) {
    const image = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const raw = Buffer.from(image.data).toString("base64");
    const base64Image = `data:${image.headers["content-type"]};base64,${raw}`;
    return base64Image;
  }

  static async awaitMultiWrap(func) {
    return Promise.all(func)
      .then((data) => ({ error: null, data }))
      .catch((e) => ({ error: e, data: null }));
  }

  static formatResponse(response, key) {
    const result = {};
    result[key] = response;
    return result;
  }

  static omitFields(response, keys) {
    return _.omit(response, keys);
  }

  static async pager(limit = 50, skip = 0, page, countFunction) {
    let totalPages = 0;
    let currentPage;
    let itemCount;
    let newLimit;
    let newSkip;
    if (skip && limit) {
      newSkip = parseInt(skip, 10);
      newLimit = parseInt(limit, 10);
    } else if (page) {
      currentPage = parseInt(page, 10);
      newSkip = (currentPage - 1) * limit;
      newLimit = currentPage * limit;
      itemCount = await countFunction;
      totalPages = Math.floor(itemCount / limit);
      const remPages = itemCount % limit;
      totalPages += remPages > 0 ? 1 : 0;
    }
    return {
      totalPages,
      currentPage,
      itemCount,
      skipTo: newSkip,
      limitUntil: newLimit,
    };
  }

  static randomness() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    let yearRandomed = 0;
    let monthRandomed = 0;
    yearRandomed = Math.floor(Math.random() * 6) + year;
    monthRandomed = Math.floor(Math.random() * 12 + 1);
    if (yearRandomed === year) {
      const monthsToEnd = 12 - month;
      monthRandomed = Math.floor(Math.random() * monthsToEnd + 1) + month;
    }
    if (yearRandomed === year + CONSTANTS.VISA_CARD.EXPIRY) {
      monthRandomed = Math.floor(Math.random() * (month - 1) + 1);
    }
    return { monthRandomed, yearRandomed };
  }

  static shuffleArray(list) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
}

module.exports = utils;
