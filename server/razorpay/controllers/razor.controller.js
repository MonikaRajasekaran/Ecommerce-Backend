const httpStatus = require("http-status");
const _ = require("lodash");
const service = require("../services/razorpay.service");
const CONSTANTS = require("../../helpers/Constants");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);
const helpers = require("../../helpers/helpers");
// module.exports.createCustomer = async (req, res, next) => {
//   const { body } = req;
//   try {
    
//     const customer = await service.getCustomer(req.body);
//     if (customer) {
//       return res.status(httpStatus.OK).send(customer);
//     }
//     const response = await service.createCustomer(body);
//     res.status(httpStatus.CREATED).send(response);
//   } catch (e) {
//     return next(
//       new APIError(e.message, e.status, true, res.__("system_error"), "code")
//     );
//   }
// };


module.exports.createCustomer = async (req, res, next) => {
  try {
    const { name, contact, email, notes } = req.body;
    
    console.log("Received customer creation request:", { name, contact, email, notes });
    
    if (!contact) {
      return next(
        new APIError('Contact number is required', httpStatus.BAD_REQUEST, true, 'Contact number is required')
      );
    }

    // Convert contact to string and validate
    const contactStr = contact.toString();
    if (isNaN(contactStr) || contactStr.replace(/\D/g, '').length < 10) {
      return next(
        new APIError('Invalid contact number', httpStatus.BAD_REQUEST, true, 'Invalid contact number')
      );
    }

    const searchPayload = {
      contact: contactStr
    };

    // Check if customer exists
    const existingCustomer = await service.getCustomer(searchPayload);
    
    if (existingCustomer) {
      return res.status(httpStatus.OK).json({
        success: true,
        data: existingCustomer,
        message: "Customer already exists"
      });
    }

    // Create new customer
    const createPayload = {
      name: name || '',
      contact: contactStr,
      email: email || '',
      notes: notes || {}
    };

    console.log("Creating customer with payload:", createPayload);
    
    const newCustomer = await service.createCustomer(createPayload);
    return res.status(httpStatus.CREATED).json({
      success: true,
      data: newCustomer,
      message: "Customer created successfully"
    });
  } catch (e) {
    console.error("Customer creation error:", e);
    return next(
      new APIError(e.message, e.status || httpStatus.INTERNAL_SERVER_ERROR, true, "System error")
    );
  }
};
module.exports.createOrder = async (req, res, next) => {
  const { body } = req;
  try {
    const response = await service.createOrder(body);
    if (response) {
      return res.status(httpStatus.CREATED).send(response);
    }
    logger.log({
      level: "info",
      message: "Failed to Create Order",
    });
    return next(
      new APIError(
        "Failed to Create Order",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_create"),
        "Err001"
      )
    );
  } catch (e) {
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), "0")
    );
  }
};

module.exports.createSubscription = async (req, res, next) => {
  const { body } = req;
  try {
    const plan = CONSTANTS.PLANS[body.duration][body.plan];
    console.log(plan);
    if (plan) {
      const params = {
        plan_id: plan.id,
        total_count: 1,
        quantity: 1,
        customer_notify: 1,
        notes: {},
      };
      const response = await service.createSubscription(params);
      res.status(httpStatus.CREATED).send(response);
    }
  } catch (e) {
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), 0)
    );
  }
};
module.exports.verifyPayment = async (req, res, next) => {
  const { body } = req;
  try {
    // Validate required fields
    const requiredFields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      logger.error(`Missing required fields: ${missingFields.join(', ')}`);
      return next(
        new APIError(
          "Missing required fields",
          httpStatus.BAD_REQUEST,
          true,
          res.__("invalid_request"),
          "ERR_INVALID_REQUEST"
        )
      );
    }

    // Verify payment signature
    const verificationResponse = await service.verifyPayment(body);
    
    // If verification successful, fetch payment details
    const paymentDetails = await service.getPayment({
      razorpay_payment_id: body.razorpay_payment_id
    });

    return res.status(httpStatus.OK).json({
      success: true,
      data: {
        verified: verificationResponse.verified,
        payment: paymentDetails
      },
      message: "Payment verified successfully"
    });

  } catch (error) {
    logger.error("Payment verification error:", error);
    return next(
      new APIError(
        error.message || "Payment verification failed",
        error.status || httpStatus.BAD_REQUEST,
        true,
        res.__("payment_verification_failed"),
        "ERR_PAYMENT_VERIFICATION"
      )
    );
  }
};


module.exports.getCustomer = async (req, res, next) => {
  const { customerId } = req.params;
  try {
    const response = await service.getCustomer(customerId);
    return res.status(httpStatus.OK).json({
      success: true,
      data: response,
      message: "Customer fetched successfully"
    });
  } catch (error) {
    logger.error("Get customer error:", error);
    return next(
      new APIError(
        error.message || "Failed to fetch customer",
        error.status || httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_fetch"),
        "ERR_CUSTOMER_FETCH"
      )
    );
  }
};


module.exports.getOrder = async (req, res, next) => {
  const { orderId} = req.params;
  try {
    const response = await service.getOrderbyId(orderId);
    return res.status(httpStatus.OK).json({
      success: true,
      data: response,
      message: "Order fetched successfully"
    });
  } catch (error) {
    logger.error("Get order error:", error);
    return next(
      new APIError(
        error.message || "Failed to fetch order",
        error.status || httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_fetch"),
        "ERR_ORDER_FETCH"
      )
    );
  }
};




module.exports.getPaymentByOrder = async (req, res, next) => {
  const { rzpayid } = req.params;
  try {
    if (!rzpayid) {
      return res.status(400).json({ error: 'razorpay_order_id is required' });
    }
    const response = await service.getPaymentByOrder({ razorpay_order_id: rzpayid });
    return res.status(httpStatus.OK).json({
      success: true,
      data: response,
      message: "Payment fetched successfully"
    });
  } catch (error) {
    logger.error("Get Payment error:", error);
    return next(
      new APIError(
        error.message || "Failed to fetch customer",
        error.status || httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_fetch"),
        "ERR_PAYMENT_FETCH"
      )
    );
  }
};


module.exports.getAllOrder = async (req, res, next) => {
  const { query, user, organisation } = req;
  query.orgId = organisation.orgId;

  try {
    const { limit, skip, page } = query;
    const payload = _.omit(query, ["limit", "skip", "page"]);
    if (organisation?.orgId) {
      payload.orgId = organisation.orgId;
    }
    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await service.getOrderCount(payload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    service
      .getAllOrders(payload, counts.skipTo, counts.limitUntil)
      .then((response) => {
        res.status(httpStatus.OK).send({
          success: true,
          response,
          itemCount,
          currentPage,
          totalPages,
        });
      })
      .catch((e) => {
        next(new APIError(e.message, e.status, true, "Error"));
      });
  } catch (e) {
    next(new APIError(e.message, e.status, true, "Error"));
  }
};



exports.updateOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const updateData = req.body;
  try {
    const response = await service.updateOrderById(orderId, updateData);
    return res.status(200).json({
      success: true,
      data: response,
      message: "Order updated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order"
    });
  }
};