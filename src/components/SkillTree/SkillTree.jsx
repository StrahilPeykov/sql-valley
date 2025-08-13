import React, { useMemo, useRef, useEffect, useState } from 'react';
import { 
  Brain, Database, Filter, BarChart3, Link, Search, Award,
  Lock, CheckCircle, Star, Zap, TrendingUp, Target,
  ChevronRight, Info
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exercises } from '../../data/exercises';
import styles from './SkillTree.module.css';

const SkillTree = () => {
  const { 
    completedExercises, 
    currentExerciseId, 
    selectExercise, 
    isExerciseUnlocked,
    totalPoints,
    userLevel,
    getExperienceProgress,
    practiceMode,
    togglePracticeMode
  } = useApp();
  
  const canvasRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Enhanced skill categories with positions for visual tree
  const skillCategories = useMemo(() => [
    {
      id: 'fundamentals',
      title: "Fundamentals",
      description: "Master the basics of SQL",
      color: "#4A90E2",
      icon: Database,
      position: { x: 50, y: 20 },
      skills: [
        { 
          id: 1, 
          icon: Database, 
          title: "SELECT Basics",
          position: { x: 30, y: 40 }
        },
        { 
          id: 2, 
          icon: Filter, 
          title: "Filtering",
          position: { x: 70, y: 40 }
        }
      ]
    },
    {
      title: "Data Analysis", 
      id: 'analysis',
      description: "Analyze and aggregate data",
      color: "#F5A623",
      icon: BarChart3,
      position: { x: 50, y: 50 },
      skills: [
        { 
          id: 3, 
          icon: BarChart3, 
          title: "Aggregation",
          position: { x: 50, y: 60 }
        }
      ]
    },
    {
      title: "Advanced Queries",
      id: 'advanced',
      description: "Complex queries and optimization",
      color: "#BD10E0",
      icon: Award,
      position: { x: 50, y: 70 },
      skills: [
        { 
          id: 4, 
          icon: Link, 
          title: "JOINs",
          position: { x: 20, y: 80 }
        },
        { 
          id: 5, 
          icon: Search, 
          title: "Subqueries",
          position: { x: 50, y: 85 }
        },
        { 
          id: 6, 
          icon: Award, 
          title: "Complex Analysis",
          position: { x: 80, y: 80 }
        },
        {
          id: 7,
          icon: Star,
          title: "Multiple JOINs",
          position: { x: 50, y: 95 }
        }
      ]
    }
  ], []);
  
  // Draw connections between skills
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    exercises.forEach(exercise => {
      if (!exercise.prerequisites) return;
      
      exercise.prerequisites.forEach(prereqId => {
        const fromExercise = exercises.find(e => e.id === prereqId);
        const toExercise = exercise;
        
        if (!fromExercise || !toExercise) return;
        
        // Find positions (simplified - you'd calculate actual positions)
        const fromSkill = skillCategories
          .flatMap(cat => cat.skills)
          .find(s => s.id === prereqId);
        const toSkill = skillCategories
          .flatMap(cat => cat.skills)
          .find(s => s.id === exercise.id);
        
        if (!fromSkill || !toSkill) return;
        
        const fromX = (fromSkill.position.x / 100) * canvas.width;
        const fromY = (fromSkill.position.y / 100) * canvas.height;
        const toX = (toSkill.position.x / 100) * canvas.width;
        const toY = (toSkill.position.y / 100) * canvas.height;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        
        // Style based on completion
        if (completedExercises.includes(prereqId) && completedExercises.includes(exercise.id)) {
          ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
          ctx.lineWidth = 3;
        } else if (completedExercises.includes(prereqId)) {
          ctx.strokeStyle = 'rgba(199, 33, 37, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });
  }, [completedExercises, skillCategories]);
  
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
    if (skillData.isUnlocked || practiceMode) {
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
  const expProgress = getExperienceProgress();
  
  // Calculate category progress
  const getCategoryProgress = (category) => {
    const categorySkills = category.skills.map(s => s.id);
    const completed = categorySkills.filter(id => completedExercises.includes(id));
    return {
      completed: completed.length,
      total: categorySkills.length,
      percentage: Math.round((completed.length / categorySkills.length) * 100)
    };
  };
  
  return (
    <div className={styles.container}>
      {/* Header with stats */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Brain className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>SQL Skill Tree</h2>
            <p className={styles.subtitle}>
              Level {userLevel} • {totalPoints} XP
            </p>
          </div>
        </div>
        
        <button 
          className={`${styles.practiceModeButton} ${practiceMode ? styles.active : ''}`}
          onClick={togglePracticeMode}
        >
          <Zap size={16} />
          {practiceMode ? 'Exit Practice' : 'Practice Mode'}
        </button>
      </div>
      
      {/* Experience bar */}
      <div className={styles.experienceBar}>
        <div className={styles.expInfo}>
          <span className={styles.expLabel}>Experience</span>
          <span className={styles.expValues}>
            {expProgress.current} / {expProgress.required} XP
          </span>
        </div>
        <div className={styles.expBarOuter}>
          <div 
            className={styles.expBarInner}
            style={{ width: `${expProgress.percentage}%` }}
          >
            <span className={styles.expGlow}></span>
          </div>
        </div>
      </div>
      
      {/* Skill Tree Visualization */}
      <div className={styles.treeContainer}>
        <canvas 
          ref={canvasRef} 
          className={styles.connectionCanvas}
        />
        
        <div className={styles.skillGrid}>
          {skillCategories.map((category) => {
            const progress = getCategoryProgress(category);
            const isExpanded = selectedCategory === category.id;
            
            return (
              <div 
                key={category.id} 
                className={styles.category}
                style={{ '--category-color': category.color }}
              >
                <button
                  className={styles.categoryHeader}
                  onClick={() => setSelectedCategory(
                    isExpanded ? null : category.id
                  )}
                >
                  <div className={styles.categoryIcon}>
                    <category.icon size={24} />
                  </div>
                  
                  <div className={styles.categoryInfo}>
                    <h3>{category.title}</h3>
                    <p className={styles.categoryDesc}>{category.description}</p>
                  </div>
                  
                  <div className={styles.categoryProgress}>
                    <div className={styles.progressRing}>
                      <svg viewBox="0 0 36 36">
                        <path
                          className={styles.progressRingBg}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={styles.progressRingFill}
                          strokeDasharray={`${progress.percentage}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className={styles.progressText}>
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight 
                    className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
                  />
                </button>
                
                {(isExpanded || !selectedCategory) && (
                  <div className={styles.skillList}>
                    {category.skills.map((skill) => {
                      const skillData = getSkillData(skill.id);
                      const IconComponent = skill.icon;
                      const status = getSkillStatus(skillData);
                      const isHovered = hoveredSkill === skill.id;
                      
                      return (
                        <div
                          key={skill.id}
                          className={`${styles.skillCard} ${styles[status]}`}
                          onClick={() => handleSkillClick(skill.id)}
                          onMouseEnter={() => setHoveredSkill(skill.id)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          style={{
                            '--skill-x': `${skill.position.x}%`,
                            '--skill-y': `${skill.position.y}%`
                          }}
                        >
                          <div className={styles.skillGlow}></div>
                          
                          <div className={styles.skillIcon}>
                            {skillData.isCompleted ? (
                              <CheckCircle size={24} className={styles.completedIcon} />
                            ) : skillData.isUnlocked || practiceMode ? (
                              <IconComponent size={24} />
                            ) : (
                              <Lock size={24} className={styles.lockIcon} />
                            )}
                          </div>
                          
                          <div className={styles.skillInfo}>
                            <h4>{skill.title}</h4>
                            <div className={styles.skillMeta}>
                              <span className={styles.difficulty}>
                                {skillData.difficulty}
                              </span>
                              <span className={styles.points}>
                                {skillData.points} pts
                              </span>
                            </div>
                            
                            {skillData.isCurrent && (
                              <div className={styles.currentBadge}>
                                <Target size={12} />
                                Current
                              </div>
                            )}
                            
                            {skillData.isCompleted && (
                              <div className={styles.completedBadge}>
                                <Star size={12} />
                                Complete
                              </div>
                            )}
                          </div>
                          
                          {/* Hover tooltip */}
                          {isHovered && (
                            <div className={styles.tooltip}>
                              <h5>{skillData.title}</h5>
                              <p>{skillData.shortDescription}</p>
                              <div className={styles.tooltipMeta}>
                                <span>{skillData.difficulty}</span>
                                <span>•</span>
                                <span>{skillData.points} points</span>
                              </div>
                              {!skillData.isUnlocked && !practiceMode && (
                                <div className={styles.tooltipLocked}>
                                  <Lock size={14} />
                                  Complete prerequisites to unlock
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress Summary */}
      <div className={styles.progressSummary}>
        <div className={styles.summaryItem}>
          <TrendingUp className={styles.summaryIcon} />
          <div>
            <span className={styles.summaryValue}>{completedCount}</span>
            <span className={styles.summaryLabel}>Completed</span>
          </div>
        </div>
        
        <div className={styles.summaryItem}>
          <Target className={styles.summaryIcon} />
          <div>
            <span className={styles.summaryValue}>{totalCount - completedCount}</span>
            <span className={styles.summaryLabel}>Remaining</span>
          </div>
        </div>
        
        <div className={styles.summaryItem}>
          <Award className={styles.summaryIcon} />
          <div>
            <span className={styles.summaryValue}>{Math.round(progressPercentage)}%</span>
            <span className={styles.summaryLabel}>Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTree;