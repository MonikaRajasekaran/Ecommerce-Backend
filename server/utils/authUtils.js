const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.comparePassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

exports.createSendToken = (user, statusCode, res) => {
  const token = exports.generateToken(user._id);
  
 const cookieOptions = {
  maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000, // Convert days to milliseconds
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'Strict',
};

// Example of setting a cookie
res.cookie('token', token, cookieOptions);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};