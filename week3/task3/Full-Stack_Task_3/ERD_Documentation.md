# Stock Inventory Management System (SIMS) - ERD Documentation

## Entity Relationship Diagram

### Entities and Attributes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SIMS ERD - Entity Relationship Diagram            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│     Spare_Part      │         │     Stock_In        │         │     Stock_Out       │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ PK: SparePartID     │◄───────│ FK: SparePartID     │         │ FK: SparePartID     │
│    Name             │    1:M  │ PK: StockInID       │         │ PK: StockOutID      │
│    Category         │         │    StockInQuantity  │         │    StockOutQuantity │
│    Quantity         │         │    StockInDate      │         │    StockOutUnitPrice│
│    UnitPrice        │         │    UnitPrice         │         │    StockOutDate     │
│    TotalPrice       │         │    TotalPrice       │         │    StockOutTotalPr. │
│    CreatedAt        │         │    CreatedAt        │         │    CreatedAt        │
│    UpdatedAt        │         │                     │         │    UpdatedAt        │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
         │                                                                  │
         │         ┌─────────────────────┐                                  │
         │         │       Users         │                                  │
         │         ├─────────────────────┤                                  │
         └────────►│ PK: UserID          │                                  │
                   │    Username         │◄─────────────────────────────────┘
                   │    Password         │        (Independent Entity)
                   │    CreatedAt        │
                   └─────────────────────┘
```

## Cardinality and Relationships

### 1. Spare_Part to Stock_In (One-to-Many)
- **Relationship**: One Spare Part can have multiple Stock In records
- **Cardinality**: 1 : M
- **Foreign Key**: Stock_In.SparePartID references Spare_Part.SparePartID
- **Constraint**: ON DELETE CASCADE

### 2. Spare_Part to Stock_Out (One-to-Many)
- **Relationship**: One Spare Part can have multiple Stock Out records
- **Cardinality**: 1 : M
- **Foreign Key**: Stock_Out.SparePartID references Spare_Part.SparePartID
- **Constraint**: ON DELETE CASCADE

### 3. Users (Independent Entity)
- **Purpose**: Authentication and session management
- **No direct relationship** with inventory entities

## Primary Keys (PK)

| Table         | Primary Key    | Type          | Description                  |
|---------------|----------------|---------------|------------------------------|
| Users         | UserID         | INT (AI)      | Unique user identifier       |
| Spare_Part    | SparePartID    | INT (AI)      | Unique spare part identifier |
| Stock_In      | StockInID      | INT (AI)      | Unique stock in record ID    |
| Stock_Out     | StockOutID     | INT (AI)      | Unique stock out record ID   |

## Foreign Keys (FK)

| Table         | Foreign Key    | References            | On Delete |
|---------------|----------------|---------------------- |-----------|
| Stock_In      | SparePartID    | Spare_Part.SparePartID| CASCADE   |
| Stock_Out     | SparePartID    | Spare_Part.SparePartID| CASCADE   |

## Data Types and Constraints

### Users Table
- UserID: INT, Primary Key, Auto Increment
- Username: VARCHAR(50), NOT NULL, UNIQUE
- Password: VARCHAR(255), NOT NULL (bcrypt hashed)
- CreatedAt: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Spare_Part Table
- SparePartID: INT, Primary Key, Auto Increment
- Name: VARCHAR(100), NOT NULL
- Category: VARCHAR(50), NOT NULL
- Quantity: INT, NOT NULL, DEFAULT 0
- UnitPrice: DECIMAL(10,2), NOT NULL
- TotalPrice: DECIMAL(10,2), GENERATED (Quantity * UnitPrice)
- CreatedAt: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- UpdatedAt: TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP

### Stock_In Table
- StockInID: INT, Primary Key, Auto Increment
- SparePartID: INT, NOT NULL, Foreign Key
- StockInQuantity: INT, NOT NULL
- StockInDate: DATE, NOT NULL
- UnitPrice: DECIMAL(10,2), NOT NULL
- TotalPrice: DECIMAL(10,2), GENERATED (StockInQuantity * UnitPrice)
- CreatedAt: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Stock_Out Table
- StockOutID: INT, Primary Key, Auto Increment
- SparePartID: INT, NOT NULL, Foreign Key
- StockOutQuantity: INT, NOT NULL
- StockOutUnitPrice: DECIMAL(10,2), NOT NULL
- StockOutTotalPrice: DECIMAL(10,2), GENERATED (StockOutQuantity * StockOutUnitPrice)
- StockOutDate: DATE, NOT NULL
- CreatedAt: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- UpdatedAt: TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP

## Crow's Foot Notation

```
Spare_Part ||---o< Stock_In
   (1)           (Many)

Spare_Part ||---o< Stock_Out
   (1)           (Many)
```

Legend:
- || = One and only one
- o< = Zero or many

## Business Rules

1. A spare part must exist before stock can be added (Stock_In)
2. A spare part must exist before stock can be removed (Stock_Out)
3. Stock_Out quantity cannot exceed available quantity
4. When a spare part is deleted, all related Stock_In and Stock_Out records are deleted (CASCADE)
5. TotalPrice is automatically calculated based on Quantity × UnitPrice
