import { useState, useEffect, useCallback } from 'react';
import { initDatabase, executeQuery as execQuery } from '../data/database';

export const useSQL = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize database on mount
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await initDatabase();
        setIsReady(true);
      } catch (err) {
        setError(err.message);
        console.error('Database initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);
  
  // Execute query function
  const executeQuery = useCallback((query) => {
    if (!isReady) {
      return {
        success: false,
        data: null,
        error: 'Database not ready'
      };
    }
    
    return execQuery(query);
  }, [isReady]);
  
  // Parse query results for display
  const parseResults = useCallback((result) => {
    if (!result || !result.success || !result.data || result.data.length === 0) {
      return null;
    }
    
    const data = result.data[0];
    return {
      columns: data.columns,
      rows: data.values,
      rowCount: data.values.length
    };
  }, []);
  
  return {
    isReady,
    isLoading,
    error,
    executeQuery,
    parseResults
  };
};