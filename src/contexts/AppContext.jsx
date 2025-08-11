import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { exercises } from '../data/exercises';

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
  const [streak, setStreak] = useState(0);
  
  // UI State
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Code State
  const [userCode, setUserCode] = useState('');
  
  // Persist progress to localStorage
  useEffect(() => {
    localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
  }, [completedExercises]);
  
  useEffect(() => {
    localStorage.setItem('totalPoints', totalPoints.toString());
  }, [totalPoints]);
  
  // Get current exercise
  const currentExercise = exercises.find(ex => ex.id === currentExerciseId) || exercises[0];
  
  // Select exercise
  const selectExercise = useCallback((exerciseId) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentExerciseId(exerciseId);
      setUserCode(exercise.initialCode);
      setFeedback(null);
      setQueryResult(null);
      setShowHint(false);
    }
  }, []);
  
  // Complete exercise
  const completeExercise = useCallback((exerciseId, points) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      setTotalPoints(prev => prev + points);
      setStreak(prev => prev + 1);
    }
  }, [completedExercises]);
  
  // Reset current exercise
  const resetCurrentExercise = useCallback(() => {
    setUserCode(currentExercise.initialCode);
    setFeedback(null);
    setQueryResult(null);
    setShowHint(false);
  }, [currentExercise]);
  
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
    
    // If no prerequisites, check if previous exercise is completed
    const previousExercise = exercises.find(ex => ex.id === exerciseId - 1);
    return previousExercise ? completedExercises.includes(previousExercise.id) : true;
  }, [completedExercises]);
  
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
    streak,
    showHint,
    feedback,
    queryResult,
    isExecuting,
    userCode,
    progressPercentage,
    
    // Actions
    selectExercise,
    completeExercise,
    resetCurrentExercise,
    isExerciseUnlocked,
    setShowHint,
    setFeedback,
    setQueryResult,
    setIsExecuting,
    setUserCode,
    setStreak,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};