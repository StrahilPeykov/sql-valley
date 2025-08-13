import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Code, Play, RotateCcw, Loader, 
  BookOpen, Zap, Clock,
  CheckCircle, XCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Editor.module.css';

// Simple syntax highlighter for SQL
const highlightSQL = (code) => {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
    'ON', 'AS', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
    'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'LIMIT',
    'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ];
  
  const functions = [
    'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'ROUND', 'LENGTH',
    'UPPER', 'LOWER', 'SUBSTR', 'TRIM', 'COALESCE', 'CAST'
  ];
  
  const tables = ['employees', 'departments', 'projects'];
  
  let highlighted = code;
  
  // Highlight strings
  highlighted = highlighted.replace(/'([^']*)'/g, '<span style="color: #22c55e;">\'$1\'</span>');
  
  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span style="color: #f97316;">$1</span>');
  
  // Highlight comments
  highlighted = highlighted.replace(/(--[^\n]*)/g, '<span style="color: #64748b; font-style: italic;">$1</span>');
  
  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    highlighted = highlighted.replace(regex, '<span style="color: #3b82f6; font-weight: 600;">$1</span>');
  });
  
  // Highlight functions
  functions.forEach(func => {
    const regex = new RegExp(`\\b(${func})\\b(?=\\s*\\()`, 'gi');
    highlighted = highlighted.replace(regex, '<span style="color: #8b5cf6; font-weight: 500;">$1</span>');
  });
  
  // Highlight table names
  tables.forEach(table => {
    const regex = new RegExp(`\\b(${table})\\b`, 'gi');
    highlighted = highlighted.replace(regex, '<span style="color: #ef4444; font-weight: 500;">$1</span>');
  });
  
  return highlighted;
};

// Code Editor Component using overlay technique but with proper implementation
const CodeEditor = ({ value, onChange, onKeyDown, placeholder, style, ...props }) => {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const containerRef = useRef(null);
  
  // Synchronize scroll between textarea and pre
  const handleScroll = (e) => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };
  
  // Handle text change
  const handleChange = (e) => {
    onChange(e);
  };
  
  // Handle key events
  const handleKeyDown = (e) => {
    onKeyDown(e);
  };
  
  // Focus management
  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={styles.codeEditorContainer}
      onClick={handleContainerClick}
      style={style}
    >
      {/* Syntax highlighted background */}
      <pre
        ref={preRef}
        className={styles.syntaxHighlight}
        dangerouslySetInnerHTML={{
          __html: highlightSQL(value) + '\n'
        }}
      />
      
      {/* Transparent textarea overlay */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        placeholder={placeholder}
        className={styles.codeTextarea}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        {...props}
      />
    </div>
  );
};

