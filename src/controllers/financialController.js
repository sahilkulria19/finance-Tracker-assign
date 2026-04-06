const FinancialEntry = require('../models/FinancialEntry');

// Create a new financial entry
const createEntry = async (req, res) => {
    try {
        const { amount, type, category, notes, date } = req.body;
        const user_id = req.user.id;

        const entry = await FinancialEntry.create({
            amount,
            type,
            category,
            notes,
            date,
            user_id
        });

        res.status(201).json({ id: entry._id, message: 'Record created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all entries with filtering and role-based logic
const getEntries = async (req, res) => {
    try {
        const { type, category, startDate, endDate, userId } = req.query;
        let filter = { deletedAt: null };

        // Role-based restrictions
        if (req.user.role === 'Viewer' || req.user.role === 'Analyst') {
            filter.user_id = req.user.id;
        } else if (req.user.role === 'Admin' && userId) {
            filter.user_id = userId;
        }

        // Filters
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const entries = await FinancialEntry.find(filter)
            .populate('user_id', 'username')
            .sort({ date: -1 });
            
        res.status(200).json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, notes, date } = req.body;
        const user_id = req.user.id;

        const entry = await FinancialEntry.findById(id);
        if (!entry) return res.status(404).json({ message: 'Record not found' });

        // Verify ownership for non-admins
        if (req.user.role !== 'Admin' && entry.user_id.toString() !== user_id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        Object.assign(entry, { amount, type, category, notes, date });
        await entry.save();
        
        res.status(200).json({ message: 'Record updated successfully', entry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const entry = await FinancialEntry.findById(id);
        if (!entry) return res.status(404).json({ message: 'Record not found' });

        // Verification logic
        if (req.user.role !== 'Admin' && entry.user_id.toString() !== user_id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Soft delete
        entry.deletedAt = new Date();
        await entry.save();
        
        res.status(200).json({ message: 'Record soft deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Summary Analytics
const getAnalytics = async (req, res) => {
    try {
        const user_id = req.user.id;
        let filter = { deletedAt: null };

        if (req.user.role === 'Viewer' || req.user.role === 'Analyst') {
            filter.user_id = user_id;
        }

        const entries = await FinancialEntry.find(filter);

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryWise = {};

        entries.forEach(entry => {
            const amt = entry.amount;
            if (entry.type === 'income') {
                totalIncome += amt;
            } else {
                totalExpense += amt;
            }

            if (!categoryWise[entry.category]) {
                categoryWise[entry.category] = 0;
            }
            categoryWise[entry.category] += amt;
        });

        res.status(200).json({
            summary: {
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
                count: entries.length
            },
            categoryWise,
            recentActivity: entries.slice(0, 5)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createEntry,
    getEntries,
    updateEntry,
    deleteEntry,
    getAnalytics
};
