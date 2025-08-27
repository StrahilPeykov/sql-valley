import React from 'react';
import { CheckCircle, Lock, Circle, ChevronRight, Edit3 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exercises } from '../../data/exercises';

const SkillTree = () => {
  const { 
    completedExercises, 
    currentExerciseId, 
    selectExercise, 
    isExerciseUnlocked,
    practiceMode,
    togglePracticeMode,
    savedQueries
  } = useApp();
  
  const getExerciseStatus = (exercise) => {
    if (completedExercises.includes(exercise.id)) return 'completed';
    if (currentExerciseId === exercise.id) return 'current';
    if (isExerciseUnlocked(exercise.id) || practiceMode) return 'available';
    return 'locked';
  };
  
  const hasUnsavedWork = (exerciseId) => {
    const savedCode = savedQueries[exerciseId];
    if (!savedCode) return false;
    
    // Get the initial code for this exercise
    const exercise = exercises.find(e => e.id === exerciseId);
    const initialCode = exercise?.initialCode || '-- Write your SQL query here\n\n';
    
    // Normalize both codes (remove comments, extra whitespace, make lowercase)
    const normalize = (code) => {
      return code
        .replace(/--[^\n]*/g, '') // Remove comments
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .trim()
        .toLowerCase();
    };
    
    const normalizedSaved = normalize(savedCode);
    const normalizedInitial = normalize(initialCode);
    
    // Only show pen if there's meaningful difference and some actual SQL content
    return normalizedSaved !== normalizedInitial && 
           normalizedSaved.length > 0 && 
           !normalizedSaved.match(/^(write your sql query here)?$/);
  };
  
  const handleExerciseClick = (exercise) => {
    const status = getExerciseStatus(exercise);
    if (status !== 'locked' || practiceMode) {
      selectExercise(exercise.id);
    }
  };
  
  // Group exercises by category
  const categories = [...new Set(exercises.map(e => e.category))];
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 m-0">
          Exercises
        </h2>
        <button 
          className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-200 border ${
            practiceMode 
              ? 'bg-tue-red border-tue-red text-white' 
              : 'bg-white border-gray-300 text-gray-600 hover:border-tue-red hover:text-tue-red'
          }`}
          onClick={togglePracticeMode}
        >
          {practiceMode ? 'Exit Practice' : 'Practice Mode'}
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        {categories.map(category => (
          <div key={category} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase text-gray-600 tracking-wider m-0">
              {category}
            </h3>
            <div className="flex flex-col gap-1">
              {exercises
                .filter(e => e.category === category)
                .map(exercise => {
                  const status = getExerciseStatus(exercise);
                  const hasSavedWork = hasUnsavedWork(exercise.id);
                  
                  return (
                    <button
                      key={exercise.id}
                      className={`flex items-center gap-2 p-2.5 bg-white border rounded transition-all duration-200 text-left w-full
                        ${status === 'completed' ? 'bg-blue-50 border-green-500' : ''}
                        ${status === 'current' ? 'bg-yellow-50 border-tue-red' : ''}
                        ${status === 'available' ? 'border-gray-200 hover:bg-gray-50 hover:border-tue-red' : ''}
                        ${status === 'locked' && !practiceMode ? 'bg-gray-50 opacity-50' : ''}
                        ${hasSavedWork && status === 'completed' ? 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50' : ''}
                        ${hasSavedWork && status === 'current' ? 'border-l-4 border-l-tue-red bg-gradient-to-r from-tue-red/5 to-yellow-50' : ''}
                        ${hasSavedWork && status === 'available' ? 'border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-transparent' : ''}
                      `}
                      onClick={() => handleExerciseClick(exercise)}
                      disabled={status === 'locked' && !practiceMode}
                    >
                      <div className="flex items-center text-gray-400 flex-shrink-0">
                        {status === 'completed' ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : status === 'locked' && !practiceMode ? (
                          <Lock size={18} />
                        ) : (
                          <Circle size={18} className={status === 'current' ? 'text-tue-red' : status === 'available' ? 'text-blue-400' : ''} />
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                            {exercise.id}. {exercise.title}
                          </span>
                          {hasSavedWork && (
                            <Edit3 size={12} className="text-yellow-400 flex-shrink-0" title="Has saved work" style={{ filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))' }} />
                          )}
                        </div>
                        <span className="text-xs text-gray-600">
                          {exercise.points} pts
                        </span>
                      </div>
                      
                      {status === 'current' && (
                        <ChevronRight size={16} className="text-tue-red flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;