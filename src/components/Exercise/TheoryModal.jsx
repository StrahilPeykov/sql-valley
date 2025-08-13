import React from 'react';
import { X, BookOpen } from 'lucide-react';
import styles from './TheoryModal.module.css';

const TheoryModal = ({ isOpen, onClose, theory, exerciseTitle }) => {
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
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            <BookOpen size={20} />
            <h2>Theory: {exerciseTitle}</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.content}>
          <pre className={styles.theoryText}>{theory}</pre>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.gotItButton} onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryModal;