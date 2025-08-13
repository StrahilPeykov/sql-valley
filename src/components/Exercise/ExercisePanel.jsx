import React, { useState } from 'react';
import { BookOpen, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Exercise.module.css';

const ExercisePanel = () => {
  const { currentExercise, showHint, setShowHint, hintsUsed } = useApp();
  const [showTheory, setShowTheory] = useState(false);
  
  const getCurrentHint = () => {
    if (!currentExercise.hints || hintsUsed === 0) return null;
    return currentExercise.hints[hintsUsed - 1];
  };
  
  const getNextHint = () => {
    if (!currentExercise.hints) return null;
    return currentExercise.hints[hintsUsed];
  };
  
  const currentHint = getCurrentHint();
  const nextHint = getNextHint();
  
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>
            Exercise {currentExercise.id}: {currentExercise.title}
          </h3>
          <div className={styles.metadata}>
            <span className={styles.difficulty}>{currentExercise.difficulty}</span>
            <span className={styles.points}>{currentExercise.points} points</span>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        <p className={styles.description}>
          {currentExercise.description}
        </p>
        
        <div className={styles.actions}>
          {currentExercise.theory && (
            <button
              onClick={() => setShowTheory(!showTheory)}
              className={styles.theoryButton}
            >
              <BookOpen size={16} />
              {showTheory ? 'Hide Theory' : 'View Theory'}
              {showTheory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          
          {nextHint && (
            <button
              onClick={() => setShowHint(true)}
              className={styles.hintButton}
            >
              <Lightbulb size={16} />
              {hintsUsed === 0 ? 'Show Hint' : `Next Hint (${hintsUsed + 1}/${currentExercise.hints.length})`}
            </button>
          )}
        </div>
        
        {showTheory && currentExercise.theory && (
          <div className={styles.theoryContent}>
            <h4>Theory</h4>
            <pre>{currentExercise.theory}</pre>
          </div>
        )}
        
        {currentHint && (
          <div className={styles.hint}>
            <div className={styles.hintHeader}>
              <Lightbulb size={16} />
              <strong>Hint {hintsUsed}/{currentExercise.hints.length}</strong>
              {currentHint.penalty && (
                <span className={styles.hintPenalty}>(-{currentHint.penalty} pts)</span>
              )}
            </div>
            <p>{currentHint.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisePanel;