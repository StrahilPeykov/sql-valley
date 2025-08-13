/**
 * SQL Valley App Context
 * 
 * Practice Mode Behavior:
 * - Entering practice mode: Saves current exercise and code, loads fresh initial code
 * - In practice mode: Code changes are temporary and not saved to localStorage  
 * - Switching exercises in practice mode: Always starts with fresh initial code
 * - Exiting practice mode: Restores original exercise and code from before practice
 * - Practice mode is completely isolated from real progress tracking
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { exercises, calculateScore, generateDetailedFeedback, exerciseUtils } from '../data/exercises';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // User Progress State
  const [currentExerciseId, setCurrentExerciseId] = useState(1);
  const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem('completedExercises');
    return saved ? JSON.parse(saved) : [];
  });
  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem('totalPoints');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [userLevel, setUserLevel] = useState(() => {
    const saved = localStorage.getItem('userLevel');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [streak, setStreak] = useState(0);
  const [exerciseAttempts, setExerciseAttempts] = useState(() => {
    const saved = localStorage.getItem('exerciseAttempts');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Achievement System (simplified)
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('unlockedBadges');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });
  
  // UI State
  const [feedback, setFeedback] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [prePracticeExerciseId, setPrePracticeExerciseId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(() => {
    const saved = localStorage.getItem('tutorialCompleted');
    return !saved;
  });
  
  // Code State
  const [userCode, setUserCode] = useState('');
  const [practiceCode, setPracticeCode] = useState('');
  const [prePracticeCode, setPrePracticeCode] = useState('');
  const [executionHistory, setExecutionHistory] = useState([]);
  const [savedQueries, setSavedQueries] = useState(() => {
    const saved = localStorage.getItem('savedQueries');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Statistics
  const [statistics, setStatistics] = useState(() => {
    const saved = localStorage.getItem('statistics');
    return saved ? JSON.parse(saved) : {
      totalQueries: 0,
      successfulQueries: 0,
      totalTime: 0,
      perfectScores: 0,
      lastActiveDate: new Date().toISOString()
    };
  });
  
  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
  }, [completedExercises]);
  
  useEffect(() => {
    localStorage.setItem('totalPoints', totalPoints.toString());
  }, [totalPoints]);
  
  useEffect(() => {
    localStorage.setItem('userLevel', userLevel.toString());
  }, [userLevel]);
  
  useEffect(() => {
    localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);
  
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('exerciseAttempts', JSON.stringify(exerciseAttempts));
  }, [exerciseAttempts]);
  
  useEffect(() => {
    localStorage.setItem('statistics', JSON.stringify(statistics));
  }, [statistics]);
  
  useEffect(() => {
    localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
  }, [savedQueries]);
  
  // Get current exercise
  const currentExercise = exercises.find(ex => ex.id === currentExerciseId) || exercises[0];
  
  // Initialize exercise code when exercise changes - SMART VERSION with practice mode handling
  useEffect(() => {
    if (currentExercise) {
      // In practice mode, don't auto-load saved code
      if (practiceMode) {
        // Practice mode handles its own code loading in selectExercise and togglePracticeMode
        return;
      }
      
      // Normal mode: Check if we have saved code for this exercise
      const savedCode = savedQueries[currentExerciseId];
      if (savedCode) {
        // Restore saved code
        setUserCode(savedCode);
      } else {
        // Use initial code for new exercises
        setUserCode(currentExercise.initialCode || '-- Write your SQL query here\n\n');
      }
      setFeedback(null);
      setQueryResult(null);
    }
  }, [currentExerciseId, savedQueries, practiceMode, currentExercise]);
  
  // Save user code whenever it changes (with debouncing) - BUT NOT IN PRACTICE MODE
  useEffect(() => {
    if (userCode && currentExerciseId && !practiceMode) {
      const timeoutId = setTimeout(() => {
        setSavedQueries(prev => ({
          ...prev,
          [currentExerciseId]: userCode
        }));
      }, 1000); // Save after 1 second of no typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [userCode, currentExerciseId, practiceMode]);
  
  // Initialize on first load if no code exists
  useEffect(() => {
    if (currentExercise && !userCode) {
      const savedCode = savedQueries[currentExerciseId];
      if (!savedCode) {
        setUserCode(currentExercise.initialCode || '-- Write your SQL query here\n\n');
      }
    }
  }, []);
  
  // Check if exercise is unlocked
  const isExerciseUnlocked = useCallback((exerciseId) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return false;
    
    // First exercise is always unlocked
    if (exerciseId === 1) return true;
    
    // Check prerequisites
    if (exercise.prerequisites) {
      return exercise.prerequisites.every(prereqId => 
        completedExercises.includes(prereqId)
      );
    }
    
    return true;
  }, [completedExercises]);
  
  // Select exercise
  const selectExercise = useCallback((exerciseId) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentExerciseId(exerciseId);
      
      // In practice mode, always start with fresh initial code
      if (practiceMode) {
        const initialCode = exercise.initialCode || '-- Write your SQL query here\n\n';
        setPracticeCode(initialCode);
        setUserCode(initialCode);
        setFeedback(null);
        setQueryResult(null);
      }
      
      // Track attempt (only for non-practice mode)
      if (!practiceMode) {
        setExerciseAttempts(prev => ({
          ...prev,
          [exerciseId]: (prev[exerciseId] || 0) + 1
        }));
      }
    }
  }, [practiceMode]);
  
  // Process test results and generate feedback
  const processQueryResults = useCallback((exercise, result, executionTime) => {
    const testResults = exercise.testCases.map(test => ({
      name: test.name,
      weight: test.weight,
      passed: test.check(result),
      feedback: test.feedback
    }));
    
    const detailedFeedback = generateDetailedFeedback(
      exercise, 
      testResults, 
      userCode, 
      executionTime
    );
    
    // Update statistics
    setStatistics(prev => ({
      ...prev,
      totalQueries: prev.totalQueries + 1,
      successfulQueries: detailedFeedback.passed ? prev.successfulQueries + 1 : prev.successfulQueries,
      totalTime: prev.totalTime + executionTime,
      perfectScores: detailedFeedback.score === 100 ? prev.perfectScores + 1 : prev.perfectScores,
      lastActiveDate: new Date().toISOString()
    }));
    
    return detailedFeedback;
  }, [userCode]);
  
  // Complete exercise
  const completeExercise = useCallback((exerciseId, points, bonusPoints = 0) => {
    if (!completedExercises.includes(exerciseId) && !practiceMode) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // Add points (no hint penalties since we removed hints)
      const finalPoints = points + bonusPoints;
      setTotalPoints(prev => prev + finalPoints);
      setStreak(prev => prev + 1);
      
      // Check for badges
      const exercise = exercises.find(e => e.id === exerciseId);
      if (exercise && exercise.badges) {
        exercise.badges.forEach(badge => {
          if (!unlockedBadges.includes(badge.id)) {
            setUnlockedBadges(prev => [...prev, badge.id]);
            setAchievements(prev => [...prev, {
              type: 'badge',
              badge: badge,
              timestamp: new Date().toISOString()
            }]);
          }
        });
      }
    }
  }, [completedExercises, practiceMode, unlockedBadges]);
  
  // Reset current exercise
  const resetCurrentExercise = useCallback(() => {
    if (currentExercise && currentExercise.initialCode) {
      setUserCode(currentExercise.initialCode);
      
      // In practice mode, also update practice code
      if (practiceMode) {
        setPracticeCode(currentExercise.initialCode);
      } else {
        // Clear saved code for this exercise so it starts fresh next time
        setSavedQueries(prev => {
          const updated = { ...prev };
          delete updated[currentExerciseId];
          return updated;
        });
      }
    }
    setFeedback(null);
    setQueryResult(null);
  }, [currentExercise, currentExerciseId, practiceMode]);
  
  // BEST PRACTICE: Toggle practice mode with smart exercise management AND isolated code
  const togglePracticeMode = useCallback(() => {
    setPracticeMode(prev => {
      const newPracticeMode = !prev;
      
      // Entering practice mode
      if (!prev && newPracticeMode) {
        // Remember current exercise and code to return to later
        setPrePracticeExerciseId(currentExerciseId);
        setPrePracticeCode(userCode);
        
        // Initialize practice code with current exercise's initial code
        const currentExerciseInitialCode = currentExercise?.initialCode || '-- Write your SQL query here\n\n';
        setPracticeCode(currentExerciseInitialCode);
        setUserCode(currentExerciseInitialCode);
        
        setFeedback(null);
        setQueryResult(null);
      }
      // Exiting practice mode
      else if (prev && !newPracticeMode) {
        // Restore original exercise and code
        if (prePracticeExerciseId && isExerciseUnlocked(prePracticeExerciseId)) {
          setCurrentExerciseId(prePracticeExerciseId);
          setUserCode(prePracticeCode);
        }
        // Fallback: current exercise if accessible, but restore its saved code
        else if (isExerciseUnlocked(currentExerciseId)) {
          const savedCode = savedQueries[currentExerciseId];
          const initialCode = currentExercise?.initialCode || '-- Write your SQL query here\n\n';
          setUserCode(savedCode || initialCode);
        }
        // Fallback: highest unlocked exercise
        else {
          const unlockedExercises = exercises.filter(ex => isExerciseUnlocked(ex.id));
          const highestUnlocked = unlockedExercises.reduce((highest, ex) => 
            ex.id > highest.id ? ex : highest, unlockedExercises[0]
          );
          if (highestUnlocked) {
            setCurrentExerciseId(highestUnlocked.id);
            const savedCode = savedQueries[highestUnlocked.id];
            const initialCode = highestUnlocked.initialCode || '-- Write your SQL query here\n\n';
            setUserCode(savedCode || initialCode);
          }
        }
        
        // Clear practice mode memory
        setPrePracticeExerciseId(null);
        setPrePracticeCode('');
        setPracticeCode('');
        setFeedback(null);
        setQueryResult(null);
      }
      
      return newPracticeMode;
    });
  }, [currentExerciseId, currentExercise, prePracticeExerciseId, prePracticeCode, userCode, isExerciseUnlocked, savedQueries]);
  
  // Get next recommended exercise
  const getNextExercise = useCallback(() => {
    return exerciseUtils.getNextExercise(currentExerciseId, completedExercises);
  }, [currentExerciseId, completedExercises]);
  
  // Reset all progress
  const resetProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setCompletedExercises([]);
      setTotalPoints(0);
      setUserLevel(1);
      setUnlockedBadges([]);
      setAchievements([]);
      setExerciseAttempts({});
      setStatistics({
        totalQueries: 0,
        successfulQueries: 0,
        totalTime: 0,
        perfectScores: 0,
        lastActiveDate: new Date().toISOString()
      });
      setSavedQueries({}); // Clear all saved code
      setPrePracticeExerciseId(null); // Clear practice mode memory
      setPrePracticeCode(''); // Clear practice mode code memory
      setPracticeCode(''); // Clear current practice code
      setPracticeMode(false); // Exit practice mode
      localStorage.clear();
      
      // Reset to first exercise
      selectExercise(1);
    }
  }, [selectExercise]);
  
  // Complete tutorial
  const completeTutorial = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem('tutorialCompleted', 'true');
  }, []);
  
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (completedExercises.length / exercises.length) * 100
  );
  
  const value = {
    // State
    currentExercise,
    currentExerciseId,
    completedExercises,
    totalPoints,
    userLevel,
    streak,
    feedback,
    queryResult,
    isExecuting,
    userCode,
    progressPercentage,
    practiceMode,
    showTutorial,
    unlockedBadges,
    achievements,
    statistics,
    exerciseAttempts,
    savedQueries,
    executionHistory,
    
    // Actions
    selectExercise,
    completeExercise,
    resetCurrentExercise,
    isExerciseUnlocked,
    setFeedback,
    setQueryResult,
    setIsExecuting,
    setUserCode,
    setStreak,
    processQueryResults,
    togglePracticeMode,
    getNextExercise,
    resetProgress,
    completeTutorial,
    setExecutionHistory,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};