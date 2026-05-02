# Employee Payroll Management System (EPMS)

A full-stack web application for SmartPark to manage employee payroll efficiently.

## Features

- **Employee Management**: Add and view employee records
- **Department Management**: Manage departments with salary structures
- **Salary Management**: Create, update, and delete salary records
- **Payroll Reports**: Generate monthly payroll reports with export functionality
- **Session-based Authentication**: Secure login system
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Backend
- Node.js
- Express.js
- MySQL
- Express Sessions
- bcryptjs (for password hashing)
- CORS

### Frontend
- React.js
- React Router
- Axios (for API calls)
- Tailwind CSS
- Vite (build tool)

## Project Structure

```
Full-Stack_Task_1/
├── backend-project/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules/
├── frontend-project/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeeManagement.jsx
│   │   │   ├── DepartmentManagement.jsx
│   │   │   ├── SalaryManagement.jsx
│   │   │   └── Reports.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── database_setup.sql
├── ERD_Design.md
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

### 1. Database Setup

1. Start your MySQL server
2. Run the database setup script:
   ```bash
   mysql -u root -p < database_setup.sql
   ```
3. Verify the database and tables are created:
   ```sql
   USE EPMS;
   SHOW TABLES;
   ```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Edit the `.env` file with your MySQL credentials
   - Default configuration assumes MySQL on localhost with root user and no password

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

## Usage

1. **Login**: Use the default credentials to access the system
2. **Dashboard**: View overview statistics
3. **Employees**: Add new employee records
4. **Departments**: Manage department salary structures
5. **Salaries**: Create and manage monthly salary records
6. **Reports**: Generate monthly payroll reports and export to CSV

## Database Schema

### Department Table
- `departmentCode` (Primary Key)
- `departmentName`
- `grossSalary`
- `totalDeduction`

### Employee Table
- `employeeNumber` (Primary Key)
- `firstName`, `lastName`
- `position`, `address`, `telephone`
- `gender`, `hiredDate`
- `departmentCode` (Foreign Key)

### Salary Table
- `salaryId` (Primary Key, Auto-increment)
- `employeeNumber` (Foreign Key)
- `grossSalary`, `totalDeduction`, `netSalary`
- `month`, `year`

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee

### Salaries
- `GET /api/salaries` - Get all salary records
- `POST /api/salaries` - Create new salary record
- `PUT /api/salaries/:id` - Update salary record
- `DELETE /api/salaries/:id` - Delete salary record

### Reports
- `GET /api/payroll-report` - Generate monthly payroll report

## Features Implemented

✅ Entity Relationship Diagram (ERD)
✅ Database setup with initial data
✅ Backend API with full CRUD operations
✅ React frontend with responsive design
✅ Session-based authentication
✅ Employee, Department, and Salary management
✅ Monthly payroll reports with CSV export
✅ Tailwind CSS for modern UI
✅ Error handling and validation

## Notes

- The system uses MySQL for data persistence
- Passwords are hashed using bcryptjs
- Sessions are used for authentication
- The frontend is built with Vite for fast development
- Tailwind CSS provides responsive and modern styling
- All forms include validation and error handling

## Future Enhancements

- Employee profile editing
- Advanced filtering and search
- Role-based access control
- Email notifications
- Data visualization charts
- Bulk salary processing
- Attendance integration
