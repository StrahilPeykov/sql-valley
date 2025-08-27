import React from 'react';
import { GraduationCap } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <GraduationCap className="w-12 h-12 text-tue-red mb-4 mx-auto animate-pulse-slow" />
        <h2 className="text-gray-800 text-2xl font-semibold m-0 mb-6">
          Loading SQL Valley
        </h2>
        <div className="w-48 h-1 bg-gray-200 rounded-sm overflow-hidden mx-auto relative">
          <div className="absolute h-full w-8 bg-tue-red animate-loading" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;