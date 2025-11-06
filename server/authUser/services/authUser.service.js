const User = require('../models/User');
const { comparePassword, createSendToken } = require('../utils/authUtils');

/**
 * Register a new user
 * @param {Object} userData - User data including name, email, and password
 * @returns {Promise<Object>} The created user (without password)
 */
const registerUser = async (userData) => {
  const user = await User.create(userData);
  user.password = undefined; // Remove password from the returned user object
  return user;
};

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * @throws {Error} If credentials are invalid
 */
const loginUser = async (email, password, res) => {
  if (!email || !password) {
    throw new Error('Please provide an email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Send token response
  createSendToken(user, 200, res);
};

/**
 * Get current user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} The user profile
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};