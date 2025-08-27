import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X, GraduationCap } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-5">
      <div className="w-full max-w-lg bg-white rounded-xl p-8 relative shadow-2xl">
        <button 
          className="absolute top-4 right-4 bg-transparent border-none text-gray-600 p-2 cursor-pointer transition-all duration-200 rounded hover:bg-gray-50 hover:text-gray-800"
          onClick={onComplete}
        >
          <X size={20} />
        </button>
        
        <div className="flex justify-center mb-6 text-tue-red">
          <GraduationCap size={48} />
        </div>
        
        <h2 className="text-center text-2xl font-semibold text-gray-800 m-0 mb-6">
          {steps[currentStep].title}
        </h2>
        
        <div className="text-gray-700 leading-7 mb-8">
          {steps[currentStep].content}
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'w-6 bg-tue-red rounded' : 
                  index < currentStep ? 'bg-gray-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between gap-3">
            <button
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-gray-600 border border-gray-300 rounded-md font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            
            <button
              className="flex items-center gap-1.5 px-5 py-2.5 bg-tue-red text-white border border-tue-red rounded-md font-medium cursor-pointer transition-all duration-200 hover:bg-tue-red-dark hover:border-tue-red-dark"
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