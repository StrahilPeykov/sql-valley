import React from 'react';
import { CheckCircle, Lock, Circle, ChevronRight, Edit3 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exercises } from '../../data/exercises';
import styles from './SkillTree.module.css';

const SkillTree = () => {
  const { 
    completedExercises, 
    currentExerciseId, 
    selectExercise, 
    isExerciseUnlocked,
    practiceMode,
    togglePracticeMode,
    savedQueries
  } = useApp();
  
  const getExerciseStatus = (exercise) => {
    if (completedExercises.includes(exercise.id)) return 'completed';
    if (currentExerciseId === exercise.id) return 'current';
    if (isExerciseUnlocked(exercise.id) || practiceMode) return 'available';
    return 'locked';
  };
  
  const hasUnsavedWork = (exerciseId) => {
    const savedCode = savedQueries[exerciseId];
    if (!savedCode) return false;
    
    // Get the initial code for this exercise
    const exercise = exercises.find(e => e.id === exerciseId);
    const initialCode = exercise?.initialCode || '-- Write your SQL query here\n\n';
    
    // Normalize both codes (remove comments, extra whitespace, make lowercase)
    const normalize = (code) => {
      return code
        .replace(/--[^\n]*/g, '') // Remove comments
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .trim()
        .toLowerCase();
    };
    
    const normalizedSaved = normalize(savedCode);
    const normalizedInitial = normalize(initialCode);
    
    // Only show pen if there's meaningful difference and some actual SQL content
    return normalizedSaved !== normalizedInitial && 
           normalizedSaved.length > 0 && 
           !normalizedSaved.match(/^(write your sql query here)?$/);
  };
  
  const handleExerciseClick = (exercise) => {
    const status = getExerciseStatus(exercise);
    if (status !== 'locked' || practiceMode) {
      selectExercise(exercise.id);
    }
  };
  
  // Group exercises by category
  const categories = [...new Set(exercises.map(e => e.category))];
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Exercises</h2>
        <button 
          className={`${styles.practiceToggle} ${practiceMode ? styles.active : ''}`}
          onClick={togglePracticeMode}
        >
          {practiceMode ? 'Exit Practice' : 'Practice Mode'}
        </button>
      </div>
      
      <div className={styles.exerciseList}>
        {categories.map(category => (
          <div key={category} className={styles.category}>
            <h3 className={styles.categoryTitle}>{category}</h3>
            <div className={styles.exercises}>
              {exercises
                .filter(e => e.category === category)
                .map(exercise => {
                  const status = getExerciseStatus(exercise);
                  const hasSavedWork = hasUnsavedWork(exercise.id);
                  
                  return (
                    <button
                      key={exercise.id}
                      className={`${styles.exercise} ${styles[status]} ${hasSavedWork ? styles.hasWork : ''}`}
                      onClick={() => handleExerciseClick(exercise)}
                      disabled={status === 'locked' && !practiceMode}
                    >
                      <div className={styles.exerciseIcon}>
                        {status === 'completed' ? (
                          <CheckCircle size={18} />
                        ) : status === 'locked' && !practiceMode ? (
                          <Lock size={18} />
                        ) : (
                          <Circle size={18} />
                        )}
                      </div>
                      
                      <div className={styles.exerciseInfo}>
                        <div className={styles.exerciseTitleRow}>
                          <span className={styles.exerciseTitle}>
                            {exercise.id}. {exercise.title}
                          </span>
                          {hasSavedWork && (
                            <Edit3 size={12} className={styles.workIndicator} title="Has saved work" />
                          )}
                        </div>
                        <span className={styles.exercisePoints}>
                          {exercise.points} pts
                        </span>
                      </div>
                      
                      {status === 'current' && (
                        <ChevronRight size={16} className={styles.currentIndicator} />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;