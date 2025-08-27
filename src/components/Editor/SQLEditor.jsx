import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Code, Play, RotateCcw, Loader, 
  BookOpen, Zap, Clock,
  CheckCircle, XCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

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
  
  const tables = ['customer', 'store', 'product', 'shoppinglist', 'purchase', 'inventory'];
  
  // First, extract and preserve comments and strings with placeholders
  const preservedItems = [];
  let highlighted = code;
  
  // Extract comments
  highlighted = highlighted.replace(/(--[^\n]*)/g, (match) => {
    const index = preservedItems.length;
    preservedItems.push(`<span style="color: #64748b; font-style: italic;">${match}</span>`);
    return `__COMMENT_${index}__`;
  });
  
  // Extract strings
  highlighted = highlighted.replace(/'([^']*)'/g, (match, content) => {
    const index = preservedItems.length;
    preservedItems.push(`<span style="color: #22c55e;">'${content}'</span>`);
    return `__STRING_${index}__`;
  });
  
  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span style="color: #f97316;">$1</span>');
  
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
  
  // Finally, restore preserved comments and strings
  preservedItems.forEach((item, index) => {
    highlighted = highlighted.replace(`__COMMENT_${index}__`, item);
    highlighted = highlighted.replace(`__STRING_${index}__`, item);
  });
  
  return highlighted;
};

