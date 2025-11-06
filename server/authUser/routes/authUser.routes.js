const express = require('express');
const router = express.Router();
// const { protect } = require('../middlewares/authMiddlewares');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authUser.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/me',  getMe);
router.get('/logout',  logout);

module.exports = router;