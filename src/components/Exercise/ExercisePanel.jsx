import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TheoryModal from './TheoryModal';
import styles from './Exercise.module.css';

const ExercisePanel = () => {
  const { currentExercise } = useApp();
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  
  return (
    <>
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
          
          {currentExercise.theory && (
            <div className={styles.actions}>
              <button
                onClick={() => setShowTheoryModal(true)}
                className={styles.theoryButton}
              >
                <BookOpen size={16} />
                View Theory
              </button>
            </div>
          )}
        </div>
      </div>
      
      <TheoryModal
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
        theory={currentExercise.theory}
        exerciseTitle={currentExercise.title}
      />
    </>
  );
};

export default ExercisePanel;