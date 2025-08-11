import React from 'react';
import { Target, Lightbulb, Award, BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Exercise.module.css';

const ExercisePanel = () => {
  const { currentExercise, showHint, setShowHint } = useApp();
  
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Target className={styles.icon} />
        <h3>Current Challenge</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.title}>
          <h4>{currentExercise.title}</h4>
          <span className={`${styles.badge} ${styles[currentExercise.difficulty.toLowerCase()]}`}>
            {currentExercise.difficulty}
          </span>
        </div>
        
        <div className={styles.points}>
          <Award size={16} />
          <span>{currentExercise.points} points</span>
        </div>
        
        <p className={styles.description}>
          {currentExercise.description}
        </p>
        
        {currentExercise.theory && (
          <details className={styles.theory}>
            <summary>
              <BookOpen size={16} />
              Learn More
            </summary>
            <div className={styles.theoryContent}>
              {currentExercise.theory}
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
        
        {showHint && (
          <div className={styles.hint}>
            <strong>💡 Hint:</strong>
            <p>{currentExercise.hint}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisePanel;