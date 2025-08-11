// Database initialization and management
let SQL = null;
let db = null;

// Load SQL.js library
export const initSqlJs = async () => {
  if (SQL) return SQL;
  
  try {
    // Dynamically load SQL.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
    document.head.appendChild(script);
    
    return new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          SQL = await window.initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
          });
          resolve(SQL);
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = reject;
    });
  } catch (error) {
    console.error('Failed to load SQL.js:', error);
    throw error;
  }
};

// Initialize database with sample data
export const initDatabase = async () => {
  if (db) return db;
  
  try {
    const sqlJs = await initSqlJs();
    const database = new sqlJs.Database();
    
    // Create schema
    database.run(`
      -- Employees table
      CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL,
        hire_date DATE NOT NULL,
        manager_id INTEGER,
        FOREIGN KEY (manager_id) REFERENCES employees(id)
      );
      
      -- Departments table
      CREATE TABLE departments (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        budget INTEGER NOT NULL,
        location TEXT NOT NULL
      );
      
      -- Projects table
      CREATE TABLE projects (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        department_id INTEGER NOT NULL,
        budget INTEGER NOT NULL,
        status TEXT CHECK(status IN ('Planning', 'Active', 'Completed', 'On Hold')),
        start_date DATE,
        end_date DATE,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      );
      
      -- Create indexes for better performance
      CREATE INDEX idx_employees_department ON employees(department);
      CREATE INDEX idx_employees_salary ON employees(salary);
      CREATE INDEX idx_projects_status ON projects(status);
    `);
    
    // Insert sample data
    database.run(`
      -- Insert departments
      INSERT INTO departments (id, name, budget, location) VALUES 
        (1, 'Engineering', 500000, 'Building A'),
        (2, 'Marketing', 300000, 'Building B'),
        (3, 'HR', 200000, 'Building A'),
        (4, 'Sales', 400000, 'Building C');
      
      -- Insert employees
      INSERT INTO employees (id, name, department, salary, hire_date, manager_id) VALUES 
        (1, 'Alice Johnson', 'Engineering', 95000, '2020-01-15', NULL),
        (2, 'Bob Smith', 'Engineering', 85000, '2020-03-20', 1),
        (3, 'Carol White', 'Marketing', 75000, '2019-06-10', NULL),
        (4, 'David Brown', 'Marketing', 65000, '2021-02-01', 3),
        (5, 'Eve Davis', 'HR', 70000, '2018-11-30', NULL),
        (6, 'Frank Miller', 'Engineering', 90000, '2019-09-15', 1),
        (7, 'Grace Wilson', 'Sales', 80000, '2020-07-22', NULL),
        (8, 'Henry Taylor', 'Sales', 72000, '2021-01-10', 7);
      
      -- Insert projects
      INSERT INTO projects (id, name, department_id, budget, status, start_date, end_date) VALUES
        (1, 'Project Alpha', 1, 150000, 'Active', '2024-01-01', NULL),
        (2, 'Project Beta', 1, 200000, 'Completed', '2023-06-01', '2024-03-31'),
        (3, 'Campaign 2024', 2, 50000, 'Active', '2024-02-15', NULL),
        (4, 'Sales Drive Q4', 4, 75000, 'Planning', NULL, NULL),
        (5, 'Training Program', 3, 30000, 'On Hold', '2024-03-01', NULL);
    `);
    
    db = database;
    return database;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Execute SQL query
export const executeQuery = (query) => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const result = db.exec(query);
    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
};

// Get database schema information
export const getSchemaInfo = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  try {
    const tables = db.exec(`
      SELECT name, sql 
      FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    return tables[0]?.values || [];
  } catch (error) {
    console.error('Failed to get schema info:', error);
    return [];
  }
};

// Reset database to initial state
export const resetDatabase = async () => {
  db = null;
  return initDatabase();
};

// Export database instance for advanced use
export const getDatabase = () => db;