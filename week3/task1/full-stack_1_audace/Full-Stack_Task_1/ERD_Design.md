# Employee Payroll Management System (EPMS) - Entity Relationship Diagram

## Entities and Attributes

### 1. Employee Entity
- **employeeNumber** (Primary Key)
- firstName
- lastName
- position
- address
- telephone
- gender
- hiredDate
- departmentCode (Foreign Key - references Department)

### 2. Department Entity
- **departmentCode** (Primary Key)
- departmentName
- grossSalary
- totalDeduction

### 3. Salary Entity
- **salaryId** (Primary Key - Auto-generated)
- employeeNumber (Foreign Key - references Employee)
- grossSalary
- totalDeduction
- netSalary
- month
- year

## Relationships

### 1. Department - Employee Relationship
- **Type**: One-to-Many (1:N)
- **Description**: One department can have many employees
- **Foreign Key**: departmentCode in Employee table references departmentCode in Department table
- **Cardinality**: Department (1) ---< Employee (N)

### 2. Employee - Salary Relationship
- **Type**: One-to-Many (1:N)
- **Description**: One employee can have multiple salary records (monthly payments)
- **Foreign Key**: employeeNumber in Salary table references employeeNumber in Employee table
- **Cardinality**: Employee (1) ---< Salary (N)

## ERD Diagram (Text Representation)

```
[DEPARTMENT]
| departmentCode (PK) |
| departmentName      |
| grossSalary         |
| totalDeduction      |
         |
         | (1:N)
         |
[EMPLOYEE]
| employeeNumber (PK) |
| firstName          |
| lastName           |
| position           |
| address            |
| telephone          |
| gender             |
| hiredDate          |
| departmentCode (FK)|
         |
         | (1:N)
         |
[SALARY]
| salaryId (PK)      |
| employeeNumber (FK)|
| grossSalary        |
| totalDeduction     |
| netSalary          |
| month              |
| year               |
```

## Database Schema

### Department Table
```sql
CREATE TABLE Department (
    departmentCode VARCHAR(10) PRIMARY KEY,
    departmentName VARCHAR(100) NOT NULL,
    grossSalary DECIMAL(10,2) NOT NULL,
    totalDeduction DECIMAL(10,2) NOT NULL
);
```

### Employee Table
```sql
CREATE TABLE Employee (
    employeeNumber VARCHAR(20) PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    position VARCHAR(100),
    address VARCHAR(200),
    telephone VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other'),
    hiredDate DATE NOT NULL,
    departmentCode VARCHAR(10),
    FOREIGN KEY (departmentCode) REFERENCES Department(departmentCode)
);
```

### Salary Table
```sql
CREATE TABLE Salary (
    salaryId INT AUTO_INCREMENT PRIMARY KEY,
    employeeNumber VARCHAR(20) NOT NULL,
    grossSalary DECIMAL(10,2) NOT NULL,
    totalDeduction DECIMAL(10,2) NOT NULL,
    netSalary DECIMAL(10,2) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber),
    UNIQUE KEY unique_employee_month_year (employeeNumber, month, year)
);
```

## Initial Department Data

| DepartmentCode | DepartmentName   | GrossSalary | TotalDeduction |
|---------------|------------------|-------------|----------------|
| CW            | Carwash          | 300000.00   | 20000.00       |
| ST            | Stock            | 200000.00   | 5000.00        |
| MC            | Mechanic         | 450000.00   | 40000.00       |
| ADMS          | Administration   | 600000.00   | 70000.00       |

## Notes

1. **Net Salary Calculation**: netSalary = grossSalary - totalDeduction
2. **Salary Records**: Each employee will have one salary record per month
3. **Data Integrity**: Foreign key constraints ensure referential integrity
4. **Uniqueness**: Unique constraint on employeeNumber, month, and year in Salary table prevents duplicate monthly entries
