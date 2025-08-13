import React from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Exercise.module.css';

const ExercisePanel = () => {
  const { currentExercise, showHint, setShowHint } = useApp();
  
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Exercise {currentExercise.id}: {currentExercise.title}
        </h3>
        <div className={styles.metadata}>
          <span className={styles.difficulty}>{currentExercise.difficulty}</span>
          <span className={styles.points}>{currentExercise.points} points</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <p className={styles.description}>
          {currentExercise.description}
        </p>
        
        <div className={styles.actions}>
          {currentExercise.theory && (
            <details className={styles.theory}>
              <summary>
                <BookOpen size={16} />
                View Theory
              </summary>
              <div className={styles.theoryContent}>
                <pre>{currentExercise.theory}</pre>
              </div>
            </details>
          )}
          
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className={styles.hintButton}
            >
              <Lightbulb size={16} />
              Show Hint
            </button>
          )}
        </div>
        
        {showHint && (
          <div className={styles.hint}>
            <strong>Hint:</strong> {currentExercise.hint}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisePanel;