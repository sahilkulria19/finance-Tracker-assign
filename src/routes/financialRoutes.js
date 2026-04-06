const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { financeEntryValidation } = require('../middleware/validationMiddleware');

// All finance routes require authentication
router.use(authenticate);

router.post('/', authorize(['Analyst', 'Admin']), financeEntryValidation, financialController.createEntry);
router.get('/', financialController.getEntries);
router.patch('/:id', authorize(['Analyst', 'Admin']), financialController.updateEntry);
router.delete('/:id', authorize(['Admin']), financialController.deleteEntry);
router.get('/analytics', financialController.getAnalytics);

module.exports = router;
