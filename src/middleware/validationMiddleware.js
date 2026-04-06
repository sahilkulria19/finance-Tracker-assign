const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['Viewer', 'Analyst', 'Admin']).withMessage('Invalid role'),
    validate
];

const loginValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

const financeEntryValidation = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isDate().withMessage('Date must be a valid date'),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    financeEntryValidation
};
