import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Exercise.module.css';

const SchemaReference = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const tables = [
    {
      name: 'employees',
      columns: [
        'id (INTEGER, PK)',
        'name (TEXT)',
        'department (TEXT)',
        'salary (INTEGER)',
        'hire_date (DATE)',
        'manager_id (INTEGER, FK)'
      ]
    },
    {
      name: 'departments',
      columns: [
        'id (INTEGER, PK)',
        'name (TEXT)',
        'budget (INTEGER)',
        'location (TEXT)'
      ]
    },
    {
      name: 'projects',
      columns: [
        'id (INTEGER, PK)',
        'name (TEXT)',
        'department_id (INTEGER, FK)',
        'budget (INTEGER)',
        'status (TEXT)',
        'start_date (DATE)',
        'end_date (DATE)'
      ]
    }
  ];
  
  return (
    <div className={styles.schemaPanel}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.schemaHeader}
        aria-expanded={isExpanded}
        aria-controls="schema-content"
      >
        <div className={styles.schemaTitle}>
          <Database size={20} />
          <h3>Database Schema Reference</h3>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div id="schema-content" className={styles.schemaContent}>
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