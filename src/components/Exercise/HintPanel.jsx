import React from 'react';
import { X, Lightbulb, ChevronRight } from 'lucide-react';
import styles from './HintPanel.module.css';

const HintPanel = ({ 
  isOpen, 
  onClose, 
  currentHint, 
  hintsUsed, 
  totalHints, 
  onNextHint, 
  hasMoreHints 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Lightbulb size={20} />
            <h3>Hint {hintsUsed} of {totalHints}</h3>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.hintText}>
            {currentHint?.text}
          </div>
          
          {currentHint?.penalty && (
            <div className={styles.penalty}>
              <span>💡 Using this hint will reduce your score by {currentHint.penalty} points</span>
            </div>
          )}
        </div>
        
        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            Got it!
          </button>
          
          {hasMoreHints && (
            <button className={styles.nextHintBtn} onClick={onNextHint}>
              Next Hint
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HintPanel;