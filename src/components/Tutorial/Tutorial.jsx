import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X, GraduationCap } from 'lucide-react';
import styles from './Tutorial.module.css';

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to SQL Valley",
      content: (
        <>
          <p>This platform will help you learn SQL through interactive exercises designed for TU/e database courses (2ID50 & JBI050).</p>
          <p>Work through exercises at your own pace, get instant feedback, and track your progress.</p>
        </>
      )
    },
    {
      title: "How It Works",
      content: (
        <>
          <p><strong>1. Choose an exercise</strong> from the list on the left</p>
          <p><strong>2. Write your SQL query</strong> in the editor</p>
          <p><strong>3. Run your query</strong> with Ctrl+Enter or the Run button</p>
          <p><strong>4. Get instant feedback</strong> on your solution</p>
          <p><strong>5. Progress to the next exercise</strong> when ready</p>
        </>
      )
    },
    {
      title: "Practice Mode",
      content: (
        <>
          <p>Use <strong>Practice Mode</strong> to try any exercise without affecting your score.</p>
          <p>This is helpful for reviewing concepts or exploring different solutions.</p>
          <p>Your progress and points are only recorded when practice mode is off.</p>
        </>
      )
    },
    {
      title: "Tips for Success",
      content: (
        <>
          <p>• Read exercise descriptions carefully</p>
          <p>• Check the database schema for table and column names</p>
          <p>• Use hints if you get stuck</p>
          <p>• Review the theory sections for SQL concepts</p>
          <p>• Practice regularly to reinforce your learning</p>
        </>
      )
    }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button className={styles.skipButton} onClick={onComplete}>
          <X size={20} />
          Skip
        </button>
        
        <div className={styles.icon}>
          <GraduationCap size={48} />
        </div>
        
        <h2 className={styles.title}>{steps[currentStep].title}</h2>
        
        <div className={styles.content}>
          {steps[currentStep].content}
        </div>
        
        <div className={styles.footer}>
          <div className={styles.progress}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${
                  index === currentStep ? styles.active : 
                  index < currentStep ? styles.completed : ''
                }`}
              />
            ))}
          </div>
          
          <div className={styles.navigation}>
            <button
              className={styles.navButton}
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            
            <button
              className={`${styles.navButton} ${styles.primary}`}
              onClick={nextStep}
            >
              {currentStep === steps.length - 1 ? 'Start Learning' : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;