import React from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Feedback.module.css';

const FeedbackPanel = () => {
  const { feedback, currentExercise } = useApp();
  const [showDetails, setShowDetails] = React.useState(false);
  
  if (!feedback) return null;
  
  const getIcon = () => {
    if (feedback.score === 100) return <CheckCircle className={styles.icon} />;
    if (feedback.score >= 50) return <AlertCircle className={styles.icon} />;
    return <XCircle className={styles.icon} />;
  };
  
  const getTypeClass = () => {
    if (feedback.score === 100) return styles.success;
    if (feedback.score >= 50) return styles.warning;
    return styles.error;
  };
  
  return (
    <div className={`${styles.panel} ${getTypeClass()}`}>
      <div className={styles.header}>
        {getIcon()}
        <div className={styles.message}>
          <strong>{feedback.summary || feedback.message}</strong>
          {feedback.score !== undefined && (
            <span className={styles.score}>Score: {feedback.score}%</span>
          )}
        </div>
        
        {feedback.details && feedback.details.length > 0 && (
          <button
            className={styles.toggleButton}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      
      {showDetails && feedback.details && (
        <div className={styles.details}>
          <h4>Test Results:</h4>
          <ul className={styles.testList}>
            {feedback.details.map((test, index) => (
              <li key={index} className={test.passed ? styles.passed : styles.failed}>
                <span className={styles.testIcon}>
                  {test.passed ? '✓' : '✗'}
                </span>
                <span className={styles.testName}>{test.name}</span>
                {!test.passed && (
                  <span className={styles.testFeedback}>- {test.feedback}</span>
                )}
              </li>
            ))}
          </ul>
          
          {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div className={styles.suggestions}>
              <h4>Suggestions:</h4>
              <ul>
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;