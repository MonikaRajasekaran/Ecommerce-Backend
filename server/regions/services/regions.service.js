const mongoose = require("mongoose");
const moment = require("moment-timezone");
const _ = require("lodash");
const database = require("../../helpers/db.helper");
const helpers = require("../../helpers/helpers");
const CONSTANTS = require("../../helpers/Constants");

require("../models/regions.model");

const Region = mongoose.model("Region");

module.exports.createRegion = (data) =>
  new Promise((resolve, reject) => {
    database
      .save(Region, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.addBulk = (data) =>
  new Promise((resolve, reject) => {
    database
      .many(Region, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.getRegionByRegionId = (query) =>
  new Promise((resolve, reject) => {
    database
      .getOneDoc(Region, query, {
        _id: 0,
        __v: 0,
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.updatePayee = (query, payload) =>
  new Promise((resolve, reject) => {
    database
      .updateDoc(Region, query, payload)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.getPayee = (payeeId, regionId) => {
  return new Promise((resolve, reject) => {
    module.exports
      .getRegionByRegionId({ regionId })
      .then((response) => {
        if (!response || !response.regionId) {
          const err = new Error(`No payee configured for this region`);
          return reject(err);
        }

        let payeeResponse = {};
        const payeeList = response.payee;
        payeeList.forEach((payee) => {
          if (payee.payeeId === payeeId) {
            payeeResponse = payee;
          }
        });
        return resolve(payeeResponse);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

module.exports.getDefaultTransactions = (regionId) => {
  return new Promise((resolve, reject) => {
    module.exports
      .getRegionByRegionId({ regionId })
      .then((response) => {
        if (!response || !response.regionId) {
          const err = new Error(`No payee configured for this region`);
          return reject(err);
        }

        const transactions = []; // final result which will be returned.

        const timezone = response.timezone || "Asia/Singapore";

        const timeOneDayBefore = moment().tz(timezone).subtract(1, "d"); // going 1 day before

        const defaultTransactions = response.defaultTransactions || [];
        let offset = 0;
        defaultTransactions.forEach((defaultTransaction) => {
          // Since default transactions are static.
          // We need to set the timestamp for default Transactions as 1 days before today.

          const tempTransactionObj = {
            receiverName: defaultTransaction.merchantName,
            // Subtracting 3 hours on each subsequent transactions.
            timestamp: timeOneDayBefore.subtract(offset, "h").unix(),
            category: defaultTransaction.category,
            amount: defaultTransaction.amount,
            currencyCode:
              defaultTransaction.currency &&
              defaultTransaction.currency.currencyCode,
            currencySymbol:
              defaultTransaction.currency &&
              defaultTransaction.currency.displayAs,
            isDebit: defaultTransaction.isDebit || true,
          };
          offset += 3;
          transactions.push(tempTransactionObj);
        });

        return resolve({ transactions, regionInfo: response });
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

module.exports.updateOfferDetails = (query, payload) => {
  const queryOpt = {
    regionId: query.regionId,
    offers: { $elemMatch: { offerId: payload.offers.offerId } },
  };

  const data = {
    $set: { "offers.$": payload.offers },
  };

  return new Promise((resolve, reject) => {
    database
      .updateDoc(Region, queryOpt, data)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
};

module.exports.addRegistrationToken = (user, body) => {
  return new Promise((resolve, reject) => {
    const persona = (user && user.persona) || [];
    let query;
    let data;
    let opt;
    if (persona.indexOf("EMPLOYER") > -1) {
      query = {
        regionId: user.regionId,
        employerEmployee: { $elemMatch: { employerUserId: user.userId } },
      };

      data = {
        $push: {
          "employerEmployee.$.employerRegistrationTokens":
            body.registrationToken,
        },
      };
    } else if (persona.indexOf("EMPLOYEE") > -1) {
      query = {
        regionId: user.regionId,
        "employerEmployee.employee": {
          $elemMatch: {
            employeeUserId: user.userId,
          },
        },
      };
      data = {
        $push: {
          "employerEmployee.$.employee.$[inner].employeeRegistrationTokens":
            body.registrationToken,
        },
      };
      opt = {
        arrayFilters: [{ "inner.employeeUserId": user.userId }],
      };
    }

    database
      .updateDoc(Region, query, data, opt)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
};

module.exports.checkRegistrationToken = (user, token) => {
  return new Promise((resolve, reject) => {
    module.exports
      .getRegionByRegionId({ regionId: user.regionId })
      .then((response) => {
        const { employerEmployee } = response;
        const persona = (user && user.persona) || [];

        if (persona.indexOf("EMPLOYER") > -1) {
          const employer = _.filter(employerEmployee, {
            employerUserId: user.userId,
          });

          const employerRegistrationTokens = _.get(
            employer,
            [0, "employerRegistrationTokens"],
            []
          );

          if (employerRegistrationTokens.indexOf(token) > -1) {
            return resolve({ hasRegistrationToken: true });
          }
          return resolve({ hasRegistrationToken: false });
        }
        if (persona.indexOf("EMPLOYEE") > -1) {
          const employerObj = _.filter(employerEmployee, {
            employee: [
              {
                employeeUserId: user.userId,
              },
            ],
          })[0];

          const employee = employerObj.employee || [];
          const employeeObj = _.filter(employee, {
            employeeUserId: user.userId,
          })[0];

          const employeeRegistrationTokens =
            employeeObj.employeeRegistrationTokens || [];

          if (employeeRegistrationTokens.indexOf(token) > -1) {
            return resolve({ hasRegistrationToken: true });
          }
          return resolve({ hasRegistrationToken: false });
        }
        const err = new Error(
          `No persona associated with this. Cannot add token`
        );
        err.status = 400;
        return reject(err);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

module.exports.getEmployerDetailsByEmployee = (employee) => {
  return new Promise((resolve, reject) => {
    module.exports
      .getRegionByRegionId({ regionId: employee.regionId })
      .then((regionResponse) => {
        const { employerEmployee } = regionResponse;
        const employerObj = _.filter(employerEmployee, {
          employee: [
            {
              employeeUserId: employee.userId,
            },
          ],
        })[0];

        return resolve(employerObj);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

module.exports.deleteContact = (params) => {
  return new Promise((resolve, reject) => {
    const payload = { $pull: { contacts: { contactId: params.contactId } } };
    database
      .updateDoc(Region, { regionId: params.regionId }, payload)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
};

module.exports.deletePfmData = (params) => {
  return new Promise((resolve, reject) => {
    const payload = {
      $pull: { pfmCategories: { pfmCategoryId: params.pfmCategoryId } },
    };
    database
      .updateDoc(Region, { regionId: params.regionId }, payload)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
};

function getRandomInRange(min, max) {
  /* eslint-disable no-param-reassign */
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCo2Emission(category, amount) {
  return Math.floor(
    (CONSTANTS.S_TRACKER.CO2_EMISSION_RATE[category] ||
      CONSTANTS.S_TRACKER.CO2_EMISSION_RATE.travel) * amount
  );
}

function generateRandomTransactions(merchantObj, category) {
  const transactions = [];
  const amount = merchantObj.amount || {};

  if (Number(amount.max) > Number(merchantObj.spendAmount)) {
    merchantObj.max = amount.spendAmount;
  }

  let totalSpending = 0;

  let co2EmissionCategorySum = 0; // For sum of co2 emission

  // Generate randomly till current limit is reached.

  while (
    totalSpending <=
    Number(merchantObj.spendAmount) - Number(amount.max)
  ) {
    const txnAmt = getRandomInRange(amount.min, amount.max);

    const txnObj = {
      merchantName: merchantObj.name,
      amount: txnAmt,
      co2Emission: generateCo2Emission(category, txnAmt),
    };
    transactions.push(txnObj);
    totalSpending += txnObj.amount;
    // Adding all the transactionns co2emission for this merchant.
    co2EmissionCategorySum += txnObj.co2Emission;
  }
  return { transactions, totalSpending, co2EmissionCategorySum };
}

function addCo2Percentage(payload, totalCo2Emission) {
  payload.forEach((category) => {
    category.co2EmissionPercentage = Math.floor(
      (category.co2EmissionCategorySum / totalCo2Emission) * 100
    );
  });
}

module.exports.generatePFMData = (categories) => {
  const payload = [];
  let totalCo2Emission = 0; // totalCo2Emission = total co2emission accross all categories
  categories.forEach((ele) => {
    const payloadObj = {};
    payloadObj.title = ele.title;
    payloadObj.limit = ele.limit;
    payloadObj.category = ele.category;
    payloadObj.transactions = [];
    payloadObj.remainingFunds = {
      status: ele.status || "IN_LIMIT",
    };

    const merchants = ele.merchants || [];

    let totalSpending = 0;
    // For co2 emission
    // co2EmissionCategorySum = keeps track of category level sum of co2 emissison

    let co2EmissionCategorySum = 0;

    merchants.forEach((merchant) => {
      // Generate the random transactions for the current merchant
      const randomTransactions = generateRandomTransactions(
        merchant,
        payloadObj.category
      );
      // Push the generated transactions.

      payloadObj.transactions = payloadObj.transactions.concat(
        randomTransactions.transactions
      );
      totalSpending += randomTransactions.totalSpending;
      co2EmissionCategorySum += randomTransactions.co2EmissionCategorySum;
    });

    // Add category sum to totalCo2Emission
    totalCo2Emission += co2EmissionCategorySum;
    // Add co2EmissionCategorySum to payload Object
    // This will help to calculate percentage
    payloadObj.co2EmissionCategorySum = co2EmissionCategorySum;

    // Shuffle the array before inserting to make it look like realisitic transations
    helpers.shuffleArray(payloadObj.transactions);

    // Self correct the final status
    if (Number(payloadObj.limit) - totalSpending >= 0) {
      payloadObj.remainingFunds.status = "IN_LIMIT";
    } else {
      payloadObj.remainingFunds.status = "EXCEEDED";
    }

    payloadObj.remainingFunds.value = Math.abs(
      Number(payloadObj.limit) - totalSpending
    );

    payload.push(payloadObj);
  });

  // Now we have generated AllCo2.
  // Calculate category wise percentage
  // and add percentage value

  addCo2Percentage(payload, totalCo2Emission);

  return payload;
};
