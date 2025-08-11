import React, { useRef, useEffect } from 'react';
import { Code, Play, RotateCcw, Loader } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Editor.module.css';

const SQLEditor = ({ onExecute }) => {
  const { 
    userCode, 
    setUserCode, 
    resetCurrentExercise, 
    isExecuting,
    currentExercise 
  } = useApp();
  
  const textareaRef = useRef(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userCode]);
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isExecuting) {
        onExecute();
      }
    }
    
    // Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = userCode.substring(0, start) + '  ' + userCode.substring(end);
      setUserCode(newCode);
      
      // Restore cursor position
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  // Syntax highlighting (basic)
  const getHighlightedCode = () => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
      'ON', 'AS', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
      'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
      'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
      'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
      'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT'
    ];
    
    // This is a placeholder for syntax highlighting
    // In production, you'd use a proper code editor like CodeMirror or Monaco
    return userCode;
  };
  
  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <div className={styles.editorTitle}>
          <Code className={styles.icon} />
          <h3>SQL Editor</h3>
        </div>
        
        <div className={styles.editorActions}>
          <button
            onClick={resetCurrentExercise}
            className={styles.resetButton}
            title="Reset code (Esc)"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className={styles.runButton}
            title="Run query (Ctrl+Enter)"
          >
            {isExecuting ? (
              <>
                <Loader size={16} className={styles.spinner} />
                Running...
              </>
            ) : (
              <>
                <Play size={16} />
                Run Query
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={styles.editorBody}>
        <div className={styles.lineNumbers}>
          {userCode.split('\n').map((_, i) => (
            <div key={i} className={styles.lineNumber}>
              {i + 1}
            </div>
          ))}
        </div>
        
        <textarea
          ref={textareaRef}
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.codeInput}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Write your SQL query here..."
        />
      </div>
      
      <div className={styles.editorFooter}>
        <span className={styles.hint}>
          Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run
        </span>
        <span className={styles.info}>
          Line {userCode.split('\n').length} • 
          {userCode.length} characters
        </span>
      </div>
    </div>
  );
};

export default SQLEditor;