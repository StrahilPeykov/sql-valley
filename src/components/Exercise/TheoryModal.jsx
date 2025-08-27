import React from 'react';
import { X, BookOpen } from 'lucide-react';

const TheoryModal = ({ isOpen, onClose, theory, exerciseTitle }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fade-in" onClick={handleOverlayClick}>
      <div className="w-full max-w-3xl max-h-4/5 bg-white rounded-xl overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-tue-red" />
            <h2 className="m-0 text-xl font-semibold text-gray-800">
              Theory: {exerciseTitle}
            </h2>
          </div>
          <button 
            className="bg-transparent border-none text-gray-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <pre className="m-0 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {theory}
          </pre>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            className="bg-tue-red text-white border-none px-6 py-2.5 rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-tue-red-dark"
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryModal;