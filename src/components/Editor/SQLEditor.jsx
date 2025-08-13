import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Code, Play, RotateCcw, Loader, 
  Lightbulb, BookOpen, Zap, Clock,
  CheckCircle, XCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import styles from './Editor.module.css';

// SQL keywords for syntax highlighting
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'ON', 'AS', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
  'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'LIMIT',
  'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
];

const SQL_FUNCTIONS = [
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'ROUND', 'LENGTH',
  'UPPER', 'LOWER', 'SUBSTR', 'TRIM', 'COALESCE', 'CAST'
];

const SQLEditor = ({ onExecute }) => {
  const { 
    userCode, 
    setUserCode, 
    resetCurrentExercise, 
    isExecuting,
    currentExercise,
    practiceMode,
    showLineNumbers = true,
    showAutoComplete = true
  } = useApp();
  
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [executionTime, setExecutionTime] = useState(null);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(250, Math.min(500, textareaRef.current.scrollHeight));
      textareaRef.current.style.height = `${newHeight}px`;
      if (highlightRef.current) {
        highlightRef.current.style.height = `${newHeight}px`;
      }
    }
  }, [userCode]);
  
  // Syntax highlighting
  const getHighlightedCode = useCallback(() => {
    let highlighted = userCode;
    
    // Highlight strings
    highlighted = highlighted.replace(/'[^']*'/g, '<span class="string">$&</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\b/g, '<span class="number">$&</span>');
    
    // Highlight keywords (case-insensitive)
    SQL_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="keyword">$&</span>');
    });
    
    // Highlight functions
    SQL_FUNCTIONS.forEach(func => {
      const regex = new RegExp(`\\b${func}\\b(?=\\s*\\()`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="function">$&</span>');
    });
    
    // Highlight comments
    highlighted = highlighted.replace(/--[^\n]*/g, '<span class="comment">$&</span>');
    
    // Highlight table names (simple heuristic)
    highlighted = highlighted.replace(/\b(employees|departments|projects)\b/gi, '<span class="table">$&</span>');
    
    // Add line breaks
    highlighted = highlighted.replace(/\n/g, '<br>');
    
    // Highlight syntax errors
    syntaxErrors.forEach(error => {
      const errorRegex = new RegExp(`\\b${error.text}\\b`, 'g');
      highlighted = highlighted.replace(errorRegex, `<span class="error">$&</span>`);
    });
    
    return highlighted;
  }, [userCode, syntaxErrors]);
  
  // Basic SQL syntax validation
  const validateSyntax = useCallback((code) => {
    const errors = [];
    
    // Check for unclosed quotes
    const singleQuotes = (code.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      errors.push({ line: null, text: "Unclosed string", type: 'error' });
    }
    
    // Check for basic SELECT structure
    if (code.toUpperCase().includes('SELECT')) {
      if (!code.toUpperCase().includes('FROM')) {
        errors.push({ line: null, text: "Missing FROM clause", type: 'warning' });
      }
    }
    
    // Check for common typos
    const commonTypos = [
      { wrong: 'SELCT', correct: 'SELECT' },
      { wrong: 'FORM', correct: 'FROM' },
      { wrong: 'WEHRE', correct: 'WHERE' },
      { wrong: 'GROPU', correct: 'GROUP' }
    ];
    
    commonTypos.forEach(typo => {
      if (code.toUpperCase().includes(typo.wrong)) {
        errors.push({ 
          line: null, 
          text: `Did you mean ${typo.correct}?`, 
          type: 'warning' 
        });
      }
    });
    
    setSyntaxErrors(errors);
    return errors.length === 0;
  }, []);
  
  // Auto-completion logic
  const updateSuggestions = useCallback((code, position) => {
    const beforeCursor = code.substring(0, position);
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1].toUpperCase();
    
    if (currentWord.length < 2) {
      setShowSuggestions(false);
      return;
    }
    
    // Combine all possible completions
    const allCompletions = [
      ...SQL_KEYWORDS,
      ...SQL_FUNCTIONS,
      'employees', 'departments', 'projects', // table names
      'id', 'name', 'salary', 'department', 'budget', 'location', 'status' // common columns
    ];
    
    const filtered = allCompletions
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
    setCursorPosition(e.target.selectionStart);
    
    // Validate syntax
    validateSyntax(newCode);
    
    // Update suggestions
    if (showAutoComplete) {
      updateSuggestions(newCode, e.target.selectionStart);
    }
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
    
    // Ctrl/Cmd + Space for suggestions
    if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
      e.preventDefault();
      updateSuggestions(userCode, cursorPosition);
    }
    
    // Tab for indentation (when not using suggestions)
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
    const beforeCursor = userCode.substring(0, cursorPosition);
    const afterCursor = userCode.substring(cursorPosition);
    const words = beforeCursor.split(/\s+/);
    const lastWordStart = beforeCursor.lastIndexOf(words[words.length - 1]);
    
    const newCode = 
      userCode.substring(0, lastWordStart) + 
      suggestion + 
      afterCursor;
    
    setUserCode(newCode);
    setShowSuggestions(false);
    
    // Set cursor position after the inserted word
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = lastWordStart + suggestion.length;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
        textareaRef.current.focus();
      }
    }, 0);
  };
  
  // Execute query with timing
  const handleExecute = async () => {
    const startTime = Date.now();
    await onExecute();
    const endTime = Date.now();
    setExecutionTime(endTime - startTime);
  };
  
  // Format SQL (basic formatting)
  const formatSQL = () => {
    let formatted = userCode.toUpperCase();
    
    // Add newlines before major keywords
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING'];
    keywords.forEach(keyword => {
      formatted = formatted.replace(new RegExp(`\\s*${keyword}`, 'g'), `\n${keyword}`);
    });
    
    // Clean up multiple spaces and trim
    formatted = formatted.replace(/\s+/g, ' ').trim();
    
    setUserCode(formatted);
  };
  
  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <div className={styles.editorTitle}>
          <Code className={styles.icon} />
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
            title="Reset code (Esc)"
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
        {showLineNumbers && (
          <div className={styles.lineNumbers}>
            {userCode.split('\n').map((_, i) => (
              <div key={i} className={styles.lineNumber}>
                {i + 1}
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.editorWrapper}>
          {/* Syntax highlighted overlay */}
          <div 
            ref={highlightRef}
            className={styles.highlightedCode}
            dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
          />
          
          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={userCode}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={styles.codeInput}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Write your SQL query here..."
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
            <kbd>Ctrl</kbd>+<kbd>Space</kbd> for suggestions
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