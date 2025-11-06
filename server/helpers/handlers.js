const responseHandler = (success, data) => ({
  success,
  data,
});

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(() => {
    responseHandler(false, 500, "Something went wrong", null);
  });

module.exports = {
  responseHandler,
  asyncHandler,
};
