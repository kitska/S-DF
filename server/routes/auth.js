const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/authMW');

router.post('/register', authController.register);
router.get('/confirm-email/:token', authController.confirmEmail);
router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.post('/password-reset', authController.sendResetLink);
router.post('/password-reset/:token', authController.confirmNewPassword);

module.exports = router;
