const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validationMiddleware');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authenticate, authController.getMe);

// Admin-only user management
router.get('/users', authenticate, authorize(['Admin']), authController.getAllUsers);
router.patch('/users/:id', authenticate, authorize(['Admin']), authController.updateUserStatus);

module.exports = router;
