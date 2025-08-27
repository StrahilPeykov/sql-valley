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
import Tutorial from './components/Tutorial/Tutorial';
import LoadingScreen from './components/UI/LoadingScreen';
import Confetti from './components/UI/Confetti';

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
    resetCurrentExercise
  } = useApp();
  
  const { isReady, isLoading, error, executeQuery, parseResults } = useSQL();
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
          
          if (currentExercise.testCases) {
            const feedback = processQueryResults(
              currentExercise,
              parsedResults.rows,
              executionTime
            );
            
            setFeedback(feedback);
            
            if (feedback.score === 100 && !practiceMode) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
              
              let bonusPoints = 0;
              if (feedback.achievements) {
                bonusPoints = feedback.achievements.reduce((sum, a) => sum + a.points, 0);
              }
              
              completeExercise(currentExercise.id, currentExercise.points, bonusPoints);
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
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-tue-red mb-4">Database Error</h2>
        <p className="text-gray-800 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-tue-red text-white px-6 py-2.5 rounded font-medium hover:bg-tue-red-dark transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }
  
  if (showTutorial) {
    return <Tutorial onComplete={completeTutorial} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showConfetti && <Confetti />}
      
      <Header />
      
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-5 py-5 gap-5 items-start">
        {/* Sidebar - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:flex w-80 flex-col gap-4 flex-shrink-0">
          <SkillTree />
          <SchemaReference />
        </div>
        
        {/* Mobile Layout - Sidebar on top */}
        <div className="lg:hidden w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkillTree />
            <SchemaReference />
          </div>
          <ExercisePanel />
          <SQLEditor onExecute={handleExecute} />
          <FeedbackPanel />
          <QueryResults />
        </div>
        
        {/* Desktop Main Content */}
        <div className="hidden lg:flex flex-1 flex-col gap-4 min-w-0">
          <ExercisePanel />
          <SQLEditor onExecute={handleExecute} />
          <FeedbackPanel />
          <QueryResults />
        </div>
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