const SQLEditor = ({ onExecute }) => {
  const { 
    userCode, 
    setUserCode, 
    resetCurrentExercise, 
    isExecuting,
    currentExercise,
    practiceMode,
    showLineNumbers = true
  } = useApp();
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [executionTime, setExecutionTime] = useState(null);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  
  // SQL keywords and completions
  const SQL_COMPLETIONS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN',
    'employees', 'departments', 'projects',
    'id', 'name', 'salary', 'department', 'budget', 'location', 'status'
  ];
  
  // Basic SQL syntax validation
  const validateSyntax = useCallback((code) => {
    const errors = [];
    
    // Check for unclosed quotes
    const singleQuotes = (code.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      errors.push({ text: "Unclosed string", type: 'error' });
    }
    
    // Check for basic SELECT structure
    if (code.toUpperCase().includes('SELECT')) {
      if (!code.toUpperCase().includes('FROM')) {
        errors.push({ text: "Missing FROM clause", type: 'warning' });
      }
    }
    
    setSyntaxErrors(errors);
    return errors.filter(e => e.type === 'error').length === 0;
  }, []);
  
  // Auto-completion logic
  const updateSuggestions = useCallback((code, cursorPosition) => {
    const beforeCursor = code.substring(0, cursorPosition);
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1].toUpperCase();
    
    if (currentWord.length < 2) {
      setShowSuggestions(false);
      return;
    }
    
    const filtered = SQL_COMPLETIONS
      .filter(item => item.toUpperCase().startsWith(currentWord))
      .slice(0, 5);
    
    if (filtered.length > 0) {
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  }, []);
  
  // Handle text change
  const handleChange = (e) => {
    const newCode = e.target.value;
    setUserCode(newCode);
    
    // Validate syntax
    validateSyntax(newCode);
    
    // Update suggestions based on cursor position
    updateSuggestions(newCode, e.target.selectionStart);
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Handle suggestions navigation
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applySuggestion(suggestions[selectedSuggestion]);
        return;
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }
    
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isExecuting) {
        handleExecute();
      }
    }
    
    // Tab for indentation
    if (e.key === 'Tab' && !showSuggestions) {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = userCode.substring(0, start) + '  ' + userCode.substring(end);
      setUserCode(newCode);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  // Apply autocomplete suggestion
  const applySuggestion = (suggestion) => {
    // This would need cursor position tracking to work properly
    setShowSuggestions(false);
  };
  
  // Execute query with timing
  const handleExecute = async () => {
    const startTime = Date.now();
    await onExecute();
    const endTime = Date.now();
    setExecutionTime(endTime - startTime);
  };
  
  // Format SQL
  const formatSQL = () => {
    let formatted = userCode.toUpperCase();
    
    // Add newlines before major keywords
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING'];
    keywords.forEach(keyword => {
      formatted = formatted.replace(new RegExp(`\\s*${keyword}`, 'g'), `\n${keyword}`);
    });
    
    // Clean up and trim
    formatted = formatted.replace(/\s+/g, ' ').trim();
    setUserCode(formatted);
  };
  
  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <div className={styles.editorTitle}>
          <Code size={20} />
          <h3>SQL Editor</h3>
          {practiceMode && (
            <span className={styles.practiceModeBadge}>
              <Zap size={14} />
              Practice Mode
            </span>
          )}
        </div>
        
        <div className={styles.editorActions}>
          <button
            onClick={formatSQL}
            className={styles.formatButton}
            title="Format SQL"
          >
            <BookOpen size={16} />
            Format
          </button>
          
          <button
            onClick={resetCurrentExercise}
            className={styles.resetButton}
            title="Reset code"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          
          <button
            onClick={handleExecute}
            disabled={isExecuting || syntaxErrors.some(e => e.type === 'error')}
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
        <div className={styles.editorWrapper}>
          <CodeEditor
            value={userCode}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Write your SQL query here..."
            style={{
              fontFamily: "'JetBrains Mono', 'Monaco', 'Consolas', monospace",
              fontSize: '0.875rem',
              lineHeight: '1.6',
              minHeight: '200px'
            }}
          />
          
          {/* Autocomplete suggestions */}
          {showSuggestions && (
            <div className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`${styles.suggestion} ${
                    index === selectedSuggestion ? styles.selected : ''
                  }`}
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.editorFooter}>
        <div className={styles.footerLeft}>
          {syntaxErrors.length > 0 ? (
            <span className={styles.syntaxError}>
              <XCircle size={14} />
              {syntaxErrors[0].text}
            </span>
          ) : (
            <span className={styles.syntaxOk}>
              <CheckCircle size={14} />
              Syntax OK
            </span>
          )}
        </div>
        
        <div className={styles.footerCenter}>
          <span className={styles.hint}>
            <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run • 
            <kbd>Tab</kbd> for suggestions
          </span>
        </div>
        
        <div className={styles.footerRight}>
          {executionTime && (
            <span className={styles.executionTime}>
              <Clock size={14} />
              {executionTime}ms
            </span>
          )}
          <span className={styles.info}>
            Line {userCode.split('\n').length} • {userCode.length} chars
          </span>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;