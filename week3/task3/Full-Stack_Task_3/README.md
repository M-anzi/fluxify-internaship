# Stock Inventory Management System (SIMS)

A full-stack web application for SmartPark company in Rubavu District, Rwanda, designed to manage spare parts inventory efficiently.

## Developed By
Full Stack Developer - Task 3 Submission

## Project Overview

SIMS replaces the manual, paper-based stock management system with an automated web-based solution that handles:
- Spare parts catalog management
- Stock intake (purchases)
- Stock outflow (usage/sales)
- Daily reporting and stock status tracking

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: bcryptjs + express-session
- **CORS**: Enabled for frontend communication

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## Project Structure

```
Full-Stack_Task_3/
├── backend-project/
│   ├── server.js          # Main server file
│   ├── db.js              # Database connection
│   ├── database.sql       # Database schema and sample data
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
│
├── frontend-project/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   ├── Login.js
│   │   │   ├── SparePart.js
│   │   │   ├── StockIn.js
│   │   │   ├── StockOut.js
│   │   │   └── Reports.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── ERD_Documentation.md   # Entity Relationship Diagram
└── README.md              # This file
```

## Features

### 1. Authentication System
- Session-based login with encrypted passwords (bcrypt)
- Password requirements: Minimum 8 characters
- Default credentials: admin / Admin@123
- Protected routes requiring authentication

### 2. Spare Parts Management (Insert Only)
- Add new spare parts with:
  - Name
  - Category (Engine Parts, Braking System, Cooling System, etc.)
  - Initial Quantity
  - Unit Price
- Automatic TotalPrice calculation (Quantity × UnitPrice)
- View all spare parts in inventory

### 3. Stock In Management (Insert Only)
- Record stock purchases/intake
- Auto-populate unit price from spare part record
- Update spare part quantity automatically
- View stock in history

### 4. Stock Out Management (Full CRUD)
- Create stock out records
- Read/view all stock out records
- Update existing records
- Delete records (restores stock quantity)
- Stock validation (cannot exceed available quantity)

### 5. Reports
- **Daily Stock Out Report**: Shows all stock out transactions for a selected date with totals
- **Stock Status Report**: Shows current inventory status including:
  - Spare part name and category
  - Stored quantity
  - Total stock in
  - Total stock out
  - Remaining quantity
  - Status indicators (In Stock / Low Stock / Out of Stock)

### 6. Responsive Design
- Mobile-friendly interface
- Tailwind CSS styling
- Navigation bar with menu options

## Database Schema

See `ERD_Documentation.md` for detailed Entity Relationship Diagram.

### Tables
1. **Users** - Authentication
2. **Spare_Part** - Master inventory catalog
3. **Stock_In** - Purchase/stock intake records
4. **Stock_Out** - Usage/stock outflow records

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Step 1: Database Setup

1. Open MySQL and run the database script:
```bash
mysql -u root -p < backend-project/database.sql
```

Or manually:
```sql
-- Create database and tables
CREATE DATABASE SIMS;
USE SIMS;
SOURCE backend-project/database.sql;
```

### Step 2: Backend Setup

```bash
cd Full-Stack_Task_3/backend-project

# Install dependencies
npm install

# Update .env file with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=SIMS
# PORT=5000

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on http://localhost:5000

### Step 3: Frontend Setup

```bash
cd Full-Stack_Task_3/frontend-project

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/session` - Check session status

### Spare Parts
- `GET /api/spare-parts` - List all spare parts
- `GET /api/spare-parts/:id` - Get single spare part
- `POST /api/spare-parts` - Create new spare part

### Stock In
- `GET /api/stock-in` - List all stock in records
- `POST /api/stock-in` - Create new stock in record

### Stock Out
- `GET /api/stock-out` - List all stock out records
- `GET /api/stock-out/:id` - Get single stock out record
- `POST /api/stock-out` - Create new stock out record
- `PUT /api/stock-out/:id` - Update stock out record
- `DELETE /api/stock-out/:id` - Delete stock out record

### Reports
- `GET /api/reports/daily-stock-out?date=YYYY-MM-DD` - Daily stock out report
- `GET /api/reports/stock-status?date=YYYY-MM-DD` - Stock status report

## Default Login Credentials

- **Username**: admin
- **Password**: Admin@123

## Security Features

- Password encryption using bcryptjs (cost factor 10)
- Session-based authentication
- CORS protection
- SQL injection prevention (parameterized queries)
- Input validation on all forms
- Stock quantity validation before outflow

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Development Notes

- All forms have validation and error handling
- Automatic price calculations (Quantity × UnitPrice)
- Stock levels update automatically on transactions
- Reports are generated based on selected dates
- UI uses a blue primary color theme (#3b82f6)

## Troubleshooting

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env` file
   - Ensure SIMS database exists

2. **CORS Error**
   - Backend must run on port 5000
   - Frontend must run on port 3000
   - Check proxy setting in frontend package.json

3. **Session Not Persisting**
   - Clear browser cookies
   - Check session secret in `.env`
   - Ensure `withCredentials: true` in Axios requests

## License

This project was developed as part of a Full Stack Development task.

## Contact

For support or questions regarding this implementation, please refer to the project documentation.
