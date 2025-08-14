import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Exercise.module.css';

const SchemaReference = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const tables = [
    {
      name: 'customer',
      columns: [
        'cID (INTEGER) - PK',
        'cName (TEXT)',
        'street (TEXT)',
        'city (TEXT)'
      ]
    },
    {
      name: 'store',
      columns: [
        'sID (INTEGER) - PK',
        'sName (TEXT)',
        'street (TEXT)',
        'city (TEXT)'
      ]
    },
    {
      name: 'product',
      columns: [
        'pID (INTEGER) - PK',
        'pName (TEXT)',
        'suffix (TEXT)'
      ]
    },
    {
      name: 'shoppinglist',
      columns: [
        'cID (INTEGER) - FK',
        'pID (INTEGER) - FK',
        'quantity (INTEGER)',
        'date (DATE)'
      ]
    },
    {
      name: 'purchase',
      columns: [
        'tID (INTEGER) - PK',
        'cID (INTEGER) - FK',
        'sID (INTEGER) - FK',
        'pID (INTEGER) - FK',
        'date (DATE)',
        'quantity (INTEGER)',
        'price (REAL)'
      ]
    },
    {
      name: 'inventory',
      columns: [
        'sID (INTEGER) - FK',
        'pID (INTEGER) - FK',
        'date (DATE)',
        'quantity (INTEGER)',
        'unit_price (REAL)'
      ]
    }
  ];
  
  return (
    <div className={styles.schemaPanel}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.schemaHeader}
        aria-expanded={isExpanded}
      >
        <div className={styles.schemaTitle}>
          <Database size={16} />
          <h3>Database Schema</h3>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div className={styles.schemaContent}>
          <div className={styles.schemaGrid}>
            {tables.map((table) => (
              <div key={table.name} className={styles.table}>
                <h4>{table.name}</h4>
                <ul>
                  {table.columns.map((column, idx) => (
                    <li key={idx}>{column}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaReference;