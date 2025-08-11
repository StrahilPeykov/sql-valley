import React from 'react';
import { Zap, Award, TrendingUp, Flame, BookOpen, GraduationCap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Header.module.css';

const Header = () => {
  const { totalPoints, streak, progressPercentage, completedExercises } = useApp();
  const totalExercises = 6;
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoWrapper}>
            <Zap className={styles.logo} />
            <div className={styles.tueBadge}>
              <GraduationCap size={16} />
              <span>TU/e</span>
            </div>
          </div>
          <div>
            <h1 className={styles.title}>SQL Valley</h1>
            <p className={styles.subtitle}>Master SQL Through Interactive Challenges</p>
            <p className={styles.course}>2ID50 & JBI050 Database Courses</p>
          </div>
        </div>
        
        <div className={styles.stats}>
          {/* Streak indicator */}
          {streak > 0 && (
            <div className={`${styles.statCard} ${styles.streakCard}`}>
              <Flame className={styles.icon} />
              <div className={styles.statContent}>
                <span className={styles.value}>{streak}</span>
                <span className={styles.label}>Streak</span>
              </div>
            </div>
          )}
          
          {/* Points */}
          <div className={`${styles.statCard} ${styles.pointsCard}`}>
            <Award className={styles.icon} />
            <div className={styles.statContent}>
              <span className={styles.value}>{totalPoints}</span>
              <span className={styles.label}>Points</span>
            </div>
          </div>
          
          {/* Progress */}
          <div className={styles.statCard}>
            <TrendingUp className={styles.icon} />
            <div className={styles.statContent}>
              <span className={styles.value}>{completedExercises.length}/{totalExercises}</span>
              <span className={styles.label}>Completed</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressWrapper}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${progressPercentage}%` }}
                >
                  <span className={styles.progressGlow}></span>
                </div>
              </div>
              <span className={styles.progressText}>{progressPercentage}%</span>
            </div>
            <span className={styles.progressLabel}>Course Progress</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;