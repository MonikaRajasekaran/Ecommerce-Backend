const Razorpay = require("razorpay");
const decrypter = require("../../helpers/decrypter.helper");
const config = require("../../../config/config");
const crypto = require("crypto");
let instance;
(async () => {
  instance = new Razorpay({
  key_id: process.env.RAZORPAY_API || decrypter.decrypt(config.extras.razor_api_key),
  key_secret: process.env.RAZORPAY_SECRET || decrypter.decrypt(config.extras.razor_shared_secret),
});

})();

console.log(instance);

module.exports.createCustomer = (data) =>
  new Promise((resolve, reject) => {
    instance.customers
      .create(data)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.createOrder = (data) =>
  new Promise((resolve, reject) => {
    instance.orders
      .create(data)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.getPayment = (data) =>
  new Promise((resolve, reject) => {
    instance.payments
      .fetch(data.razorpay_payment_id)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.getPaymentByOrder = (data) =>
  new Promise((resolve, reject) => {
    instance.orders
      .fetchPayments(data.razorpay_order_id)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.createSubscription = (params) =>
  new Promise((resolve, reject) => {
    instance.subscriptions
      .create(params)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.verifyPayment = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        data;

      // Create signature
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac(
          "sha256",
          decrypter.decrypt(config.extras.razor_shared_secret)
        )
        .update(sign)
        .digest("hex");

      // Verify signature
      if (expectedSign === razorpay_signature) {
        try {
          // Get payment and order details
          const [paymentDetails, orderDetails] = await Promise.all([
            instance.payments.fetch(razorpay_payment_id),
            instance.orders.fetch(razorpay_order_id),
          ]);

          resolve({
            verified: true,
            payment: paymentDetails,
            order: orderDetails,
            verification: {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
          });
        } catch (fetchError) {
          // If fetching details fails, still return verification success
          resolve({
            verified: true,
            verification: {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
          });
        }
      } else {
        reject(new Error("Invalid payment signature"));
      }
    } catch (error) {
      reject(error);
    }
  });

module.exports.getCustomer = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      // Handle different parameter formats
      const customerId =
        params.customerId || (typeof params === "string" ? params : null);
      const contact = params.contact;

      // If customerId is provided, fetch directly
      if (customerId) {
        const customer = await instance.customers.fetch(customerId);
        resolve(customer);
        return;
      }

      // If contact is provided, search by contact
      if (contact) {
        // Clean phone number - remove non-digits and ensure string
        const cleanContact = contact.toString().replace(/\D/g, "").slice(-10);

        try {
          // Try to get all customers and find match
          const customers = await instance.customers.all({
            count: 100,
          });

          if (customers && customers.items && customers.items.length > 0) {
            // Find customer with matching phone
            const matchingCustomer = customers.items.find((cust) => {
              if (!cust.contact) return false;
              const custContact = cust.contact
                .toString()
                .replace(/\D/g, "")
                .slice(-10);
              return custContact === cleanContact;
            });

            if (matchingCustomer) {
              resolve(matchingCustomer);
              return;
            }
          }
        } catch (searchError) {
          console.error("Error searching customers:", searchError);
        }

        // No matching customer found - return null instead of rejecting
        resolve(null);
        return;
      }

      reject(new Error("Either Customer ID or phone number is required"));
    } catch (error) {
      console.error("Get customer error:", error);
      reject(error);
    }
  });

// module.exports.getCustomer = (params) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       // Handle different parameter formats
//       const customerId = params.customerId || (typeof params === 'string' ? params : null);
//       const contact = params.contact || params.phone;

//       // If customerId is provided, fetch directly
//       if (customerId) {
//         const customer = await instance.customers.fetch(customerId);
//         resolve(customer);
//         return;
//       }

//       // If contact/phone is provided, search by contact
//       if (contact) {
//         const customers = await instance.customers.all({
//           count: 1,
//           skip: 0,
//           contact: contact
//         });

//         if (customers.items && customers.items.length > 0) {
//           resolve(customers.items[0]);
//           return;
//         }
//         reject(new Error('Customer not found with given phone number'));
//         return;
//       }

//       reject(new Error('Either Customer ID or phone number is required'));
//     } catch (error) {
//       reject(error);
//     }
//   });

module.exports.getOrderbyId = (orderId) =>
  new Promise((resolve, reject) => {
    try {
      instance.orders
        .fetch(orderId)
        .then((response) => resolve(response))
        .catch((e) => reject(e));
    } catch (error) {
      reject(error);
    }
  });

module.exports.getAllOrders = (params = {}) =>
  new Promise((resolve, reject) => {
    try {
      instance.orders
        .all(params)
        .then((response) => resolve(response))
        .catch((e) => reject(e));
    } catch (error) {
      reject(error);
    }
  });

// For Razorpay orders
module.exports.getOrderCount = async (params = {}) => {
  try {
    const response = await instance.orders.all(params);
    // Razorpay's response usually has a 'count' property
    return response.count || (response.items ? response.items.length : 0);
  } catch (error) {
    throw error;
  }
};

module.exports.updateOrderById = (orderId, updateData) =>
  new Promise((resolve, reject) => {
    try {
      instance.orders
        .edit(orderId, updateData)
        .then((response) => resolve(response))
        .catch((e) => reject(e));
    } catch (error) {
      reject(error);
    }
  });
