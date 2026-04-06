const mongoose = require('mongoose');

const financialEntrySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FinancialEntry', financialEntrySchema);
