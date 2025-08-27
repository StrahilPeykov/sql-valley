import React from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const FeedbackPanel = () => {
  const { feedback, currentExercise } = useApp();
  const [showDetails, setShowDetails] = React.useState(false);
  
  if (!feedback) return null;
  
  const getIcon = () => {
    if (feedback.score === 100) return <CheckCircle className="w-5 h-5" />;
    if (feedback.score >= 50) return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };
  
  const getPanelClass = () => {
    if (feedback.score === 100) return 'border-green-500 bg-green-50';
    if (feedback.score >= 50) return 'border-yellow-400 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };
  
  const getIconColor = () => {
    if (feedback.score === 100) return 'text-green-500';
    if (feedback.score >= 50) return 'text-yellow-400';
    return 'text-red-500';
  };
  
  return (
    <div className={`rounded-lg border overflow-hidden bg-white ${getPanelClass()}`}>
      <div className="flex items-center gap-3 p-3">
        <div className={`${getIconColor()} flex-shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <strong className="text-gray-800 text-sm">
            {feedback.summary || feedback.message}
          </strong>
          {feedback.score !== undefined && (
            <span className="text-gray-600 text-xs">Score: {feedback.score}%</span>
          )}
        </div>
        
        {feedback.details && feedback.details.length > 0 && (
          <button
            className="p-1 bg-transparent border border-gray-300 rounded text-gray-600 cursor-pointer transition-all duration-200 hover:bg-white hover:border-gray-400"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      
      {showDetails && feedback.details && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <h4 className="m-0 mb-2 text-gray-700 text-sm font-semibold">Test Results:</h4>
          <ul className="list-none p-0 m-0 mb-4">
            {feedback.details.map((test, index) => (
              <li key={index} className={`flex items-start gap-2 py-1.5 text-sm text-gray-800 ${test.passed ? 'passed' : 'failed'}`}>
                <span className={`w-4 text-center font-semibold ${test.passed ? 'text-green-500' : 'text-red-500'}`}>
                  {test.passed ? '✓' : '✗'}
                </span>
                <span className="font-medium">{test.name}</span>
                {!test.passed && (
                  <span className="text-gray-600 text-xs">- {test.feedback}</span>
                )}
              </li>
            ))}
          </ul>
          
          {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <h4 className="m-0 mb-2 text-gray-700 text-sm font-semibold">Suggestions:</h4>
              <ul className="m-0 pl-5 text-gray-700 text-sm leading-relaxed">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="my-1">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;