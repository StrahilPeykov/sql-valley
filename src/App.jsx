import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { useSQL } from './hooks/useSQL';
import Header from './components/Layout/Header';
import SkillTree from './components/SkillTree/SkillTree';
import SQLEditor from './components/Editor/SQLEditor';
import QueryResults from './components/Editor/QueryResults';
import ExercisePanel from './components/Exercise/ExercisePanel';
import FeedbackPanel from './components/Feedback/FeedbackPanel';
import SchemaReference from './components/Exercise/SchemaReference';
import LoadingScreen from './components/UI/LoadingScreen';
import styles from './App.module.css';

// Main app content (wrapped by provider)
const AppContent = () => {
  const { 
    currentExercise,
    setFeedback,
    setQueryResult,
    setIsExecuting,
    completeExercise,
    userCode,
    setStreak
  } = useApp();
  
  const { isReady, isLoading, error, executeQuery, parseResults } = useSQL();
  
  // Handle query execution
  const handleExecute = async () => {
    if (!isReady) {
      setFeedback({
        type: 'error',
        message: 'Database is still loading. Please wait...'
      });
      return;
    }
    
    setIsExecuting(true);
    setFeedback(null);
    
    try {
      // Execute the query
      const result = executeQuery(userCode);
      
      if (!result.success) {
        setFeedback({
          type: 'error',
          message: `SQL Error: ${result.error}`
        });
        setQueryResult(null);
        setStreak(0);
      } else {
        const parsedResults = parseResults(result);
        
        if (!parsedResults) {
          setFeedback({
            type: 'warning',
            message: 'Query executed but returned no results.'
          });
          setQueryResult(null);
        } else {
          setQueryResult(parsedResults);
          
          // Check if the answer is correct
          const checkResult = currentExercise.checkFunction(parsedResults.rows);
          
          if (checkResult.success) {
            setFeedback({
              type: 'success',
              message: checkResult.message,
              bonusInfo: checkResult.bonusInfo
            });
            
            // Complete the exercise
            completeExercise(currentExercise.id, currentExercise.points);
          } else {
            setFeedback({
              type: 'warning',
              message: checkResult.message,
              hints: checkResult.hints
            });
            setStreak(0);
          }
        }
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Unexpected error: ${err.message}`
      });
      setQueryResult(null);
      setStreak(0);
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Show error if database failed to load
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Database Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.app}>
      <Header />
      
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <SkillTree />
          <ExercisePanel />
        </div>
        
        <div className={styles.rightPanel}>
          <SQLEditor onExecute={handleExecute} />
          <FeedbackPanel />
          <QueryResults />
        </div>
      </div>
      
      <SchemaReference />
    </div>
  );
};

// Root App component with provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;