import React from 'react';
import { GraduationCap, Award, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Header = () => {
  const { totalPoints, completedExercises, progressPercentage } = useApp();
  const totalExercises = 7;
  
  return (
    <header className="bg-white border-b-2 border-tue-red py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-9 h-9 text-tue-red flex-shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 leading-tight">
              SQL Valley
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Interactive SQL Learning for TU/e Database Courses
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-gray-800 text-sm font-medium">
            <CheckCircle size={18} className="text-tue-red" />
            <span>{completedExercises.length}/{totalExercises} Completed</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-800 text-sm font-medium">
            <Award size={18} className="text-tue-red" />
            <span>{totalPoints} Points</span>
          </div>
          
          <div className="w-full sm:w-48 h-5 bg-gray-200 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-tue-red transition-all duration-300 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-gray-800 mix-blend-difference">
              {progressPercentage}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;