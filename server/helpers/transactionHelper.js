const ledgerService = require("../ledger/services/ledger.service");
const walletService = require("../wallet/services/wallet.service");
const paymentService = require("../payments/services/payments.service");

module.exports.onHoldAmount = async (
  sourceId,
  destinationId,
  appointmentId,
  amount,
  extras,
  currency
) => {
  const payload = {
    sourceId,
    destinationId,
    amount,
    serviceFee: extras.serviceFee * 100,
    applicationFee: extras.applicationFee * 100,
    currency,
    appointmentId,
  };
  try {
    const ledger = await ledgerService.create(payload);
    const deduct = await walletService.deductFundsByUserId(
      sourceId,
      amount + extras.serviceFee * 100 + extras.applicationFee * 100
    );
    return { ledger, deduct };
  } catch (e) {
    throw e;
  }
};
