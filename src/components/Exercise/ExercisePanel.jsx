import React, { useState } from 'react';
import { BookOpen, Info, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TheoryModal from './TheoryModal';

const ExercisePanel = () => {
  const { currentExercise, practiceMode, setUserCode } = useApp();
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  // Copy solution to clipboard and editor
  const copySolutionToEditor = () => {
    if (currentExercise.solution) {
      setUserCode(currentExercise.solution);
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    }
  };

  // Simple SQL syntax highlighting for solutions
  const highlightSQLSolution = (code) => {
    if (!code) return '';
    
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
      'ON', 'AS', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
      'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
      'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'LIMIT', 'UNION'
    ];
    
    let highlighted = code;
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="text-blue-600 font-semibold">$1</span>`);
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/'([^']*)'/g, `<span class="text-blue-900">'$1'</span>`);
    
    // Highlight table names
    const tables = ['customer', 'store', 'product', 'shoppinglist', 'purchase', 'inventory'];
    tables.forEach(table => {
      const regex = new RegExp(`\\b(${table})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="text-red-500 font-medium">$1</span>`);
    });
    
    return highlighted;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-800 m-0 flex-1 min-w-0">
                Exercise {currentExercise.id}: {currentExercise.title}
              </h3>
              <div className="flex gap-2 items-center flex-wrap">
                {currentExercise.theory && (
                  <button
                    onClick={() => setShowTheoryModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-600 rounded-2xl text-blue-800 text-xs font-semibold cursor-pointer transition-all duration-200 uppercase tracking-wide flex-shrink-0 hover:from-blue-100 hover:to-blue-200 hover:border-blue-800 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-blue-600/20"
                    title="Click to view theory and concepts for this exercise"
                  >
                    <Info size={16} style={{ filter: 'drop-shadow(0 1px 2px rgba(29, 78, 216, 0.1))' }} />
                    <span>Theory</span>
                  </button>
                )}
                {practiceMode && (
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-600 rounded-2xl text-yellow-800 text-xs font-semibold cursor-pointer transition-all duration-200 uppercase tracking-wide flex-shrink-0 hover:from-yellow-200 hover:to-yellow-300 hover:border-yellow-700 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-yellow-600/20"
                    title="View the solution (Practice Mode only)"
                  >
                    {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{showSolution ? 'Hide' : 'Show'} Solution</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-3 text-sm items-center flex-shrink-0">
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded font-medium text-xs">
                {currentExercise.difficulty}
              </span>
              <span className="text-tue-red font-semibold whitespace-nowrap">
                {currentExercise.points} points
              </span>
              {practiceMode && (
                <span className="text-yellow-800 font-medium text-xs px-2 py-0.5 bg-yellow-100 rounded-full border border-yellow-600">
                  Practice Mode - Solutions Available
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-gray-800 leading-relaxed m-0 mb-4 text-[0.95rem]">
            {currentExercise.description}
          </p>
          
          {/* Solution Section - Only in Practice Mode */}
          {practiceMode && showSolution && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded-md">
              <div className="flex justify-between items-center mb-2 flex-col sm:flex-row gap-2">
                <h4 className="m-0 text-gray-700 text-sm font-semibold">Solution</h4>
                <button
                  onClick={copySolutionToEditor}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded cursor-pointer transition-all duration-200 hover:bg-gray-800 self-start sm:self-auto"
                  title="Copy solution to editor"
                >
                  {copiedSolution ? <Check size={16} /> : <Copy size={16} />}
                  {copiedSolution ? 'Copied!' : 'Copy to Editor'}
                </button>
              </div>
              
              <div className="bg-gray-100 rounded p-3 mb-2 border border-gray-300 overflow-x-auto">
                <pre
                  className="m-0 text-gray-700 font-mono text-[0.85rem] leading-6 whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: highlightSQLSolution(currentExercise.solution)
                  }}
                />
              </div>
              
              {/* Alternative Solutions */}
              {currentExercise.alternativeSolutions && currentExercise.alternativeSolutions.length > 0 && (
                <div className="mt-3">
                  <h5 className="m-0 mb-1.5 text-gray-700 text-xs font-semibold">Alternative approaches:</h5>
                  {currentExercise.alternativeSolutions.map((altSolution, index) => (
                    <div key={index} className="bg-gray-100 rounded p-2 mb-1.5 border border-gray-300 overflow-x-auto">
                      <pre
                        className="m-0 text-gray-700 font-mono text-xs leading-5 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: highlightSQLSolution(altSolution)
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-600 rounded text-xs text-gray-700 leading-5">
                <strong>Learning Tip:</strong> Try to understand each part of the solution. 
                Experiment by modifying it to see how the results change!
              </div>
            </div>
          )}
        </div>
      </div>
      
      <TheoryModal
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
        theory={currentExercise.theory}
        exerciseTitle={currentExercise.title}
      />
    </>
  );
};

export default ExercisePanel;