import React, { useState } from 'react';
import { BookOpen, Info } from 'lucide-react';
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
            <div className={styles.titleRow}>
              <h3 className={styles.title}>
                Exercise {currentExercise.id}: {currentExercise.title}
              </h3>
              {currentExercise.theory && (
                <button
                  onClick={() => setShowTheoryModal(true)}
                  className={styles.theoryBadge}
                  title="Click to view theory and concepts for this exercise"
                >
                  <Info size={16} />
                  <span>Theory</span>
                </button>
              )}
            </div>
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