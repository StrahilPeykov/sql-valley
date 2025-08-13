import React from 'react';
import { CheckCircle, Lock, Circle, ChevronRight } from 'lucide-react';
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
    togglePracticeMode
  } = useApp();
  
  const getExerciseStatus = (exercise) => {
    if (completedExercises.includes(exercise.id)) return 'completed';
    if (currentExerciseId === exercise.id) return 'current';
    if (isExerciseUnlocked(exercise.id) || practiceMode) return 'available';
    return 'locked';
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
                  return (
                    <button
                      key={exercise.id}
                      className={`${styles.exercise} ${styles[status]}`}
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
                        <span className={styles.exerciseTitle}>
                          {exercise.id}. {exercise.title}
                        </span>
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