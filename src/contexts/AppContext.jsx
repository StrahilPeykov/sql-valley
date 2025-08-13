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
  
  // Achievement System
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('unlockedBadges');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });
  
  // UI State
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    const saved = localStorage.getItem('tutorialCompleted');
    return !saved;
  });
  
  // Code State
  const [userCode, setUserCode] = useState('');
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
      hintsUsedTotal: 0,
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
  
  // Calculate user level based on points
  const calculateLevel = useCallback((points) => {
    if (points < 50) return 1;
    if (points < 100) return 2;
    if (points < 200) return 3;
    if (points < 350) return 4;
    if (points < 500) return 5;
    return Math.floor(points / 100);
  }, []);
  
  // Select exercise
  const selectExercise = useCallback((exerciseId) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentExerciseId(exerciseId);
      setUserCode(exercise.initialCode);
      setFeedback(null);
      setQueryResult(null);
      setShowHint(false);
      setHintsUsed(0);
      
      // Track attempt
      setExerciseAttempts(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || 0) + 1
      }));
    }
  }, []);
  
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
  
  // Complete exercise with achievements
  const completeExercise = useCallback((exerciseId, points, bonusPoints = 0) => {
    if (!completedExercises.includes(exerciseId) && !practiceMode) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // Calculate final points (with hint penalty)
      const exercise = exercises.find(e => e.id === exerciseId);
      let finalPoints = points + bonusPoints;
      
      if (exercise && exercise.hints && hintsUsed > 0) {
        const penalty = exercise.hints.slice(0, hintsUsed).reduce((sum, hint) => sum + hint.penalty, 0);
        finalPoints = Math.max(points * 0.5, points - penalty); // Minimum 50% points
      }
      
      setTotalPoints(prev => {
        const newTotal = prev + finalPoints;
        setUserLevel(calculateLevel(newTotal));
        return newTotal;
      });
      
      setStreak(prev => prev + 1);
      
      // Check for badges
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
      
      // Check for milestone achievements
      checkMilestoneAchievements(completedExercises.length + 1, totalPoints + finalPoints);
    }
  }, [completedExercises, practiceMode, hintsUsed, totalPoints, unlockedBadges, calculateLevel]);
  
  // Check milestone achievements
  const checkMilestoneAchievements = useCallback((exerciseCount, points) => {
    const milestones = [
      { count: 1, name: "First Steps", description: "Complete your first exercise", icon: "👶" },
      { count: 3, name: "Getting Started", description: "Complete 3 exercises", icon: "🚀" },
      { count: 5, name: "Halfway There", description: "Complete 5 exercises", icon: "⭐" },
      { count: exercises.length, name: "SQL Master", description: "Complete all exercises", icon: "🏆" }
    ];
    
    const pointMilestones = [
      { points: 50, name: "Point Collector", description: "Earn 50 points", icon: "💰" },
      { points: 100, name: "Century Club", description: "Earn 100 points", icon: "💯" },
      { points: 200, name: "High Achiever", description: "Earn 200 points", icon: "🎯" }
    ];
    
    milestones.forEach(milestone => {
      if (exerciseCount === milestone.count) {
        const achievementId = `milestone_${milestone.count}`;
        if (!achievements.some(a => a.id === achievementId)) {
          setAchievements(prev => [...prev, {
            id: achievementId,
            type: 'milestone',
            name: milestone.name,
            description: milestone.description,
            icon: milestone.icon,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    });
    
    pointMilestones.forEach(milestone => {
      if (points >= milestone.points) {
        const achievementId = `points_${milestone.points}`;
        if (!achievements.some(a => a.id === achievementId)) {
          setAchievements(prev => [...prev, {
            id: achievementId,
            type: 'points',
            name: milestone.name,
            description: milestone.description,
            icon: milestone.icon,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    });
  }, [achievements, exercises.length]);
  
  // Reset current exercise
  const resetCurrentExercise = useCallback(() => {
    setUserCode(currentExercise.initialCode);
    setFeedback(null);
    setQueryResult(null);
    setShowHint(false);
    setHintsUsed(0);
  }, [currentExercise]);
  
  // Use hint
  const useHint = useCallback((level = 1) => {
    const exercise = currentExercise;
    if (exercise && exercise.hints && level <= exercise.hints.length) {
      setShowHint(true);
      setHintsUsed(level);
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        hintsUsedTotal: prev.hintsUsedTotal + 1
      }));
    }
  }, [currentExercise]);
  
  // Save query
  const saveQuery = useCallback((name, query) => {
    setSavedQueries(prev => ({
      ...prev,
      [currentExerciseId]: {
        ...prev[currentExerciseId],
        [name]: {
          query,
          timestamp: new Date().toISOString()
        }
      }
    }));
  }, [currentExerciseId]);
  
  // Load saved query
  const loadSavedQuery = useCallback((exerciseId, name) => {
    const saved = savedQueries[exerciseId]?.[name];
    if (saved) {
      setUserCode(saved.query);
    }
  }, [savedQueries]);
  
  // Toggle practice mode
  const togglePracticeMode = useCallback(() => {
    setPracticeMode(prev => !prev);
    if (practiceMode) {
      // Exiting practice mode
      setFeedback(null);
      setQueryResult(null);
    }
  }, [practiceMode]);
  
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
        hintsUsedTotal: 0,
        lastActiveDate: new Date().toISOString()
      });
      setSavedQueries({});
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
  
  // Calculate experience to next level
  const getExperienceProgress = useCallback(() => {
    const levelThresholds = [0, 50, 100, 200, 350, 500];
    const currentThreshold = levelThresholds[userLevel - 1] || 0;
    const nextThreshold = levelThresholds[userLevel] || (userLevel * 100);
    const progress = totalPoints - currentThreshold;
    const required = nextThreshold - currentThreshold;
    
    return {
      current: progress,
      required: required,
      percentage: Math.round((progress / required) * 100)
    };
  }, [userLevel, totalPoints]);
  
  const value = {
    // State
    currentExercise,
    currentExerciseId,
    completedExercises,
    totalPoints,
    userLevel,
    streak,
    showHint,
    hintsUsed,
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
    setShowHint,
    useHint,
    setFeedback,
    setQueryResult,
    setIsExecuting,
    setUserCode,
    setStreak,
    processQueryResults,
    togglePracticeMode,
    getNextExercise,
    saveQuery,
    loadSavedQuery,
    resetProgress,
    completeTutorial,
    getExperienceProgress,
    setExecutionHistory,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};