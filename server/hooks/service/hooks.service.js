const { LexRuntime } = require("aws-sdk");
const APIError = require("../../helpers/APIError.helper");
const paymentService = require("../../payments/services/payments.service");
const paymentSessionService = require("../../payments/services/paymentSession.service");
const walletService = require("../../wallet/services/wallet.service");
const logger = require("../../../config/winston")(module);

const paymentGeneration = async (body, type) => {
  try {
    const event = body.data.object;
    const balancerTxn = await paymentService.fetchBalancetxn(
      event.balance_transaction
    );
    const amountCredited =
      (balancerTxn.amount - balancerTxn.fee) / balancerTxn.exchange_rate;
    const fee = balancerTxn.fee / balancerTxn.exchange_rate;
    const payload = {};
    payload.stripeIntentId = event.payment_intent;
    payload.stripeChargeObj = body;
    payload.stripeTransactionObj = balancerTxn;
    payload.amountCredited = (amountCredited / 100).toFixed(0);
    payload.stripeFee = (fee / 100).toFixed(0);
    payload.status = "COMPLETED";
    payload.type = type;
    return payload;
  } catch (e) {
    logger.log(e);
    throw e;
  }
};

module.exports.payloadParser = async (body) => {
  try {
    if (body.type === "charge.succeeded") {
      if (body.data && body.data.object) {
        const sessionObj = await paymentSessionService.getPaymentById({
          paymentIntent: body.data.object.payment_intent,
        });
        let payload;
        let query;
        let processed;
        const userId = sessionObj.userId;
        if (sessionObj && sessionObj.type === "GCOIN") {
          const credits = sessionObj.meta.count;
          processed = await paymentGeneration(body, sessionObj.type);
          query = { userId };
          payload = {
            $inc: { gCoins: credits },
          };
        } else {
          processed = await paymentGeneration(body, sessionObj.type);
          query = { userId };
          payload = {
            $inc: { availableFunds: processed.amountCredited },
          };
        }
        processed.userId = userId;
        const create = paymentService.createPayment(processed);
        const update = paymentSessionService.updatePaymentSession(
          {
            paymentIntent: processed.stripeIntentId,
          },
          { $set: { status: "COMPLETED" } }
        );
        const response = await Promise.all([create, update]);
        if (
          response[0] &&
          response[0].paymentId &&
          response[1] &&
          response[1].paymentIntent
        ) {
          const topup = await walletService.updateWallet(query, payload);
          return topup;
        }
      }
      logger.error(JSON.stringify(body));
      throw new APIError("Invalid event object");
    }
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
