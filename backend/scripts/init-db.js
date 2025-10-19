const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sample.db');

// Create database and sample data
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');
});

// Create sample tables and data
db.serialize(() => {
  // Drop existing tables if they exist
  db.run('DROP TABLE IF EXISTS employees');
  db.run('DROP TABLE IF EXISTS departments');
  db.run('DROP TABLE IF EXISTS sales');

  // Create departments table
  db.run(`
    CREATE TABLE departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      budget REAL
    )
  `);

  // Create employees table
  db.run(`
    CREATE TABLE employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE,
      department_id INTEGER,
      salary REAL,
      hire_date DATE,
      FOREIGN KEY (department_id) REFERENCES departments (id)
    )
  `);

  // Create sales table
  db.run(`
    CREATE TABLE sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      product_name TEXT,
      quantity INTEGER,
      unit_price REAL,
      sale_date DATE,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )
  `);

  // Insert sample departments
  const departments = [
    ['Engineering', 'San Francisco', 500000],
    ['Sales', 'New York', 300000],
    ['Marketing', 'Chicago', 200000],
    ['HR', 'Boston', 150000]
  ];

  const deptStmt = db.prepare('INSERT INTO departments (name, location, budget) VALUES (?, ?, ?)');
  departments.forEach(dept => {
    deptStmt.run(dept);
  });
  deptStmt.finalize();

  // Insert sample employees
  const employees = [
    ['John', 'Doe', 'john.doe@company.com', 1, 75000, '2020-01-15'],
    ['Jane', 'Smith', 'jane.smith@company.com', 1, 80000, '2019-03-20'],
    ['Mike', 'Johnson', 'mike.johnson@company.com', 2, 65000, '2021-06-10'],
    ['Sarah', 'Wilson', 'sarah.wilson@company.com', 2, 70000, '2020-11-05'],
    ['David', 'Brown', 'david.brown@company.com', 3, 60000, '2022-02-14'],
    ['Lisa', 'Davis', 'lisa.davis@company.com', 4, 55000, '2021-09-08']
  ];

  const empStmt = db.prepare('INSERT INTO employees (first_name, last_name, email, department_id, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?)');
  employees.forEach(emp => {
    empStmt.run(emp);
  });
  empStmt.finalize();

  // Insert sample sales
  const sales = [
    [1, 'Software License', 5, 1000, '2023-01-15'],
    [1, 'Consulting', 10, 150, '2023-01-20'],
    [3, 'Product A', 20, 50, '2023-02-01'],
    [3, 'Product B', 15, 75, '2023-02-10'],
    [4, 'Service Contract', 1, 5000, '2023-02-15'],
    [2, 'Software License', 3, 1000, '2023-03-01'],
    [5, 'Marketing Campaign', 1, 10000, '2023-03-05']
  ];

  const salesStmt = db.prepare('INSERT INTO sales (employee_id, product_name, quantity, unit_price, sale_date) VALUES (?, ?, ?, ?, ?)');
  sales.forEach(sale => {
    salesStmt.run(sale);
  });
  salesStmt.finalize();

  console.log('Sample database created successfully!');
  console.log('Tables created: departments, employees, sales');
  console.log('Sample data inserted');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed');
  }
});
