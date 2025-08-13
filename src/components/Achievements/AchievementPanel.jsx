import React, { useState, useEffect } from 'react';
import { 
  Trophy, Award, Star, Zap, Target, TrendingUp,
  Lock, CheckCircle, Calendar, Clock, Hash,
  ChevronRight, X, Gift
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Achievements.module.css';

const AchievementPanel = ({ isOpen, onClose }) => {
  const { 
    unlockedBadges, 
    achievements, 
    statistics,
    userLevel,
    totalPoints,
    completedExercises
  } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  
  // Define all possible achievements
  const allAchievements = [
    // Completion achievements
    {
      id: 'first_query',
      category: 'completion',
      name: 'First Steps',
      description: 'Complete your first SQL query',
      icon: '👶',
      points: 10,
      condition: () => completedExercises.length >= 1
    },
    {
      id: 'five_complete',
      category: 'completion',
      name: 'Halfway There',
      description: 'Complete 5 exercises',
      icon: '⭐',
      points: 25,
      condition: () => completedExercises.length >= 5
    },
    {
      id: 'all_complete',
      category: 'completion',
      name: 'SQL Master',
      description: 'Complete all exercises',
      icon: '🏆',
      points: 100,
      condition: () => completedExercises.length >= 7
    },
    
    // Skill achievements
    {
      id: 'perfect_score',
      category: 'skill',
      name: 'Perfectionist',
      description: 'Get 100% on any exercise',
      icon: '💯',
      points: 15,
      condition: () => statistics.perfectScores >= 1
    },
    {
      id: 'no_hints',
      category: 'skill',
      name: 'Independent Learner',
      description: 'Complete 3 exercises without hints',
      icon: '🧠',
      points: 30,
      condition: () => completedExercises.length >= 3 && statistics.hintsUsedTotal === 0
    },
    {
      id: 'speed_demon',
      category: 'skill',
      name: 'Speed Demon',
      description: 'Complete an exercise in under 60 seconds',
      icon: '⚡',
      points: 20,
      condition: () => false // Would need timing tracking
    },
    
    // Progress achievements
    {
      id: 'level_5',
      category: 'progress',
      name: 'Rising Star',
      description: 'Reach level 5',
      icon: '🌟',
      points: 50,
      condition: () => userLevel >= 5
    },
    {
      id: 'points_100',
      category: 'progress',
      name: 'Century Club',
      description: 'Earn 100 points',
      icon: '💰',
      points: 25,
      condition: () => totalPoints >= 100
    },
    {
      id: 'points_500',
      category: 'progress',
      name: 'High Achiever',
      description: 'Earn 500 points',
      icon: '🎯',
      points: 75,
      condition: () => totalPoints >= 500
    },
    
    // Special achievements
    {
      id: 'streak_3',
      category: 'special',
      name: 'On Fire',
      description: 'Get 3 exercises correct in a row',
      icon: '🔥',
      points: 20,
      condition: () => false // Would need streak tracking
    },
    {
      id: 'comeback',
      category: 'special',
      name: 'Comeback Kid',
      description: 'Complete an exercise after 5+ attempts',
      icon: '💪',
      points: 15,
      condition: () => false // Would need attempt tracking
    },
    {
      id: 'night_owl',
      category: 'special',
      name: 'Night Owl',
      description: 'Complete exercises after midnight',
      icon: '🦉',
      points: 10,
      condition: () => false // Would need time tracking
    }
  ];
  
  // Check for new achievements
  useEffect(() => {
    const interval = setInterval(() => {
      allAchievements.forEach(achievement => {
        if (!achievements.some(a => a.id === achievement.id)) {
          if (achievement.condition()) {
            setNewAchievement(achievement);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
          }
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [achievements, allAchievements]);
  
  // Filter achievements by category
  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') return allAchievements;
    return allAchievements.filter(a => a.category === selectedCategory);
  };
  
  // Calculate statistics
  const getStats = () => {
    const unlocked = allAchievements.filter(a => 
      achievements.some(ua => ua.id === a.id)
    ).length;
    
    const totalPossiblePoints = allAchievements.reduce((sum, a) => sum + a.points, 0);
    const earnedPoints = allAchievements
      .filter(a => achievements.some(ua => ua.id === a.id))
      .reduce((sum, a) => sum + a.points, 0);
    
    return {
      unlocked,
      total: allAchievements.length,
      percentage: Math.round((unlocked / allAchievements.length) * 100),
      earnedPoints,
      totalPossiblePoints
    };
  };
  
  const stats = getStats();
  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'completion', name: 'Completion', icon: CheckCircle },
    { id: 'skill', name: 'Skill', icon: Zap },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
    { id: 'special', name: 'Special', icon: Star }
  ];
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Achievement Notification */}
      {showNotification && newAchievement && (
        <div className={styles.notification}>
          <div className={styles.notificationContent}>
            <div className={styles.notificationIcon}>{newAchievement.icon}</div>
            <div>
              <h4>Achievement Unlocked!</h4>
              <p>{newAchievement.name}</p>
            </div>
            <div className={styles.notificationPoints}>
              +{newAchievement.points} pts
            </div>
          </div>
        </div>
      )}
      
      {/* Main Panel */}
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.panel} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <Trophy className={styles.headerIcon} />
              <h2>Achievements</h2>
            </div>
            
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          {/* Statistics */}
          <div className={styles.statistics}>
            <div className={styles.statCard}>
              <Award className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.unlocked}</span>
                <span className={styles.statLabel}>Unlocked</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <Hash className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.total}</span>
                <span className={styles.statLabel}>Total</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <Target className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.percentage}%</span>
                <span className={styles.statLabel}>Complete</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <Zap className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.earnedPoints}</span>
                <span className={styles.statLabel}>Points</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className={styles.overallProgress}>
            <div className={styles.progressHeader}>
              <span>Overall Progress</span>
              <span>{stats.earnedPoints} / {stats.totalPossiblePoints} pts</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${stats.percentage}%` }}
              >
                <span className={styles.progressGlow}></span>
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className={styles.categories}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.id ? styles.active : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Achievement Grid */}
          <div className={styles.achievementGrid}>
            {getFilteredAchievements().map(achievement => {
              const isUnlocked = achievements.some(a => a.id === achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`${styles.achievementCard} ${
                    isUnlocked ? styles.unlocked : styles.locked
                  }`}
                >
                  <div className={styles.achievementIcon}>
                    {isUnlocked ? (
                      <span className={styles.emoji}>{achievement.icon}</span>
                    ) : (
                      <Lock size={24} />
                    )}
                  </div>
                  
                  <div className={styles.achievementInfo}>
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                    
                    <div className={styles.achievementMeta}>
                      <span className={styles.achievementPoints}>
                        {achievement.points} pts
                      </span>
                      {isUnlocked && (
                        <CheckCircle size={16} className={styles.checkIcon} />
                      )}
                    </div>
                  </div>
                  
                  {isUnlocked && (
                    <div className={styles.achievementGlow}></div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div className={styles.recent}>
              <h3>Recent Achievements</h3>
              <div className={styles.recentList}>
                {achievements.slice(-3).reverse().map((achievement, index) => {
                  const fullAchievement = allAchievements.find(a => a.id === achievement.id);
                  if (!fullAchievement) return null;
                  
                  return (
                    <div key={index} className={styles.recentItem}>
                      <span className={styles.recentIcon}>
                        {fullAchievement.icon}
                      </span>
                      <div className={styles.recentInfo}>
                        <span className={styles.recentName}>
                          {fullAchievement.name}
                        </span>
                        <span className={styles.recentTime}>
                          {new Date(achievement.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={styles.recentPoints}>
                        +{fullAchievement.points}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Reward System */}
          <div className={styles.rewards}>
            <div className={styles.rewardCard}>
              <Gift className={styles.rewardIcon} />
              <div>
                <h4>Next Reward</h4>
                <p>Unlock 5 more achievements for a special badge!</p>
                <div className={styles.rewardProgress}>
                  <div className={styles.rewardBar}>
                    <div 
                      className={styles.rewardFill}
                      style={{ width: `${(stats.unlocked % 5) * 20}%` }}
                    />
                  </div>
                  <span>{stats.unlocked % 5}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementPanel;