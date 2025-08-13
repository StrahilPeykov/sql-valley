// src/components/Tutorial/Tutorial.jsx
import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, X, 
  Zap, Database, Code, Trophy, 
  Target, BookOpen, Lightbulb, Play
} from 'lucide-react';
import styles from './Tutorial.module.css';

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to SQL Valley!",
      icon: <Zap size={48} />,
      content: (
        <>
          <p>Welcome to your interactive SQL learning journey!</p>
          <p>SQL Valley is designed specifically for TU/e students to master database queries through hands-on practice.</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <Database size={24} />
              <span>Real Database</span>
            </div>
            <div className={styles.feature}>
              <Trophy size={24} />
              <span>Achievements</span>
            </div>
            <div className={styles.feature}>
              <Target size={24} />
              <span>Skill Tree</span>
            </div>
          </div>
        </>
      )
    },
    {
      title: "The Skill Tree",
      icon: <Target size={48} />,
      content: (
        <>
          <p>Navigate through SQL concepts using our interactive skill tree.</p>
          <div className={styles.skillStates}>
            <div className={styles.skillState}>
              <div className={styles.stateDot} style={{ background: '#4ade80' }}></div>
              <span>Completed - You've mastered this skill</span>
            </div>
            <div className={styles.skillState}>
              <div className={styles.stateDot} style={{ background: '#fbbf24' }}></div>
              <span>Current - You're working on this</span>
            </div>
            <div className={styles.skillState}>
              <div className={styles.stateDot} style={{ background: '#60a5fa' }}></div>
              <span>Available - Ready to learn</span>
            </div>
            <div className={styles.skillState}>
              <div className={styles.stateDot} style={{ background: '#6b7280' }}></div>
              <span>Locked - Complete prerequisites first</span>
            </div>
          </div>
          <p className={styles.tip}>💡 Tip: Start with SELECT Basics and work your way up!</p>
        </>
      )
    },
    {
      title: "Writing SQL Queries",
      icon: <Code size={48} />,
      content: (
        <>
          <p>Use the SQL Editor to write and test your queries.</p>
          <div className={styles.editorFeatures}>
            <h4>Editor Features:</h4>
            <ul>
              <li>✨ Syntax highlighting for better readability</li>
              <li>🔍 Auto-completion (Ctrl+Space)</li>
              <li>⚡ Run queries with Ctrl+Enter</li>
              <li>📝 Format your SQL automatically</li>
              <li>🔢 Line numbers and error indicators</li>
            </ul>
          </div>
          <div className={styles.codeExample}>
            <pre>
              <code>
{`SELECT name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC;`}
              </code>
            </pre>
          </div>
        </>
      )
    },
    {
      title: "Educational Feedback",
      icon: <Lightbulb size={48} />,
      content: (
        <>
          <p>Get detailed feedback on your queries to learn from mistakes.</p>
          <div className={styles.feedbackTypes}>
            <div className={styles.feedbackType}>
              <div className={styles.scoreCircle}>100%</div>
              <div>
                <strong>Test Results</strong>
                <p>See exactly which parts of your query are correct</p>
              </div>
            </div>
            <div className={styles.feedbackType}>
              <div className={styles.hintIcon}>💡</div>
              <div>
                <strong>Smart Hints</strong>
                <p>Get progressive hints when you're stuck</p>
              </div>
            </div>
            <div className={styles.feedbackType}>
              <div className={styles.theoryIcon}>📚</div>
              <div>
                <strong>Theory Review</strong>
                <p>Access relevant SQL concepts anytime</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Achievements & Progress",
      icon: <Trophy size={48} />,
      content: (
        <>
          <p>Earn points and unlock achievements as you progress!</p>
          <div className={styles.achievementExamples}>
            <div className={styles.achievement}>
              <span className={styles.achievementIcon}>🎯</span>
              <div>
                <strong>First Query</strong>
                <p>Complete your first exercise</p>
              </div>
            </div>
            <div className={styles.achievement}>
              <span className={styles.achievementIcon}>⚡</span>
              <div>
                <strong>Speed Demon</strong>
                <p>Solve in under 60 seconds</p>
              </div>
            </div>
            <div className={styles.achievement}>
              <span className={styles.achievementIcon}>🏆</span>
              <div>
                <strong>SQL Master</strong>
                <p>Complete all exercises</p>
              </div>
            </div>
          </div>
          <p className={styles.tip}>🎮 Practice Mode: Try exercises without affecting your score!</p>
        </>
      )
    },
    {
      title: "Ready to Begin!",
      icon: <Play size={48} />,
      content: (
        <>
          <p>You're all set to start your SQL journey!</p>
          <div className={styles.quickTips}>
            <h4>Quick Tips:</h4>
            <ul>
              <li>📖 Read the exercise description carefully</li>
              <li>🔍 Use the Schema Reference to check table structures</li>
              <li>💡 Don't hesitate to use hints if you're stuck</li>
              <li>🔄 Practice makes perfect - retry exercises anytime</li>
              <li>🏆 Check achievements with Ctrl+K</li>
            </ul>
          </div>
          <p className={styles.encouragement}>
            Remember: Every SQL expert started as a beginner. 
            Take your time, learn from mistakes, and enjoy the journey!
          </p>
          <p className={styles.signature}>- The TU/e Database Group</p>
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
  
  const skip = () => {
    if (window.confirm('Skip the tutorial? You can always access help later.')) {
      onComplete();
    }
  };
  
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button className={styles.skipButton} onClick={skip}>
          <X size={20} />
          Skip Tutorial
        </button>
        
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            {steps[currentStep].icon}
            <div className={styles.iconGlow}></div>
          </div>
          
          <h2 className={styles.title}>{steps[currentStep].title}</h2>
          
          <div className={styles.body}>
            {steps[currentStep].content}
          </div>
        </div>
        
        <div className={styles.footer}>
          <div className={styles.progress}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${styles.progressDot} ${
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
            
            <span className={styles.stepCounter}>
              {currentStep + 1} / {steps.length}
            </span>
            
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