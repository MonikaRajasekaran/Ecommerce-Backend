const httpStatus = require("http-status");
const _ = require("lodash");

const paymentService = require("../services/payments.service");
const paySessionService = require("../services/paymentSession.service");
const razorpayService = require("../../razorpay/services/razorpay.service");
const walletService = require("../../wallet/services/wallet.service");
const helpers = require("../../helpers/helpers");
const APIError = require("../../helpers/APIError.helper");
const CONSTANTS = require("../../helpers/Constants");
const logger = require("../../../config/winston")(module);

module.exports.processPaymentPayee = (req, res, next) => {
  const { body } = req;

  logger.log({
    level: "info",
    message: JSON.stringify(body),
  });
  body.user = req.user;
  // if (body.user && body.user.userId) {
  //   accountsService
  //     .getAccounts({ userId: body.user.userId })
  //     .then((response) => {
  //       if (response && response.length !== 0) {
  //         return response[0].accountId;
  //       }
  //       const err = new APIError(`Account not found`);
  //       err.status = httpStatus.BAD_REQUEST;
  //       return Promise.reject(err);
  //     })
  //     .then((senderAccountId) => {
  //       return paymentsService.processPaymentPayee(
  //         senderAccountId,
  //         body.payeeId,
  //         body
  //       );
  //     })
  //     .then((response) => {
  //       return res.status(httpStatus.OK).json({
  //         paymentId: response.paymentId,
  //         message: res.__("payment_completed_successful"),
  //       });
  //     })
  //     .catch((e) => {
  //       logger.error(`Error: ${e.stack}`);
  //       const code = `Err${CONSTANTS.MODULE_CODE.PAYMENTS}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
  //       return next(
  //         new APIError(e.message, e.status, true, res.__("system_error"), code)
  //       );
  //     });
  // } else {
  //   const customerErr = new APIError(`Error fetching Customer details`);
  //   customerErr.status = 400;
  //   return next(customerErr);
  // }
  return null;
};

module.exports.createPaymentSession = async (req, res, next) => {
  const { body, user } = req;
  try {
    const createObj = {
      payment_method_types: ["card"],
      client_reference_id: body.clientReferenceId,
      metadata: body.metadata,
      customer_email: body.email,

      line_items: [
        {
          price_data: {
            currency: body.currencyCode,
            product_data: {
              name: "Top up",
            },
            unit_amount: body.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
    };
    if (body.address) createObj.billing_address_collection = body.address;
    const session = await paymentService.createStripePaymentSession(createObj);
    if (session.id) {
      await paySessionService.createPaymentSession({
        userId: user.userId,
        stripeSessionId: session.id,
        paymentIntent: session.payment_intent,
        type: body.type,
        meta: body.meta,
      });
      return res.status(httpStatus.CREATED).json(session);
    }
    const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
    logger.log({
      level: "error",
      message: `Failed to Create Payment Session ${code}`,
    });
    return next(
      new APIError(
        "Failed to Create Payment Session",
        httpStatus.NOT_FOUND,
        true,
        res.__("failed_to_get"),
        code
      )
    );
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};

module.exports.transactions = async (req, res, next) => {
  const { user, query } = req;
  const { limit, skip, page } = query;
  try {
    const payload = _.omit(query, ["limit", "skip", "page"]);
    let check;
    if (payload.filter && payload.filter === "all") {
      check = {};
    } else {
      check = { userId: user.userId };
    }
    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await paymentService.getCount(check)
    );
    const { itemCount, currentPage, totalPages, skipTo, limitUntil } = counts;

    const data = await paymentService.getPayments(check, skipTo, limitUntil);

    if (data) {
      return res
        .status(httpStatus.OK)
        .json({ data, itemCount, currentPage, totalPages });
    }
    const code = `Err${CONSTANTS.MODULE_CODE.DRUG}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
    logger.log({
      level: "info",
      message: `Failed to Get ${code}`,
    });
    return next(
      new APIError(
        "Failed to Get",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_get"),
        code
      )
    );
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.DRUG}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};

module.exports.createRazorSession = async (req, res, next) => {
  const { body, user } = req;
  try {
    const createObj = {
      amount: body.amount,
      currency: body.currency,
      receipt: body.receipt,
      notes: body.notes || {},
    };
    const session = await razorpayService.createOrder(createObj);
    if (session.id) {
      await paySessionService.createPaymentSession({
        userId: user.userId,
        paymentSessionId: session.id,
        sesssiontype: "RAZOR",
      });
      return res.status(httpStatus.CREATED).json(session);
    }
    const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
    logger.log({
      level: "error",
      message: `Failed to Create Payment Session ${code}`,
    });
    return next(
      new APIError(
        "Failed to Create Payment Session",
        httpStatus.NOT_FOUND,
        true,
        res.__("failed_to_get"),
        code
      )
    );
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};

module.exports.createRazorCustomer = async (req, res, next) => {
  const { body } = req;
  try {
    const customer = await razorpayService.createCustomer(body);
    return res.send(customer);
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};

module.exports.completePayment = async (req, res, next) => {
  const { body, user } = req;
  try {
    const payment = await razorpayService.getPayment(body);
    const orderDetail = await paySessionService.getPaymentById({
      paymentSessionId: payment.order_id,
    });
    if (!orderDetail || orderDetail.userId !== user.userId) {
      const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
      logger.log({
        level: "error",
        message: `Failed to Fetch Order Details ${code}`,
      });
      return next(
        new APIError(
          "Failed to Fetch Order Details",
          httpStatus.NOT_FOUND,
          true,
          res.__("failed_to_get"),
          code
        )
      );
    }
    const payload = {};
    payload.gatewayPaymentId = payment.id;
    payload.gatewayIntentId = payment.order_id;
    payload.transactionObj = payment;
    payload.amountCredited = payment.amount;
    payload.userId = user.userId;
    payload.gatewayfee = payment.fee || 0;
    const response = await paymentService.createPayment(payload);
    if (!response.paymentId) {
      const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
      logger.log({
        level: "error",
        message: `Failed to Create Payment Completion ${code}`,
      });
      return next(
        new APIError(
          "Failed to Create Payment Completion",
          httpStatus.NOT_FOUND,
          true,
          res.__("failed_to_get"),
          code
        )
      );
    }
    await walletService.addFundByUserId(response.userId, payment.amount);
    return res.send(response);
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.PAYMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};


module.exports.requestFromWallet = () =>{

}

module.exports.transferPayment = () => {
  
}