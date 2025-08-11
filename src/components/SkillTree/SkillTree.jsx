import React, { useMemo } from 'react';
import { Brain, Lock, Star, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exercises } from '../../data/exercises';
import styles from './SkillTree.module.css';

const SkillTree = () => {
  const { 
    completedExercises, 
    currentExerciseId, 
    selectExercise, 
    isExerciseUnlocked 
  } = useApp();
  
  // Define skill tree nodes with positions
  const skillNodes = useMemo(() => [
    { 
      id: 1, 
      x: 50, 
      y: 85, 
      category: 'Fundamentals'
    },
    { 
      id: 2, 
      x: 30, 
      y: 65, 
      category: 'Fundamentals'
    },
    { 
      id: 3, 
      x: 70, 
      y: 65, 
      category: 'Aggregation'
    },
    { 
      id: 4, 
      x: 50, 
      y: 45, 
      category: 'Joins'
    },
    { 
      id: 5, 
      x: 30, 
      y: 25, 
      category: 'Advanced'
    },
    { 
      id: 6, 
      x: 70, 
      y: 25, 
      category: 'Advanced'
    }
  ], []);
  
  // Combine nodes with exercise data
  const nodes = useMemo(() => {
    return skillNodes.map(node => {
      const exercise = exercises.find(ex => ex.id === node.id);
      const isCompleted = completedExercises.includes(node.id);
      const isUnlocked = isExerciseUnlocked(node.id);
      const isCurrent = currentExerciseId === node.id;
      
      return {
        ...node,
        ...exercise,
        isCompleted,
        isUnlocked,
        isCurrent
      };
    });
  }, [skillNodes, completedExercises, currentExerciseId, isExerciseUnlocked]);
  
  // Define connections between nodes
  const connections = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 4, to: 6 }
  ];
  
  const getNodePosition = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };
  
  const handleNodeClick = (node) => {
    if (node.isUnlocked) {
      selectExercise(node.id);
    }
  };
  
  const getNodeColor = (node) => {
    if (node.isCompleted) return styles.completed;
    if (node.isCurrent) return styles.current;
    if (node.isUnlocked) return styles.unlocked;
    return styles.locked;
  };
  
  const getNodeIcon = (node) => {
    if (node.isCompleted) return <Star className={styles.nodeIcon} />;
    if (!node.isUnlocked) return <Lock className={styles.nodeIcon} />;
    if (node.isCurrent) return <Circle className={styles.nodeIcon} />;
    return <CheckCircle className={styles.nodeIcon} />;
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Brain className={styles.headerIcon} />
        <h2 className={styles.title}>SQL Skill Tree</h2>
      </div>
      
      <div className={styles.treeContainer}>
        <svg 
          viewBox="0 0 100 100" 
          className={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Render connections */}
          <g className={styles.connections}>
            {connections.map((conn, idx) => {
              const from = getNodePosition(conn.from);
              const to = getNodePosition(conn.to);
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              const isActive = fromNode?.isCompleted && toNode?.isUnlocked;
              
              return (
                <line
                  key={idx}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={`${styles.connection} ${isActive ? styles.connectionActive : ''}`}
                  strokeDasharray={isActive ? "0" : "2,2"}
                />
              );
            })}
          </g>
          
          {/* Render nodes */}
          <g className={styles.nodes}>
            {nodes.map(node => (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                className={styles.nodeGroup}
                style={{ cursor: node.isUnlocked ? 'pointer' : 'not-allowed' }}
              >
                {/* Node pulse effect for current */}
                {node.isCurrent && (
                  <circle
                    r="12"
                    className={styles.pulse}
                  />
                )}
                
                {/* Node circle */}
                <circle
                  r="8"
                  className={`${styles.node} ${getNodeColor(node)}`}
                />
                
                {/* Node icon */}
                <g transform="translate(-6, -6)">
                  {getNodeIcon(node)}
                </g>
                
                {/* Node label */}
                <text
                  y="-12"
                  className={styles.nodeLabel}
                  textAnchor="middle"
                >
                  {node.title}
                </text>
                
                {/* Difficulty badge */}
                <text
                  y="18"
                  className={styles.nodeDifficulty}
                  textAnchor="middle"
                >
                  {node.points} pts
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
      
      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.completed}`} />
          <span>Completed</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.current}`} />
          <span>Current</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.unlocked}`} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.locked}`} />
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
};

export default SkillTree;