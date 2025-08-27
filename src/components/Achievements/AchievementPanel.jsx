import React, { useState, useEffect } from 'react';
import { 
  Trophy, Award, Star, Zap, Target, TrendingUp,
  Lock, CheckCircle, Calendar, Clock, Hash,
  ChevronRight, X, Gift
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

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
        <div className="fixed top-5 right-5 z-[2000] animate-slide-in-right">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg text-white">
            <div className="text-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}>
              {newAchievement.icon}
            </div>
            <div>
              <h4 className="m-0 text-base font-semibold">Achievement Unlocked!</h4>
              <p className="m-1 text-sm opacity-90">{newAchievement.name}</p>
            </div>
            <div className="ml-auto text-lg font-bold">
              +{newAchievement.points} pts
            </div>
          </div>
        </div>
      )}
      
      {/* Main Panel */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
        <div className="w-11/12 max-w-4xl max-h-[90vh] bg-gradient-to-br from-blue-900/95 to-blue-800/95 border-2 border-tue-red/30 rounded-3xl overflow-hidden flex flex-col shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(199, 33, 37, 0.2)' }} onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-6 bg-black/30 border-b border-tue-red/20">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }} />
              <h2 className="m-0 text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Achievements
              </h2>
            </div>
            
            <button className="bg-white/10 border border-white/20 text-white/80 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/20 hover:rotate-90" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 p-6 bg-black/20">
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl transition-all duration-200 hover:bg-white/8 hover:-translate-y-0.5">
              <Award className="w-6 h-6 text-tue-red" style={{ filter: 'drop-shadow(0 0 5px rgba(199, 33, 37, 0.3))' }} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white leading-none">{stats.unlocked}</span>
                <span className="text-xs text-white/50 uppercase tracking-wide mt-1">Unlocked</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl transition-all duration-200 hover:bg-white/8 hover:-translate-y-0.5">
              <Hash className="w-6 h-6 text-tue-red" style={{ filter: 'drop-shadow(0 0 5px rgba(199, 33, 37, 0.3))' }} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white leading-none">{stats.total}</span>
                <span className="text-xs text-white/50 uppercase tracking-wide mt-1">Total</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl transition-all duration-200 hover:bg-white/8 hover:-translate-y-0.5">
              <Target className="w-6 h-6 text-tue-red" style={{ filter: 'drop-shadow(0 0 5px rgba(199, 33, 37, 0.3))' }} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white leading-none">{stats.percentage}%</span>
                <span className="text-xs text-white/50 uppercase tracking-wide mt-1">Complete</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl transition-all duration-200 hover:bg-white/8 hover:-translate-y-0.5">
              <Zap className="w-6 h-6 text-tue-red" style={{ filter: 'drop-shadow(0 0 5px rgba(199, 33, 37, 0.3))' }} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white leading-none">{stats.earnedPoints}</span>
                <span className="text-xs text-white/50 uppercase tracking-wide mt-1">Points</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="px-6 mb-5">
            <div className="flex justify-between items-center mb-2 text-white/70 text-sm">
              <span>Overall Progress</span>
              <span>{stats.earnedPoints} / {stats.totalPossiblePoints} pts</span>
            </div>
            <div className="h-2 bg-white/10 rounded overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-tue-red to-yellow-400 rounded transition-all duration-500 relative overflow-hidden"
                style={{ width: `${stats.percentage}%` }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></span>
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex gap-2 px-6 mb-5">
            {categories.map(category => (
              <button
                key={category.id}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-200 rounded-2xl ${
                  selectedCategory === category.id 
                    ? 'bg-tue-red border-tue-red text-white' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:-translate-y-0.5'
                } border`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Achievement Grid */}
          <div className="flex-1 overflow-y-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {getFilteredAchievements().map(achievement => {
              const isUnlocked = achievements.some(a => a.id === achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`flex gap-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden border ${
                    isUnlocked 
                      ? 'bg-yellow-400/10 border-yellow-400/30' 
                      : 'bg-white/3 border-white/10 opacity-60'
                  } hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full flex-shrink-0">
                    {isUnlocked ? (
                      <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }}>
                        {achievement.icon}
                      </span>
                    ) : (
                      <Lock size={24} className="text-white/50" />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h4 className="m-0 text-white text-base font-semibold mb-1">{achievement.name}</h4>
                    <p className="m-0 text-white/60 text-sm leading-5 mb-2">{achievement.description}</p>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded-xl text-yellow-400 text-xs font-semibold">
                        {achievement.points} pts
                      </span>
                      {isUnlocked && (
                        <CheckCircle size={16} className="text-green-400" style={{ filter: 'drop-shadow(0 0 5px rgba(74, 222, 128, 0.5))' }} />
                      )}
                    </div>
                  </div>
                  
                  {isUnlocked && (
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-yellow-400/10 via-transparent to-transparent animate-rotate"></div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div className="p-5 bg-black/20 border-t border-white/10">
              <h3 className="m-0 mb-4 text-white text-lg font-semibold">Recent Achievements</h3>
              <div className="flex flex-col gap-2">
                {achievements.slice(-3).reverse().map((achievement, index) => {
                  const fullAchievement = allAchievements.find(a => a.id === achievement.id);
                  if (!fullAchievement) return null;
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg transition-all duration-200 hover:bg-white/8">
                      <span className="text-xl">
                        {fullAchievement.icon}
                      </span>
                      <div className="flex-1 flex flex-col">
                        <span className="text-white text-sm font-semibold">
                          {fullAchievement.name}
                        </span>
                        <span className="text-white/50 text-xs">
                          {new Date(achievement.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-yellow-400 font-semibold">
                        +{fullAchievement.points}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Reward System */}
          <div className="p-5 bg-black/30">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-500/5 border border-yellow-400/30 rounded-xl">
              <Gift className="w-8 h-8 text-yellow-400" style={{ filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }} />
              <div className="flex-1">
                <h4 className="m-0 text-white text-base font-semibold mb-1">Next Reward</h4>
                <p className="m-0 text-white/70 text-sm mb-2">Unlock 5 more achievements for a special badge!</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${(stats.unlocked % 5) * 20}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-xs">{stats.unlocked % 5}/5</span>
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