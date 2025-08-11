import React from 'react';
import { BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Editor.module.css';

const QueryResults = () => {
  const { queryResult } = useApp();
  
  if (!queryResult) return null;
  
  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <h4 className={styles.resultsTitle}>
          <BookOpen size={18} />
          Query Results
        </h4>
        <span className={styles.rowCount}>
          {queryResult.rowCount} row{queryResult.rowCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {queryResult.columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queryResult.rows.slice(0, 100).map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{cell ?? 'NULL'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {queryResult.rowCount > 100 && (
          <div className={styles.moreRows}>
            ... and {queryResult.rowCount - 100} more rows
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryResults;