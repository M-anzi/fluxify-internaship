const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'sims_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// ==================== AUTHENTICATION ROUTES ====================

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [rows] = await pool.execute(
            'SELECT * FROM Users WHERE Username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.Password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.UserID;
        req.session.username = user.Username;

        res.json({ 
            message: 'Login successful', 
            user: { username: user.Username }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

// Check session
app.get('/api/session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ authenticated: true, user: { username: req.session.username } });
    } else {
        res.json({ authenticated: false });
    }
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        // Validation
        if (!username || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        // Check if username already exists
        const [existingUser] = await pool.execute(
            'SELECT * FROM Users WHERE Username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO Users (Username, Password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== SPARE PART ROUTES ====================

// Get all spare parts
app.get('/api/spare-parts', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Spare_Part ORDER BY CreatedAt DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching spare parts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single spare part
app.get('/api/spare-parts/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM Spare_Part WHERE SparePartID = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Spare part not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching spare part:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create spare part
app.post('/api/spare-parts', requireAuth, async (req, res) => {
    try {
        const { name, category, quantity, unitPrice } = req.body;
        
        if (!name || !category || quantity === undefined || !unitPrice) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [result] = await pool.execute(
            'INSERT INTO Spare_Part (Name, Category, Quantity, UnitPrice) VALUES (?, ?, ?, ?)',
            [name, category, quantity, unitPrice]
        );

        res.status(201).json({ 
            message: 'Spare part created successfully', 
            sparePartId: result.insertId 
        });
    } catch (error) {
        console.error('Error creating spare part:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== STOCK IN ROUTES ====================

// Get all stock in records
app.get('/api/stock-in', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT si.*, sp.Name as SparePartName, sp.Category 
            FROM Stock_In si 
            JOIN Spare_Part sp ON si.SparePartID = sp.SparePartID 
            ORDER BY si.CreatedAt DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching stock in records:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create stock in record
app.post('/api/stock-in', requireAuth, async (req, res) => {
    try {
        const { sparePartId, stockInQuantity, stockInDate, unitPrice } = req.body;
        
        if (!sparePartId || !stockInQuantity || !stockInDate || !unitPrice) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Insert stock in record
            const [result] = await connection.execute(
                'INSERT INTO Stock_In (SparePartID, StockInQuantity, StockInDate, UnitPrice) VALUES (?, ?, ?, ?)',
                [sparePartId, stockInQuantity, stockInDate, unitPrice]
            );

            // Update spare part quantity
            await connection.execute(
                'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SparePartID = ?',
                [stockInQuantity, sparePartId]
            );

            await connection.commit();
            connection.release();

            res.status(201).json({ 
                message: 'Stock in record created successfully', 
                stockInId: result.insertId 
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error creating stock in record:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== STOCK OUT ROUTES ====================

// Get all stock out records
app.get('/api/stock-out', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT so.*, sp.Name as SparePartName, sp.Category 
            FROM Stock_Out so 
            JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID 
            ORDER BY so.CreatedAt DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching stock out records:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single stock out record
app.get('/api/stock-out/:id', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT so.*, sp.Name as SparePartName, sp.Category 
            FROM Stock_Out so 
            JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID 
            WHERE so.StockOutID = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Stock out record not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching stock out record:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create stock out record
app.post('/api/stock-out', requireAuth, async (req, res) => {
    try {
        const { sparePartId, stockOutQuantity, stockOutUnitPrice, stockOutDate } = req.body;
        
        if (!sparePartId || !stockOutQuantity || !stockOutUnitPrice || !stockOutDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if enough stock is available
        const [stockCheck] = await pool.execute(
            'SELECT Quantity FROM Spare_Part WHERE SparePartID = ?',
            [sparePartId]
        );

        if (stockCheck.length === 0) {
            return res.status(404).json({ error: 'Spare part not found' });
        }

        if (stockCheck[0].Quantity < stockOutQuantity) {
            return res.status(400).json({ error: 'Insufficient stock available' });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Insert stock out record
            const [result] = await connection.execute(
                'INSERT INTO Stock_Out (SparePartID, StockOutQuantity, StockOutUnitPrice, StockOutDate) VALUES (?, ?, ?, ?)',
                [sparePartId, stockOutQuantity, stockOutUnitPrice, stockOutDate]
            );

            // Update spare part quantity
            await connection.execute(
                'UPDATE Spare_Part SET Quantity = Quantity - ? WHERE SparePartID = ?',
                [stockOutQuantity, sparePartId]
            );

            await connection.commit();
            connection.release();

            res.status(201).json({ 
                message: 'Stock out record created successfully', 
                stockOutId: result.insertId 
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error creating stock out record:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update stock out record
app.put('/api/stock-out/:id', requireAuth, async (req, res) => {
    try {
        const { sparePartId, stockOutQuantity, stockOutUnitPrice, stockOutDate } = req.body;
        const stockOutId = req.params.id;
        
        if (!sparePartId || !stockOutQuantity || !stockOutUnitPrice || !stockOutDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Get the old record to adjust stock
        const [oldRecord] = await pool.execute(
            'SELECT * FROM Stock_Out WHERE StockOutID = ?',
            [stockOutId]
        );

        if (oldRecord.length === 0) {
            return res.status(404).json({ error: 'Stock out record not found' });
        }

        const oldQuantity = oldRecord[0].StockOutQuantity;
        const oldSparePartId = oldRecord[0].SparePartID;

        // Check if enough stock is available (accounting for the old quantity)
        const [stockCheck] = await pool.execute(
            'SELECT Quantity FROM Spare_Part WHERE SparePartID = ?',
            [sparePartId]
        );

        if (stockCheck.length === 0) {
            return res.status(404).json({ error: 'Spare part not found' });
        }

        let availableStock = stockCheck[0].Quantity;
        if (parseInt(sparePartId) === oldSparePartId) {
            availableStock += oldQuantity; // Add back the old quantity
        }

        if (availableStock < stockOutQuantity) {
            return res.status(400).json({ error: 'Insufficient stock available' });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Restore old spare part quantity
            await connection.execute(
                'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SparePartID = ?',
                [oldQuantity, oldSparePartId]
            );

            // Update stock out record
            await connection.execute(
                'UPDATE Stock_Out SET SparePartID = ?, StockOutQuantity = ?, StockOutUnitPrice = ?, StockOutDate = ? WHERE StockOutID = ?',
                [sparePartId, stockOutQuantity, stockOutUnitPrice, stockOutDate, stockOutId]
            );

            // Deduct new spare part quantity
            await connection.execute(
                'UPDATE Spare_Part SET Quantity = Quantity - ? WHERE SparePartID = ?',
                [stockOutQuantity, sparePartId]
            );

            await connection.commit();
            connection.release();

            res.json({ message: 'Stock out record updated successfully' });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error updating stock out record:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete stock out record
app.delete('/api/stock-out/:id', requireAuth, async (req, res) => {
    try {
        const stockOutId = req.params.id;

        // Get the record to restore stock
        const [record] = await pool.execute(
            'SELECT * FROM Stock_Out WHERE StockOutID = ?',
            [stockOutId]
        );

        if (record.length === 0) {
            return res.status(404).json({ error: 'Stock out record not found' });
        }

        const { SparePartID, StockOutQuantity } = record[0];

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Restore spare part quantity
            await connection.execute(
                'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SparePartID = ?',
                [StockOutQuantity, SparePartID]
            );

            // Delete stock out record
            await connection.execute(
                'DELETE FROM Stock_Out WHERE StockOutID = ?',
                [stockOutId]
            );

            await connection.commit();
            connection.release();

            res.json({ message: 'Stock out record deleted successfully' });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error deleting stock out record:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== REPORT ROUTES ====================

// Daily Stock Out Report
app.get('/api/reports/daily-stock-out', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        const reportDate = date || new Date().toISOString().split('T')[0];

        const [rows] = await pool.execute(`
            SELECT 
                so.StockOutID,
                so.StockOutDate,
                sp.Name as SparePartName,
                sp.Category,
                so.StockOutQuantity,
                so.StockOutUnitPrice,
                so.StockOutTotalPrice
            FROM Stock_Out so
            JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID
            WHERE so.StockOutDate = ?
            ORDER BY so.CreatedAt DESC
        `, [reportDate]);

        const totalAmount = rows.reduce((sum, row) => sum + parseFloat(row.StockOutTotalPrice), 0);

        res.json({
            date: reportDate,
            records: rows,
            totalRecords: rows.length,
            totalAmount: totalAmount
        });
    } catch (error) {
        console.error('Error generating daily stock out report:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Daily Stock Status Report
app.get('/api/reports/stock-status', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        const reportDate = date || new Date().toISOString().split('T')[0];

        const [rows] = await pool.execute(`
            SELECT 
                sp.SparePartID,
                sp.Name as SparePartName,
                sp.Category,
                sp.Quantity as StoredQuantity,
                COALESCE(SUM(si.StockInQuantity), 0) as TotalStockIn,
                COALESCE(SUM(CASE WHEN so.StockOutDate <= ? THEN so.StockOutQuantity ELSE 0 END), 0) as TotalStockOut,
                sp.Quantity - COALESCE(SUM(CASE WHEN so.StockOutDate <= ? THEN so.StockOutQuantity ELSE 0 END), 0) as Remaining
            FROM Spare_Part sp
            LEFT JOIN Stock_In si ON sp.SparePartID = si.SparePartID
            LEFT JOIN Stock_Out so ON sp.SparePartID = so.SparePartID
            GROUP BY sp.SparePartID, sp.Name, sp.Category, sp.Quantity
            ORDER BY sp.Name
        `, [reportDate, reportDate]);

        res.json({
            date: reportDate,
            records: rows
        });
    } catch (error) {
        console.error('Error generating stock status report:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`SIMS Backend Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
