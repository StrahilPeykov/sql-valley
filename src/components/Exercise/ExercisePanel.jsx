import React, { useState } from 'react';
import { BookOpen, Info, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TheoryModal from './TheoryModal';
import styles from './Exercise.module.css';

const ExercisePanel = () => {
  const { currentExercise, practiceMode, setUserCode } = useApp();
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  // Copy solution to clipboard and editor
  const copySolutionToEditor = () => {
    if (currentExercise.solution) {
      setUserCode(currentExercise.solution);
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    }
  };

  // Simple SQL syntax highlighting for solutions
  const highlightSQLSolution = (code) => {
    if (!code) return '';
    
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
      'ON', 'AS', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
      'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
      'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'LIMIT', 'UNION'
    ];
    
    let highlighted = code;
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="${styles.sqlKeyword}">$1</span>`);
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/'([^']*)'/g, `<span class="${styles.sqlString}">'$1'</span>`);
    
    // Highlight table names
    const tables = ['customer', 'store', 'product', 'shoppinglist', 'purchase', 'inventory'];
    tables.forEach(table => {
      const regex = new RegExp(`\\b(${table})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="${styles.sqlTable}">$1</span>`);
    });
    
    return highlighted;
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>
                Exercise {currentExercise.id}: {currentExercise.title}
              </h3>
              <div className={styles.headerActions}>
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
                {practiceMode && (
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className={styles.solutionBadge}
                    title="View the solution (Practice Mode only)"
                  >
                    {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{showSolution ? 'Hide' : 'Show'} Solution</span>
                  </button>
                )}
              </div>
            </div>
            <div className={styles.metadata}>
              <span className={styles.difficulty}>{currentExercise.difficulty}</span>
              <span className={styles.points}>{currentExercise.points} points</span>
              {practiceMode && (
                <span className={styles.practiceLabel}>Practice Mode - Solutions Available</span>
              )}
            </div>
          </div>
        </div>
        
        <div className={styles.content}>
          <p className={styles.description}>
            {currentExercise.description}
          </p>
          
          {/* Solution Section - Only in Practice Mode */}
          {practiceMode && showSolution && (
            <div className={styles.solutionSection}>
              <div className={styles.solutionHeader}>
                <h4>Solution</h4>
                <button
                  onClick={copySolutionToEditor}
                  className={styles.copySolutionBtn}
                  title="Copy solution to editor"
                >
                  {copiedSolution ? <Check size={16} /> : <Copy size={16} />}
                  {copiedSolution ? 'Copied!' : 'Copy to Editor'}
                </button>
              </div>
              
              <div className={styles.solutionCode}>
                <pre
                  dangerouslySetInnerHTML={{
                    __html: highlightSQLSolution(currentExercise.solution)
                  }}
                />
              </div>
              
              {/* Alternative Solutions */}
              {currentExercise.alternativeSolutions && currentExercise.alternativeSolutions.length > 0 && (
                <div className={styles.alternativeSolutions}>
                  <h5>Alternative approaches:</h5>
                  {currentExercise.alternativeSolutions.map((altSolution, index) => (
                    <div key={index} className={styles.altSolutionCode}>
                      <pre
                        dangerouslySetInnerHTML={{
                          __html: highlightSQLSolution(altSolution)
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className={styles.solutionTip}>
                <strong>Learning Tip:</strong> Try to understand each part of the solution. 
                Experiment by modifying it to see how the results change!
              </div>
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