// Code Editor Component using overlay technique
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
      className="relative w-full min-h-[200px] border border-gray-300 rounded bg-white overflow-auto font-mono text-sm leading-relaxed focus-within:border-tue-red focus-within:shadow-sm focus-within:shadow-tue-red/10"
      onClick={handleContainerClick}
      style={style}
    >
      {/* Syntax highlighted background */}
      <pre
        ref={preRef}
        className="absolute top-0 left-0 right-0 bottom-0 m-0 p-3 bg-transparent text-gray-800 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-10 border-none outline-none resize-none"
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
        className="absolute top-0 left-0 right-0 bottom-0 w-full h-full m-0 p-3 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-transparent caret-gray-800 z-20"
        style={{ WebkitTextFillColor: 'transparent' }}
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
    currentExerciseId,
    showLineNumbers = true
  } = useApp();
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [executionTime, setExecutionTime] = useState(null);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [wordStart, setWordStart] = useState(0);
  const textareaRef = useRef(null);
  
  // SQL keywords and completions
  const SQL_COMPLETIONS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN',
    'customer', 'store', 'product', 'shoppinglist', 'purchase', 'inventory',
    'cID', 'cName', 'street', 'city', 'sID', 'sName', 'pID', 'pName', 'suffix',
    'tID', 'quantity', 'price', 'unit_price', 'date', 'EXISTS', 'NOT EXISTS',
    'DISTINCT', 'AS', 'AND', 'OR', 'IN', 'NOT IN'
  ];
  
  // Reset suggestions when exercise changes
  useEffect(() => {
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestion(0);
  }, [currentExerciseId]);
  
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
  
  // Get word at cursor position
  const getWordAtCursor = useCallback((text, position) => {
    const beforeCursor = text.substring(0, position);
    const afterCursor = text.substring(position);
    
    // Find word boundaries
    const wordRegex = /\w+$/;
    const beforeMatch = beforeCursor.match(wordRegex);
    const afterMatch = afterCursor.match(/^\w+/);
    
    const wordStartPos = beforeMatch ? position - beforeMatch[0].length : position;
    const word = (beforeMatch ? beforeMatch[0] : '') + (afterMatch ? afterMatch[0] : '');
    
    return {
      word: beforeMatch ? beforeMatch[0] : '',
      start: wordStartPos,
      end: position + (afterMatch ? afterMatch[0].length : 0)
    };
  }, []);
  
  // Auto-completion logic
  const updateSuggestions = useCallback((code, cursorPos) => {
    const wordInfo = getWordAtCursor(code, cursorPos);
    const currentWordLower = wordInfo.word.toLowerCase();
    
    setCurrentWord(wordInfo.word);
    setWordStart(wordInfo.start);
    
    if (currentWordLower.length < 2) {
      setShowSuggestions(false);
      return;
    }
    
    const filtered = SQL_COMPLETIONS
      .filter(item => item.toLowerCase().startsWith(currentWordLower))
      .filter(item => item.toLowerCase() !== currentWordLower) // Don't suggest exact matches
      .slice(0, 8);
    
    if (filtered.length > 0) {
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  }, [getWordAtCursor]);
  
  // Handle text change
  const handleChange = (e) => {
    const newCode = e.target.value;
    const newCursorPos = e.target.selectionStart;
    
    setUserCode(newCode);
    setCursorPosition(newCursorPos);
    
    // Validate syntax
    validateSyntax(newCode);
    
    // Update suggestions based on cursor position
    updateSuggestions(newCode, newCursorPos);
  };
  
  // Apply autocomplete suggestion
  const applySuggestion = useCallback((suggestion) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current.querySelector('textarea');
    if (!textarea) return;
    
    const beforeWord = userCode.substring(0, wordStart);
    const afterWord = userCode.substring(wordStart + currentWord.length);
    const newCode = beforeWord + suggestion + afterWord;
    const newCursorPos = wordStart + suggestion.length;
    
    setUserCode(newCode);
    setShowSuggestions(false);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [userCode, wordStart, currentWord]);
  
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
  
  // Handle clicks outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && !event.target.closest('.suggestions') && 
          !event.target.closest('.code-editor-container')) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);
  
  // Execute query with timing
  const handleExecute = async () => {
    const startTime = Date.now();
    await onExecute();
    const endTime = Date.now();
    setExecutionTime(endTime - startTime);
  };
  
  // Format SQL
  const formatSQL = () => {
    let code = userCode.trim();
    
    // Don't format if empty
    if (!code) return;
    
    // Split by lines and process each line separately
    const lines = code.split('\n');
    let sqlParts = [];
    
    // Extract SQL parts (non-comment parts) from each line
    lines.forEach(line => {
      const commentIndex = line.indexOf('--');
      if (commentIndex === -1) {
        // No comment, whole line is SQL
        if (line.trim()) sqlParts.push(line.trim());
      } else if (commentIndex === 0) {
        // Whole line is comment, skip for SQL processing but keep for later
        return;
      } else {
        // Line has both SQL and comment, extract SQL part
        const sqlPart = line.substring(0, commentIndex).trim();
        if (sqlPart) sqlParts.push(sqlPart);
      }
    });
    
    // Join SQL parts and format them
    let formatted = sqlParts.join(' ');
    
    // Normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ').trim();
    
    // Keywords that should start new lines
    const majorKeywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
      'GROUP BY', 'ORDER BY', 'HAVING', 'UNION', 'INSERT', 'UPDATE', 'DELETE'
    ];
    
    // Keywords that should be uppercase but not create new lines
    const minorKeywords = [
      'AS', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
      'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'DESC', 'ASC', 'LIMIT',
      'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
    ];
    
    // Sort by length (longest first) to avoid partial replacements
    const allKeywords = [...majorKeywords, ...minorKeywords].sort((a, b) => b.length - a.length);
    
    // Make keywords uppercase
    allKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, keyword.toUpperCase());
    });
    
    // Add newlines before major keywords (but not at the start)
    majorKeywords.forEach(keyword => {
      const upperKeyword = keyword.toUpperCase();
      formatted = formatted.replace(
        new RegExp(`(.)\\s*\\b${upperKeyword}\\b`, 'g'), 
        `$1\n${upperKeyword}`
      );
    });
    
    // Clean up: remove empty lines and trim each line
    formatted = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    // Now reconstruct with original comments
    const formattedLines = formatted.split('\n');
    const originalLines = code.split('\n');
    let result = [];
    let formattedIndex = 0;
    
    originalLines.forEach(originalLine => {
      const commentIndex = originalLine.indexOf('--');
      
      if (commentIndex === 0) {
        // Whole line is comment, keep as-is
        result.push(originalLine);
      } else if (commentIndex === -1) {
        // No comment, use formatted version
        if (originalLine.trim() && formattedIndex < formattedLines.length) {
          result.push(formattedLines[formattedIndex]);
          formattedIndex++;
        }
      } else {
        // Line has both SQL and comment
        const comment = originalLine.substring(commentIndex);
        if (formattedIndex < formattedLines.length) {
          // Use formatted SQL + original comment
          result.push(formattedLines[formattedIndex] + ' ' + comment);
          formattedIndex++;
        }
      }
    });
    
    // If we have remaining formatted lines (edge case), add them
    while (formattedIndex < formattedLines.length) {
      result.push(formattedLines[formattedIndex]);
      formattedIndex++;
    }
    
    setUserCode(result.join('\n'));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 border-b border-gray-200 gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Code size={20} />
          <h3 className="m-0 text-base font-semibold text-gray-800">SQL Editor</h3>
          {practiceMode && (
            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-800 rounded-full text-xs font-semibold">
              <Zap size={14} />
              Practice Mode
            </span>
          )}
        </div>
        
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <button
            onClick={formatSQL}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded font-medium cursor-pointer transition-all duration-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 whitespace-nowrap flex-1 sm:flex-initial justify-center"
            title="Format SQL"
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline">Format</span>
          </button>
          
          <button
            onClick={resetCurrentExercise}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded font-medium cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 whitespace-nowrap flex-1 sm:flex-initial justify-center"
            title="Reset code"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button
            onClick={handleExecute}
            disabled={isExecuting || syntaxErrors.some(e => e.type === 'error')}
            className="flex items-center gap-1.5 px-3 py-2 bg-tue-red text-white border border-tue-red rounded font-medium cursor-pointer transition-all duration-200 hover:bg-tue-red-dark hover:border-tue-red-dark disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex-1 sm:flex-initial justify-center"
            title="Run query (Ctrl+Enter)"
          >
            {isExecuting ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span className="hidden sm:inline">Run Query</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="relative flex-1 min-h-[200px]" ref={textareaRef}>
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
            <div className="suggestions absolute top-full left-3 right-3 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto backdrop-blur-sm animate-slide-down">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`px-3 py-2 cursor-pointer font-mono text-sm transition-colors border-b border-gray-100 text-gray-700 flex items-center select-none last:border-b-0 ${
                    index === selectedSuggestion ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent losing focus
                    applySuggestion(suggestion);
                  }}
                  onMouseEnter={() => setSelectedSuggestion(index)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-600 gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          {syntaxErrors.length > 0 ? (
            <span className="flex items-center gap-1 text-red-500">
              <XCircle size={14} />
              {syntaxErrors[0].text}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle size={14} />
              Syntax OK
            </span>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-2 flex-1 justify-center">
          <span className="flex items-center gap-1">
            <kbd className="bg-white border border-gray-300 rounded px-1.5 py-0.5 font-mono text-xs shadow-sm">Ctrl</kbd>+<kbd className="bg-white border border-gray-300 rounded px-1.5 py-0.5 font-mono text-xs shadow-sm">Enter</kbd> to run • 
            <kbd className="bg-white border border-gray-300 rounded px-1.5 py-0.5 font-mono text-xs shadow-sm">Tab</kbd> for suggestions
          </span>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {executionTime && (
            <span className="flex items-center gap-1 text-gray-600">
              <Clock size={14} />
              {executionTime}ms
            </span>
          )}
          <span className="text-gray-600">
            Line {userCode.split('\n').length} • {userCode.length} chars
          </span>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;