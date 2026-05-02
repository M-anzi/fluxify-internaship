const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database connection
let db;
async function initDB() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'EPMS'
        });
        console.log('Connected to MySQL database');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// Authentication middleware
const authenticateUser = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized - Please login' });
    }
    next();
};

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role = 'user' } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if username already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM Users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const [result] = await db.execute(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: result.insertId,
                username: username,
                role: role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [users] = await db.execute(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Check session endpoint
app.get('/api/auth/check', (req, res) => {
    if (req.session.userId) {
        res.json({
            authenticated: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.role
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Department endpoints
app.get('/api/departments', authenticateUser, async (req, res) => {
    try {
        const [departments] = await db.execute('SELECT * FROM Department');
        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/departments', authenticateUser, async (req, res) => {
    try {
        const { departmentCode, departmentName, grossSalary, totalDeduction } = req.body;
        
        if (!departmentCode || !departmentName || !grossSalary || !totalDeduction) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await db.execute(
            'INSERT INTO Department (departmentCode, departmentName, grossSalary, totalDeduction) VALUES (?, ?, ?, ?)',
            [departmentCode, departmentName, grossSalary, totalDeduction]
        );

        res.json({ message: 'Department created successfully' });
    } catch (error) {
        console.error('Error creating department:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Department code already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Employee endpoints
app.get('/api/employees', authenticateUser, async (req, res) => {
    try {
        const [employees] = await db.execute(`
            SELECT e.*, d.departmentName 
            FROM Employee e 
            LEFT JOIN Department d ON e.departmentCode = d.departmentCode
        `);
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/employees', authenticateUser, async (req, res) => {
    try {
        const { 
            employeeNumber, firstName, lastName, position, address, 
            telephone, gender, hiredDate, departmentCode 
        } = req.body;
        
        if (!employeeNumber || !firstName || !lastName || !hiredDate) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        await db.execute(
            'INSERT INTO Employee (employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departmentCode]
        );

        res.json({ message: 'Employee created successfully' });
    } catch (error) {
        console.error('Error creating employee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Employee number already exists' });
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({ error: 'Invalid department code' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Salary endpoints
app.get('/api/salaries', authenticateUser, async (req, res) => {
    try {
        const { month, year } = req.query;
        let query = `
            SELECT s.*, e.firstName, e.lastName, e.position, d.departmentName 
            FROM Salary s 
            JOIN Employee e ON s.employeeNumber = e.employeeNumber 
            LEFT JOIN Department d ON e.departmentCode = d.departmentCode
        `;
        
        let params = [];
        if (month && year) {
            query += ' WHERE s.month = ? AND s.year = ?';
            params = [month, year];
        }
        
        query += ' ORDER BY s.year DESC, s.month DESC, e.lastName, e.firstName';
        
        const [salaries] = await db.execute(query, params);
        res.json(salaries);
    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/salaries', authenticateUser, async (req, res) => {
    try {
        const { employeeNumber, grossSalary, totalDeduction, month, year } = req.body;
        
        if (!employeeNumber || !grossSalary || !totalDeduction || !month || !year) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const netSalary = grossSalary - totalDeduction;

        await db.execute(
            'INSERT INTO Salary (employeeNumber, grossSalary, totalDeduction, netSalary, month, year) VALUES (?, ?, ?, ?, ?, ?)',
            [employeeNumber, grossSalary, totalDeduction, netSalary, month, year]
        );

        res.json({ message: 'Salary record created successfully', netSalary });
    } catch (error) {
        console.error('Error creating salary record:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Salary record for this employee and month already exists' });
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({ error: 'Invalid employee number' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.put('/api/salaries/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { grossSalary, totalDeduction, month, year } = req.body;
        
        if (!grossSalary || !totalDeduction || !month || !year) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const netSalary = grossSalary - totalDeduction;

        await db.execute(
            'UPDATE Salary SET grossSalary = ?, totalDeduction = ?, netSalary = ?, month = ?, year = ? WHERE salaryId = ?',
            [grossSalary, totalDeduction, netSalary, month, year, id]
        );

        res.json({ message: 'Salary record updated successfully', netSalary });
    } catch (error) {
        console.error('Error updating salary record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/salaries/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.execute('DELETE FROM Salary WHERE salaryId = ?', [id]);
        
        res.json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        console.error('Error deleting salary record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Payroll report endpoint
app.get('/api/payroll-report', authenticateUser, async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }

        const [payroll] = await db.execute(`
            SELECT 
                e.firstName,
                e.lastName,
                e.position,
                d.departmentName,
                s.netSalary,
                s.grossSalary,
                s.totalDeduction
            FROM Salary s
            JOIN Employee e ON s.employeeNumber = e.employeeNumber
            LEFT JOIN Department d ON e.departmentCode = d.departmentCode
            WHERE s.month = ? AND s.year = ?
            ORDER BY d.departmentName, e.lastName, e.firstName
        `, [month, year]);

        const [summary] = await db.execute(`
            SELECT 
                COUNT(*) as totalEmployees,
                SUM(s.netSalary) as totalNetSalary,
                SUM(s.grossSalary) as totalGrossSalary,
                SUM(s.totalDeduction) as totalDeductions
            FROM Salary s
            WHERE s.month = ? AND s.year = ?
        `, [month, year]);

        res.json({
            payroll,
            summary: summary[0] || {
                totalEmployees: 0,
                totalNetSalary: 0,
                totalGrossSalary: 0,
                totalDeductions: 0
            }
        });
    } catch (error) {
        console.error('Error generating payroll report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(console.error);
