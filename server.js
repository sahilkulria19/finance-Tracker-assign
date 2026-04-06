require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const User = require('./src/models/User');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(async () => {
    // Seed admin if not exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
        await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'Admin',
            status: 'active'
        });
        console.log('Seeded default admin user.');
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
