-- Stock Inventory Management System Database Schema
-- Database Name: SIMS

CREATE DATABASE IF NOT EXISTS SIMS;
USE SIMS;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spare_Part table
CREATE TABLE IF NOT EXISTS Spare_Part (
    SparePartID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    TotalPrice DECIMAL(10, 2) GENERATED ALWAYS AS (Quantity * UnitPrice) STORED,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stock_In table
CREATE TABLE IF NOT EXISTS Stock_In (
    StockInID INT AUTO_INCREMENT PRIMARY KEY,
    SparePartID INT NOT NULL,
    StockInQuantity INT NOT NULL,
    StockInDate DATE NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    TotalPrice DECIMAL(10, 2) GENERATED ALWAYS AS (StockInQuantity * UnitPrice) STORED,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SparePartID) REFERENCES Spare_Part(SparePartID) ON DELETE CASCADE
);

-- Stock_Out table
CREATE TABLE IF NOT EXISTS Stock_Out (
    StockOutID INT AUTO_INCREMENT PRIMARY KEY,
    SparePartID INT NOT NULL,
    StockOutQuantity INT NOT NULL,
    StockOutUnitPrice DECIMAL(10, 2) NOT NULL,
    StockOutTotalPrice DECIMAL(10, 2) GENERATED ALWAYS AS (StockOutQuantity * StockOutUnitPrice) STORED,
    StockOutDate DATE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SparePartID) REFERENCES Spare_Part(SparePartID) ON DELETE CASCADE
);

-- Insert default admin user (password: Admin@123)
-- Password is hashed using bcrypt
INSERT INTO Users (Username, Password) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample data for Spare_Parts
INSERT INTO Spare_Part (Name, Category, Quantity, UnitPrice) VALUES
('Brake Pad', 'Braking System', 50, 25000.00),
('Oil Filter', 'Engine Parts', 100, 15000.00),
('Air Filter', 'Engine Parts', 75, 20000.00),
('Spark Plug', 'Ignition System', 200, 8000.00),
('Radiator Hose', 'Cooling System', 30, 35000.00);

-- Sample data for Stock_In
INSERT INTO Stock_In (SparePartID, StockInQuantity, StockInDate, UnitPrice) VALUES
(1, 20, '2026-05-01', 25000.00),
(2, 50, '2026-05-01', 15000.00),
(3, 30, '2026-05-01', 20000.00),
(4, 100, '2026-05-01', 8000.00),
(5, 15, '2026-05-01', 35000.00);

-- Sample data for Stock_Out
INSERT INTO Stock_Out (SparePartID, StockOutQuantity, StockOutUnitPrice, StockOutDate) VALUES
(1, 5, 25000.00, '2026-05-01'),
(2, 10, 15000.00, '2026-05-01'),
(3, 5, 20000.00, '2026-05-01'),
(4, 20, 8000.00, '2026-05-01'),
(5, 3, 35000.00, '2026-05-01');
