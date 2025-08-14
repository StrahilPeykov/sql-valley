// Database initialization and management
let SQL = null;
let db = null;

// Load SQL.js library
export const initSqlJsLibrary = async () => {
  if (SQL) return SQL;
  
  try {
    // Load SQL.js from CDN (more reliable than bundled version)
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js';
    document.head.appendChild(script);
    
    return new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          SQL = await window.initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`
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

// Initialize database with sample data - Based on the shopping database used in TU/e 2ID50
export const initDatabase = async () => {
  if (db) return db;
  
  try {
    const sqlJs = await initSqlJsLibrary();
    const database = new sqlJs.Database();
    
    // Create schema based on 2ID50 shopping database
    database.run(`
      -- Customer table
      CREATE TABLE customer (
        cID INTEGER PRIMARY KEY,
        cName TEXT NOT NULL,
        street TEXT NOT NULL,
        city TEXT NOT NULL
      );
      
      -- Store table
      CREATE TABLE store (
        sID INTEGER PRIMARY KEY,
        sName TEXT NOT NULL,
        street TEXT NOT NULL,
        city TEXT NOT NULL
      );
      
      -- Product table
      CREATE TABLE product (
        pID INTEGER PRIMARY KEY,
        pName TEXT NOT NULL,
        suffix TEXT
      );
      
      -- Shopping list table
      CREATE TABLE shoppinglist (
        cID INTEGER NOT NULL,
        pID INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        date DATE NOT NULL,
        PRIMARY KEY (cID, pID, date),
        FOREIGN KEY (cID) REFERENCES customer(cID),
        FOREIGN KEY (pID) REFERENCES product(pID)
      );
      
      -- Purchase table (transactions)
      CREATE TABLE purchase (
        tID INTEGER PRIMARY KEY,
        cID INTEGER NOT NULL,
        sID INTEGER NOT NULL,
        pID INTEGER NOT NULL,
        date DATE NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (cID) REFERENCES customer(cID),
        FOREIGN KEY (sID) REFERENCES store(sID),
        FOREIGN KEY (pID) REFERENCES product(pID)
      );
      
      -- Inventory table
      CREATE TABLE inventory (
        sID INTEGER NOT NULL,
        pID INTEGER NOT NULL,
        date DATE NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        PRIMARY KEY (sID, pID, date),
        FOREIGN KEY (sID) REFERENCES store(sID),
        FOREIGN KEY (pID) REFERENCES product(pID)
      );
      
      -- Create indexes for better performance
      CREATE INDEX idx_purchase_customer ON purchase(cID);
      CREATE INDEX idx_purchase_store ON purchase(sID);
      CREATE INDEX idx_purchase_date ON purchase(date);
      CREATE INDEX idx_inventory_store ON inventory(sID);
    `);
    
    // Insert sample data with Dutch/European context
    database.run(`
      -- Insert customers (mix of Dutch and international names reflecting TU/e diversity)
      INSERT INTO customer (cID, cName, street, city) VALUES 
        (1, 'Emma van der Berg', 'Dommelstraat 12', 'Eindhoven'),
        (2, 'Liam Chen', 'Pastoriestraat 45', 'Eindhoven'),
        (3, 'Sophie Mueller', 'Keizersgracht 78', 'Amsterdam'),
        (4, 'James Anderson', 'Wilhelminalaan 23', 'Eindhoven'),
        (5, 'Fatima Al-Rashid', 'Stratumseind 156', 'Eindhoven'),
        (6, 'Lucas Janssen', 'Markt 34', 'Utrecht'),
        (7, 'Priya Sharma', 'Beukenlaan 89', 'Eindhoven'),
        (8, 'Marco Rossi', 'Nieuwe Gracht 67', 'Delft');
      
      -- Insert stores (Dutch supermarket chains)
      INSERT INTO store (sID, sName, street, city) VALUES 
        (1, 'Albert Heijn', 'Piazza Center', 'Eindhoven'),
        (2, 'Jumbo', 'Winkelcentrum Woensel', 'Eindhoven'),
        (3, 'Albert Heijn', 'Damrak 90', 'Amsterdam'),
        (4, 'PLUS', 'Hoogstraat 45', 'Eindhoven'),
        (5, 'Lidl', 'Europalaan 12', 'Utrecht'),
        (6, 'Jumbo', 'Mekelpark 8', 'Delft'),
        (7, 'Coop', 'Marktstraat 23', 'Eindhoven');
      
      -- Insert products (typical Dutch/European groceries)
      INSERT INTO product (pID, pName, suffix) VALUES
        (1, 'Gouda Cheese', '250g'),
        (2, 'Stroopwafels', 'pack of 8'),
        (3, 'Heineken Beer', '6-pack'),
        (4, 'Hagelslag', 'milk chocolate 400g'),
        (5, 'Douwe Egberts Coffee', '500g'),
        (6, 'Albert Heijn Bread', 'whole wheat'),
        (7, 'Tony Chocolonely', 'milk chocolate 180g'),
        (8, 'Milk', '1L carton'),
        (9, 'Bananas', 'per kg'),
        (10, 'Pasta', 'penne 500g'),
        (11, 'Tomatoes', 'cherry 250g'),
        (12, 'Yogurt', 'Greek style 500g');
      
      -- Insert shopping lists (what people plan to buy)
      INSERT INTO shoppinglist (cID, pID, quantity, date) VALUES
        (1, 1, 2, '2024-08-10'),
        (1, 5, 1, '2024-08-10'),
        (1, 8, 1, '2024-08-10'),
        (2, 3, 1, '2024-08-10'),
        (2, 7, 2, '2024-08-10'),
        (3, 2, 1, '2024-08-11'),
        (3, 4, 1, '2024-08-11'),
        (4, 6, 2, '2024-08-11'),
        (4, 8, 2, '2024-08-11'),
        (5, 9, 2, '2024-08-12'),
        (5, 10, 1, '2024-08-12'),
        (1, 9, 1, '2024-08-13'),
        (1, 11, 1, '2024-08-13');
      
      -- Insert purchases (actual transactions)
      INSERT INTO purchase (tID, cID, sID, pID, date, quantity, price) VALUES
        (1, 1, 1, 1, '2024-08-10', 2, 7.98),
        (2, 1, 1, 5, '2024-08-10', 1, 4.49),
        (3, 1, 1, 8, '2024-08-10', 1, 1.35),
        (4, 2, 2, 3, '2024-08-10', 1, 8.99),
        (5, 2, 2, 7, '2024-08-10', 1, 3.79),
        (6, 3, 3, 2, '2024-08-11', 1, 2.89),
        (7, 3, 3, 4, '2024-08-11', 1, 2.15),
        (8, 4, 1, 6, '2024-08-11', 2, 3.18),
        (9, 4, 1, 8, '2024-08-11', 2, 2.70),
        (10, 5, 4, 9, '2024-08-12', 2, 3.58),
        (11, 5, 4, 10, '2024-08-12', 1, 1.89),
        (12, 1, 2, 9, '2024-08-13', 1, 1.79),
        (13, 1, 2, 11, '2024-08-13', 1, 2.49);
      
      -- Insert inventory (what stores have in stock)
      INSERT INTO inventory (sID, pID, date, quantity, unit_price) VALUES
        -- Albert Heijn Eindhoven
        (1, 1, '2024-08-10', 50, 3.99),
        (1, 2, '2024-08-10', 30, 2.89),
        (1, 5, '2024-08-10', 25, 4.49),
        (1, 6, '2024-08-10', 40, 1.59),
        (1, 8, '2024-08-10', 100, 1.35),
        (1, 9, '2024-08-10', 80, 1.79),
        (1, 11, '2024-08-10', 60, 2.49),
        
        -- Jumbo Eindhoven  
        (2, 3, '2024-08-10', 20, 8.99),
        (2, 7, '2024-08-10', 15, 3.79),
        (2, 8, '2024-08-10', 75, 1.29),
        (2, 9, '2024-08-10', 70, 1.79),
        (2, 10, '2024-08-10', 35, 1.99),
        (2, 11, '2024-08-10', 45, 2.49),
        
        -- Albert Heijn Amsterdam
        (3, 1, '2024-08-11', 35, 4.19),
        (3, 2, '2024-08-11', 25, 2.89),
        (3, 4, '2024-08-11', 40, 2.15),
        (3, 8, '2024-08-11', 90, 1.39),
        
        -- PLUS Eindhoven
        (4, 9, '2024-08-12', 60, 1.79),
        (4, 10, '2024-08-12', 30, 1.89),
        (4, 12, '2024-08-12', 20, 3.49);
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