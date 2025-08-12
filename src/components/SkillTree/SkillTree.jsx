import React, { useMemo } from 'react';
import { Brain, Database, Filter, BarChart3, Link, Search, Award } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exercises } from '../../data/exercises';
import styles from './SkillTree.module.css';

const SkillTree = () => {
  const { 
    completedExercises, 
    currentExerciseId, 
    selectExercise, 
    isExerciseUnlocked,
    totalPoints
  } = useApp();
  
  // Organize skills by category with vertical progression
  const skillCategories = useMemo(() => [
    {
      title: "Fundamentals",
      color: "#4A90E2",
      skills: [
        { id: 1, icon: Database, title: "SELECT Basics" },
        { id: 2, icon: Filter, title: "Filtering" }
      ]
    },
    {
      title: "Data Analysis", 
      color: "#F5A623",
      skills: [
        { id: 3, icon: BarChart3, title: "Aggregation" }
      ]
    },
    {
      title: "Advanced Queries",
      color: "#BD10E0", 
      skills: [
        { id: 4, icon: Link, title: "JOINs" },
        { id: 5, icon: Search, title: "Subqueries" },
        { id: 6, icon: Award, title: "Complex Analysis" }
      ]
    }
  ], []);
  
  // Get exercise data for each skill
  const getSkillData = (skillId) => {
    const exercise = exercises.find(ex => ex.id === skillId);
    const isCompleted = completedExercises.includes(skillId);
    const isUnlocked = isExerciseUnlocked(skillId);
    const isCurrent = currentExerciseId === skillId;
    
    return {
      ...exercise,
      isCompleted,
      isUnlocked,
      isCurrent
    };
  };
  
  const handleSkillClick = (skillId) => {
    const skillData = getSkillData(skillId);
    if (skillData.isUnlocked) {
      selectExercise(skillId);
    }
  };
  
  const getSkillStatus = (skill) => {
    if (skill.isCompleted) return 'completed';
    if (skill.isCurrent) return 'current';
    if (skill.isUnlocked) return 'available';
    return 'locked';
  };
  
  const completedCount = completedExercises.length;
  const totalCount = exercises.length;
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Brain className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>SQL Skills</h2>
            <p className={styles.subtitle}>
              {completedCount}/{totalCount} completed • {totalPoints} points
            </p>
          </div>
        </div>
      </div>
      
      <div className={styles.skillGrid}>
        {skillCategories.map((category, categoryIndex) => (
          <div key={category.title} className={styles.category}>
            <div 
              className={styles.categoryHeader}
              style={{ '--category-color': category.color }}
            >
              <h3>{category.title}</h3>
            </div>
            
            <div className={styles.skillList}>
              {category.skills.map((skill, skillIndex) => {
                const skillData = getSkillData(skill.id);
                const IconComponent = skill.icon;
                
                return (
                  <div
                    key={skill.id}
                    className={`${styles.skillCard} ${styles[getSkillStatus(skillData)]}`}
                    onClick={() => handleSkillClick(skill.id)}
                  >
                    <div className={styles.skillIcon}>
                      <IconComponent size={24} />
                    </div>
                    
                    <div className={styles.skillInfo}>
                      <h4>{skill.title}</h4>
                      <p className={styles.skillMeta}>
                        {skillData.difficulty} • {skillData.points} pts
                      </p>
                      
                      {skillData.isCurrent && (
                        <div className={styles.currentBadge}>Current</div>
                      )}
                      
                      {skillData.isCompleted && (
                        <div className={styles.completedBadge}>✓</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.completed}`} />
          <span>Completed</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.current}`} />
          <span>Current</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.available}`} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.locked}`} />
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
};

export default SkillTree;