import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { useSQL } from './hooks/useSQL';
import { calculateScore, generateDetailedFeedback } from './data/exercises';
import Header from './components/Layout/Header';
import SkillTree from './components/SkillTree/SkillTree';
import SQLEditor from './components/Editor/SQLEditor';
import QueryResults from './components/Editor/QueryResults';
import ExercisePanel from './components/Exercise/ExercisePanel';
import FeedbackPanel from './components/Feedback/FeedbackPanel';
import SchemaReference from './components/Exercise/SchemaReference';
import AchievementPanel from './components/Achievements/AchievementPanel';
import Tutorial from './components/Tutorial/Tutorial';
import LoadingScreen from './components/UI/LoadingScreen';
import Confetti from './components/UI/Confetti';
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
    setStreak,
    processQueryResults,
    practiceMode,
    showTutorial,
    completeTutorial,
    resetProgress,
    resetCurrentExercise
  } = useApp();
  
  const { isReady, isLoading, error, executeQuery, parseResults } = useSQL();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [executionStartTime, setExecutionStartTime] = useState(null);
  
  // Handle query execution with enhanced feedback
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
    setExecutionStartTime(Date.now());
    
    try {
      // Execute the query
      const result = executeQuery(userCode);
      const executionTime = Date.now() - executionStartTime;
      
      if (!result.success) {
        setFeedback({
          type: 'error',
          message: `SQL Error: ${result.error}`,
          suggestions: getSyntaxSuggestions(result.error)
        });
        setQueryResult(null);
        setStreak(0);
      } else {
        const parsedResults = parseResults(result);
        
        if (!parsedResults) {
          setFeedback({
            type: 'warning',
            message: 'Query executed but returned no results.',
            suggestions: ['Check if your table names are correct', 'Verify your WHERE conditions']
          });
          setQueryResult(null);
        } else {
          setQueryResult(parsedResults);
          
          // Process test results for educational feedback
          if (currentExercise.testCases) {
            const feedback = processQueryResults(
              currentExercise,
              parsedResults.rows,
              executionTime
            );
            
            setFeedback(feedback);
            
            if (feedback.score === 100 && !practiceMode) {
              // Perfect score!
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
              
              // Calculate bonus points
              let bonusPoints = 0;
              if (feedback.achievements) {
                bonusPoints = feedback.achievements.reduce((sum, a) => sum + a.points, 0);
              }
              
              completeExercise(currentExercise.id, currentExercise.points, bonusPoints);
              
              // Update streak
              setStreak(prev => prev + 1);
            } else if (feedback.score < 100) {
              setStreak(0);
            }
          }
        }
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Unexpected error: ${err.message}`,
        suggestions: ['Check your SQL syntax', 'Make sure all table names are correct']
      });
      setQueryResult(null);
      setStreak(0);
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Get syntax suggestions based on error
  const getSyntaxSuggestions = (error) => {
    const suggestions = [];
    
    if (error.includes('syntax')) {
      suggestions.push('Check for missing keywords like SELECT, FROM, WHERE');
      suggestions.push('Verify parentheses and quotes are balanced');
    }
    if (error.includes('no such table')) {
      suggestions.push('Table names are case-sensitive');
      suggestions.push('Available tables: employees, departments, projects');
    }
    if (error.includes('no such column')) {
      suggestions.push('Column names are case-sensitive');
      suggestions.push('Use the Schema Reference to check column names');
    }
    if (error.includes('ambiguous')) {
      suggestions.push('Use table aliases to specify which table a column belongs to');
      suggestions.push('Example: employees.name or e.name');
    }
    
    return suggestions;
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K: Toggle achievements
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowAchievements(prev => !prev);
      }
      
      // Ctrl/Cmd + R: Reset current exercise (when not in input)
      if ((e.ctrlKey || e.metaKey) && e.key === 'r' && 
          !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        if (window.confirm('Reset current exercise?')) {
          resetCurrentExercise();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resetCurrentExercise]);
  
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
  
  // Show tutorial for first-time users
  if (showTutorial) {
    return <Tutorial onComplete={completeTutorial} />;
  }
  
  return (
    <div className={styles.app}>
      {showConfetti && <Confetti />}
      
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
      
      <AchievementPanel 
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
      
      {/* Quick Actions Bar */}
      <div className={styles.quickActions}>
        <button 
          className={styles.quickAction}
          onClick={() => setShowAchievements(true)}
          title="Achievements (Ctrl+K)"
        >
          🏆
        </button>
        <button 
          className={styles.quickAction}
          onClick={() => window.open('https://www.w3schools.com/sql/', '_blank')}
          title="SQL Reference"
        >
          📚
        </button>
      </div>
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