// src/components/Feedback/FeedbackPanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertCircle, Info, 
  Award, Target, TrendingUp, BookOpen,
  ChevronDown, ChevronUp, Lightbulb, 
  Code, AlertTriangle, Zap
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { calculateScore, generateDetailedFeedback } from '../../data/exercises';
import styles from './Feedback.module.css';

const FeedbackPanel = () => {
  const { 
    feedback, 
    currentExercise, 
    queryResult,
    userCode,
    showHint,
    setShowHint,
    hintsUsed,
    practiceMode 
  } = useApp();
  
  const [detailedView, setDetailedView] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  
  useEffect(() => {
    if (feedback?.score) {
      setAnimateScore(true);
      setTimeout(() => setAnimateScore(false), 1000);
    }
  }, [feedback?.score]);
  
  if (!feedback) return null;
  
  const getIcon = () => {
    if (feedback.score === 100) return <CheckCircle className={styles.icon} />;
    if (feedback.score >= 70) return <AlertCircle className={styles.icon} />;
    if (feedback.score >= 40) return <Info className={styles.icon} />;
    return <XCircle className={styles.icon} />;
  };
  
  const getTypeClass = () => {
    if (feedback.score === 100) return styles.success;
    if (feedback.score >= 70) return styles.warning;
    if (feedback.score >= 40) return styles.info;
    return styles.error;
  };
  
  // Generate SQL diff comparison
  const renderSQLDiff = () => {
    if (!currentExercise.solution) return null;
    
    const userLines = userCode.trim().split('\n');
    const solutionLines = currentExercise.solution.trim().split('\n');
    
    return (
      <div className={styles.diffContainer}>
        <div className={styles.diffColumn}>
          <h5>Your Query:</h5>
          <pre className={styles.codeBlock}>
            {userLines.map((line, i) => (
              <div key={i} className={styles.codeLine}>
                <span className={styles.lineNumber}>{i + 1}</span>
                <span className={styles.codeText}>{line}</span>
              </div>
            ))}
          </pre>
        </div>
        
        <div className={styles.diffColumn}>
          <h5>Expected Query:</h5>
          <pre className={styles.codeBlock}>
            {solutionLines.map((line, i) => (
              <div key={i} className={styles.codeLine}>
                <span className={styles.lineNumber}>{i + 1}</span>
                <span className={styles.codeText}>{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    );
  };
  
  // Render test results
  const renderTestResults = () => {
    if (!feedback.details || feedback.details.length === 0) return null;
    
    return (
      <div className={styles.testResults}>
        <h4 className={styles.sectionTitle}>
          <Target size={16} />
          Test Results
        </h4>
        
        <div className={styles.testList}>
          {feedback.details.map((test, index) => (
            <div 
              key={index} 
              className={`${styles.testItem} ${test.passed ? styles.passed : styles.failed}`}
            >
              <div className={styles.testHeader}>
                {test.passed ? (
                  <CheckCircle size={16} className={styles.testIcon} />
                ) : (
                  <XCircle size={16} className={styles.testIcon} />
                )}
                <span className={styles.testName}>{test.name}</span>
                <span className={styles.testWeight}>{test.weight}pts</span>
              </div>
              
              {!test.passed && (
                <div className={styles.testFeedback}>
                  {test.feedback}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render achievements
  const renderAchievements = () => {
    if (!feedback.achievements || feedback.achievements.length === 0) return null;
    
    return (
      <div className={styles.achievements}>
        <h4 className={styles.sectionTitle}>
          <Award size={16} />
          Bonus Achievements
        </h4>
        
        <div className={styles.achievementList}>
          {feedback.achievements.map((achievement, index) => (
            <div key={index} className={styles.achievementItem}>
              <Zap size={16} className={styles.achievementIcon} />
              <span>{achievement.text}</span>
              <span className={styles.bonusPoints}>+{achievement.points}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render learning suggestions
  const renderSuggestions = () => {
    if (!feedback.suggestions || feedback.suggestions.length === 0) return null;
    
    return (
      <div className={styles.suggestions}>
        <h4 className={styles.sectionTitle}>
          <Lightbulb size={16} />
          Suggestions
        </h4>
        
        <ul className={styles.suggestionList}>
          {feedback.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
        
        {!showHint && currentExercise.hints && hintsUsed < currentExercise.hints.length && (
          <button 
            className={styles.hintButton}
            onClick={() => setShowHint(true)}
          >
            <Lightbulb size={14} />
            Get a hint (−{currentExercise.hints[hintsUsed].penalty} points)
          </button>
        )}
      </div>
    );
  };
  
  // Score animation
  const renderScore = () => {
    if (!feedback.score && feedback.score !== 0) return null;
    
    return (
      <div className={`${styles.scoreDisplay} ${animateScore ? styles.animateScore : ''}`}>
        <div className={styles.scoreCircle}>
          <svg className={styles.scoreRing} viewBox="0 0 120 120">
            <circle
              className={styles.scoreRingBg}
              cx="60"
              cy="60"
              r="54"
              strokeWidth="8"
            />
            <circle
              className={styles.scoreRingFill}
              cx="60"
              cy="60"
              r="54"
              strokeWidth="8"
              strokeDasharray={`${(feedback.score / 100) * 339.292} 339.292`}
              style={{
                stroke: feedback.score === 100 ? '#4ade80' :
                       feedback.score >= 70 ? '#fbbf24' :
                       feedback.score >= 40 ? '#60a5fa' : '#f87171'
              }}
            />
          </svg>
          <div className={styles.scoreText}>
            <span className={styles.scoreNumber}>{feedback.score}</span>
            <span className={styles.scoreLabel}>%</span>
          </div>
        </div>
        
        {!practiceMode && (
          <div className={styles.pointsEarned}>
            {feedback.score === 100 ? (
              <>
                <Award size={16} />
                <span>{currentExercise.points} points earned!</span>
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                <span>Keep trying for full points!</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`${styles.panel} ${getTypeClass()}`}>
      <div className={styles.header}>
        {getIcon()}
        <div className={styles.headerContent}>
          <p className={styles.message}>{feedback.summary || feedback.message}</p>
          {feedback.score !== undefined && (
            <button
              className={styles.toggleDetails}
              onClick={() => setDetailedView(!detailedView)}
            >
              {detailedView ? (
                <>Hide Details <ChevronUp size={16} /></>
              ) : (
                <>Show Details <ChevronDown size={16} /></>
              )}
            </button>
          )}
        </div>
        
        {renderScore()}
      </div>
      
      {detailedView && (
        <div className={styles.details}>
          {renderTestResults()}
          {renderAchievements()}
          {renderSuggestions()}
          
          {/* Theory Review */}
          {feedback.score < 100 && currentExercise.theory && (
            <div className={styles.theorySection}>
              <button
                className={styles.theoryToggle}
                onClick={() => setShowTheory(!showTheory)}
              >
                <BookOpen size={16} />
                Review Theory
                {showTheory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showTheory && (
                <div className={styles.theoryContent}>
                  <pre>{currentExercise.theory}</pre>
                </div>
              )}
            </div>
          )}
          
          {/* SQL Comparison */}
          {feedback.score < 100 && feedback.score > 0 && (
            <div className={styles.diffSection}>
              <button
                className={styles.diffToggle}
                onClick={() => setShowDiff(!showDiff)}
              >
                <Code size={16} />
                Compare with Solution
                {showDiff ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showDiff && renderSQLDiff()}
            </div>
          )}
          
          {/* Next Steps */}
          {feedback.score === 100 && (
            <div className={styles.nextSteps}>
              <h4 className={styles.sectionTitle}>
                <TrendingUp size={16} />
                What's Next?
              </h4>
              <p>Great job! You've mastered {currentExercise.title}.</p>
              <p>Ready to tackle the next challenge?</p>
            </div>
          )}
        </div>
      )}
      
      {/* Quick hints for common errors */}
      {feedback.type === 'error' && (
        <div className={styles.errorHelp}>
          <AlertTriangle size={16} />
          <span>Common issues: Check table names, column names, and SQL syntax.</span>
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;