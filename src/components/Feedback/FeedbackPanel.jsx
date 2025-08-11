import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Feedback.module.css';

const FeedbackPanel = () => {
  const { feedback } = useApp();
  
  if (!feedback) return null;
  
  const getIcon = () => {
    switch (feedback.type) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'error':
        return <XCircle className={styles.icon} />;
      case 'warning':
        return <AlertCircle className={styles.icon} />;
      default:
        return <Info className={styles.icon} />;
    }
  };
  
  return (
    <div className={`${styles.panel} ${styles[feedback.type]}`}>
      {getIcon()}
      <div className={styles.content}>
        <p className={styles.message}>{feedback.message}</p>
        
        {feedback.hints && feedback.hints.length > 0 && (
          <ul className={styles.hints}>
            {feedback.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        )}
        
        {feedback.bonusInfo && (
          <p className={styles.bonus}>{feedback.bonusInfo}</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;