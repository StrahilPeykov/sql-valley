export const exercises = [
  {
    id: 1,
    title: "SELECT Basics",
    category: "Fundamentals",
    difficulty: "Beginner",
    points: 10,
    prerequisites: [],
    description: "Let's start with a simple SELECT query. Retrieve all employees from the Engineering department.",
    shortDescription: "Learn the basics of SELECT statements",
    learningObjectives: [
      "Understand SELECT statement syntax",
      "Use WHERE clause for filtering",
      "Select all columns with *"
    ],
    theory: `The SELECT statement is used to query data from a database. The WHERE clause filters records based on specified conditions.
    
    Syntax: SELECT column1, column2 FROM table WHERE condition;
    
    Use * to select all columns.
    
    Example:
    SELECT * FROM users WHERE age > 18;`,
    
    hints: [
      { 
        level: 1, 
        text: "Start with SELECT * FROM employees",
        penalty: 2 
      },
      { 
        level: 2, 
        text: "Add WHERE department = 'Engineering'",
        penalty: 3 
      },
      { 
        level: 3, 
        text: "Complete solution: SELECT * FROM employees WHERE department = 'Engineering'",
        penalty: 5 
      }
    ],
    
    initialCode: "-- Retrieve all employees from Engineering department\n-- Try: SELECT * FROM employees WHERE department = 'Engineering'\n\nSELECT * FROM employees",
    solution: "SELECT * FROM employees WHERE department = 'Engineering'",
    alternativeSolutions: [
      "SELECT * FROM employees WHERE department='Engineering'",
      "select * from employees where department = 'Engineering'"
    ],
    
    testCases: [
      {
        name: "Returns results",
        weight: 20,
        check: (result) => result && result.length > 0,
        feedback: "Your query should return at least one result"
      },
      {
        name: "Correct number of rows",
        weight: 30,
        check: (result) => result && result.length === 3,
        feedback: "There are exactly 3 employees in Engineering"
      },
      {
        name: "All from Engineering",
        weight: 50,
        check: (result) => result && result.every(row => row[2] === 'Engineering'),
        feedback: "All employees should be from the Engineering department"
      }
    ],
    
    badges: [
      {
        id: "first_select",
        name: "First Query",
        description: "Complete your first SELECT statement",
        icon: "🎯"
      }
    ],
    
    bonusObjectives: [
      {
        description: "Complete without using any hints",
        points: 5,
        check: (hintsUsed) => hintsUsed === 0
      },
      {
        description: "Complete in under 60 seconds",
        points: 3,
        check: (timeSpent) => timeSpent < 60
      }
    ]
  },
  
  {
    id: 2,
    title: "Filtering with Conditions",
    category: "Fundamentals",
    difficulty: "Beginner",
    points: 15,
    prerequisites: [1],
    description: "Find all employees with a salary greater than 80000. Order them by salary descending.",
    shortDescription: "Master filtering with WHERE clauses",
    learningObjectives: [
      "Use comparison operators in WHERE clauses",
      "Order results with ORDER BY",
      "Combine filtering and sorting"
    ],
    theory: `Comparison operators in SQL:
    • Greater than: >
    • Less than: <
    • Greater than or equal: >=
    • Less than or equal: <=
    • Equal to: =
    • Not equal to: != or <>
    
    ORDER BY sorts results:
    • ASC: ascending (default)
    • DESC: descending
    
    Example:
    SELECT * FROM products 
    WHERE price > 100 
    ORDER BY price DESC;`,
    
    hints: [
      { level: 1, text: "Use WHERE salary > 80000", penalty: 2 },
      { level: 2, text: "Add ORDER BY salary DESC", penalty: 3 },
      { level: 3, text: "SELECT * FROM employees WHERE salary > 80000 ORDER BY salary DESC", penalty: 5 }
    ],
    
    initialCode: "-- Find high-earning employees\n-- Filter by salary > 80000 and sort by salary (highest first)\n\nSELECT * FROM employees\nWHERE ",
    solution: "SELECT * FROM employees WHERE salary > 80000 ORDER BY salary DESC",
    
    testCases: [
      {
        name: "Returns results",
        weight: 15,
        check: (result) => result && result.length > 0,
        feedback: "Query should return results"
      },
      {
        name: "Correct count",
        weight: 25,
        check: (result) => result && result.length === 4,
        feedback: "Should find exactly 4 employees with salary > 80000"
      },
      {
        name: "All high earners",
        weight: 30,
        check: (result) => result && result.every(row => row[3] > 80000),
        feedback: "All employees should have salary > 80000"
      },
      {
        name: "Properly sorted",
        weight: 30,
        check: (result) => {
          if (!result) return false;
          for (let i = 1; i < result.length; i++) {
            if (result[i][3] > result[i-1][3]) return false;
          }
          return true;
        },
        feedback: "Results should be sorted by salary in descending order"
      }
    ],
    
    badges: [
      {
        id: "filter_master",
        name: "Filter Master",
        description: "Successfully filter and sort data",
        icon: "🔍"
      }
    ]
  },
  
  {
    id: 3,
    title: "Aggregate Functions",
    category: "Data Analysis",
    difficulty: "Intermediate",
    points: 20,
    prerequisites: [2],
    description: "Calculate the average salary for each department. Order the results by average salary descending.",
    shortDescription: "Calculate averages, sums, and counts",
    learningObjectives: [
      "Use aggregate functions (AVG, SUM, COUNT)",
      "Group data with GROUP BY",
      "Combine aggregation with sorting"
    ],
    theory: `Aggregate functions perform calculations on sets of rows:
    
    Common Functions:
    • COUNT(*): Count all rows
    • COUNT(column): Count non-null values
    • SUM(column): Sum values
    • AVG(column): Average values
    • MAX(column): Maximum value
    • MIN(column): Minimum value
    
    GROUP BY groups rows with same values:
    SELECT department, AVG(salary) 
    FROM employees 
    GROUP BY department;
    
    Rule: Non-aggregate columns in SELECT must be in GROUP BY`,
    
    hints: [
      { level: 1, text: "Use AVG(salary) to calculate average", penalty: 2 },
      { level: 2, text: "GROUP BY department is required", penalty: 3 },
      { level: 3, text: "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC", penalty: 5 }
    ],
    
    initialCode: "-- Calculate average salary by department\n-- Group by department and order by average salary (highest first)\n\nSELECT department, AVG(salary) as avg_salary\nFROM employees\n",
    solution: "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC",
    
    testCases: [
      {
        name: "Returns results",
        weight: 10,
        check: (result) => result && result.length > 0,
        feedback: "Query should return results"
      },
      {
        name: "All departments",
        weight: 20,
        check: (result) => result && result.length === 4,
        feedback: "Should show all 4 departments"
      },
      {
        name: "Correct averages",
        weight: 40,
        check: (result) => {
          if (!result) return false;
          const expectedAvgs = {
            'Engineering': 90000,
            'Sales': 76000,
            'Marketing': 70000,
            'HR': 70000
          };
          return result.every(row => {
            const dept = row[0];
            const avg = row[1];
            return Math.abs(avg - expectedAvgs[dept]) < 1;
          });
        },
        feedback: "Averages should be correctly calculated"
      },
      {
        name: "Properly sorted",
        weight: 30,
        check: (result) => {
          if (!result) return false;
          for (let i = 1; i < result.length; i++) {
            if (result[i][1] > result[i-1][1]) return false;
          }
          return true;
        },
        feedback: "Should be sorted by average salary descending"
      }
    ],
    
    badges: [
      {
        id: "data_analyst",
        name: "Data Analyst",
        description: "Master aggregate functions",
        icon: "📊"
      }
    ]
  },
  
  {
    id: 4,
    title: "JOIN Operations",
    category: "Advanced Queries",
    difficulty: "Advanced",
    points: 30,
    prerequisites: [3],
    description: "Find all active projects along with their department names and locations.",
    shortDescription: "Combine data from multiple tables",
    learningObjectives: [
      "Understand JOIN operations",
      "Use table aliases",
      "Combine JOIN with WHERE"
    ],
    theory: `JOIN combines rows from multiple tables based on related columns.
    
    Types of JOINs:
    • INNER JOIN: Only matching rows from both tables
    • LEFT JOIN: All rows from left table, matching from right
    • RIGHT JOIN: All rows from right table, matching from left
    • FULL OUTER JOIN: All rows from both tables
    
    Syntax with aliases:
    SELECT p.name, d.name
    FROM projects p
    JOIN departments d ON p.department_id = d.id
    WHERE p.status = 'Active';`,
    
    hints: [
      { level: 1, text: "Use JOIN to connect projects and departments tables", penalty: 3 },
      { level: 2, text: "Join ON p.department_id = d.id", penalty: 4 },
      { level: 3, text: "Add WHERE p.status = 'Active' to filter", penalty: 5 }
    ],
    
    initialCode: "-- Join projects with departments to show active projects\n-- Show: project name, department name, location, budget\n\nSELECT p.name, d.name, d.location, p.budget\nFROM projects p\nJOIN departments d ON ",
    solution: "SELECT p.name as project_name, d.name as dept_name, d.location, p.budget FROM projects p JOIN departments d ON p.department_id = d.id WHERE p.status = 'Active'",
    
    testCases: [
      {
        name: "Returns results",
        weight: 15,
        check: (result) => result && result.length > 0,
        feedback: "Query should return results"
      },
      {
        name: "Active projects only",
        weight: 35,
        check: (result) => result && result.length === 2,
        feedback: "Should return exactly 2 active projects"
      },
      {
        name: "Has all columns",
        weight: 25,
        check: (result) => result && result[0] && result[0].length === 4,
        feedback: "Should return 4 columns: project name, dept name, location, budget"
      },
      {
        name: "Correct join",
        weight: 25,
        check: (result) => {
          if (!result || result.length !== 2) return false;
          // Check if we have the right projects
          const projectNames = result.map(r => r[0]);
          return projectNames.includes('Project Alpha') && projectNames.includes('Campaign 2024');
        },
        feedback: "Should join the correct active projects with their departments"
      }
    ],
    
    badges: [
      {
        id: "join_master",
        name: "JOIN Master",
        description: "Successfully combine data from multiple tables",
        icon: "🔗"
      }
    ]
  },
  
  {
    id: 5,
    title: "Subqueries",
    category: "Advanced Queries",
    difficulty: "Advanced",
    points: 35,
    prerequisites: [4],
    description: "Find all employees who earn more than the average salary of their department.",
    shortDescription: "Write queries within queries",
    learningObjectives: [
      "Understand subqueries",
      "Use correlated subqueries",
      "Compare individual vs group values"
    ],
    theory: `A subquery is a query nested inside another query.
    
    Types:
    • Simple subquery: Runs once, independent
    • Correlated subquery: References outer query, runs for each row
    
    Example correlated subquery:
    SELECT name, salary
    FROM employees e1
    WHERE salary > (
      SELECT AVG(salary)
      FROM employees e2
      WHERE e2.department = e1.department
    );
    
    This compares each employee's salary to their department's average.`,
    
    hints: [
      { level: 1, text: "Use a subquery to calculate department average", penalty: 3 },
      { level: 2, text: "Make it correlated: WHERE e2.department = e1.department", penalty: 4 },
      { level: 3, text: "Full solution uses correlated subquery with AVG", penalty: 6 }
    ],
    
    initialCode: "-- Find employees earning above their department average\n-- Use a correlated subquery to calculate department averages\n\nSELECT name, department, salary\nFROM employees e1\nWHERE salary > (\n  SELECT AVG(salary)\n  FROM employees e2\n  WHERE ",
    solution: `SELECT name, department, salary 
FROM employees e1 
WHERE salary > (
  SELECT AVG(salary) 
  FROM employees e2 
  WHERE e2.department = e1.department
)`,
    
    testCases: [
      {
        name: "Returns results",
        weight: 20,
        check: (result) => result && result.length > 0,
        feedback: "Query should return results"
      },
      {
        name: "Correct count",
        weight: 40,
        check: (result) => result && result.length === 3,
        feedback: "Should find exactly 3 employees above their department average"
      },
      {
        name: "Correct employees",
        weight: 40,
        check: (result) => {
          if (!result || result.length !== 3) return false;
          const names = result.map(r => r[0]);
          return names.includes('Alice Johnson') && 
                 names.includes('Frank Miller') && 
                 names.includes('Grace Wilson');
        },
        feedback: "Should identify the correct employees earning above department average"
      }
    ],
    
    badges: [
      {
        id: "subquery_expert",
        name: "Subquery Expert",
        description: "Master nested queries",
        icon: "🎯"
      }
    ]
  },
  
  {
    id: 6,
    title: "Complex Aggregation with HAVING",
    category: "Advanced Queries",
    difficulty: "Expert",
    points: 40,
    prerequisites: [3, 5],
    description: "Find departments where the total salary budget exceeds 150000. Show department name, employee count, and total salary.",
    shortDescription: "Master complex data analysis",
    learningObjectives: [
      "Use HAVING to filter aggregated results",
      "Combine multiple aggregate functions",
      "Understand HAVING vs WHERE"
    ],
    theory: `HAVING filters groups after GROUP BY, while WHERE filters rows before grouping.
    
    Key Difference:
    • WHERE: Filters individual rows before grouping
    • HAVING: Filters groups after aggregation
    
    Example:
    SELECT department, COUNT(*), SUM(salary)
    FROM employees
    WHERE hire_date > '2020-01-01'  -- Filter rows
    GROUP BY department
    HAVING SUM(salary) > 200000     -- Filter groups
    ORDER BY SUM(salary) DESC;
    
    You can use multiple aggregate functions in one query.`,
    
    hints: [
      { level: 1, text: "Use GROUP BY department with multiple aggregates", penalty: 3 },
      { level: 2, text: "HAVING SUM(salary) > 150000 filters after grouping", penalty: 4 },
      { level: 3, text: "Include COUNT(*) for employee count and SUM(salary) for total", penalty: 6 }
    ],
    
    initialCode: "-- Find departments with high salary budgets\n-- Show: department, employee count, total salary\n-- Only departments with total > 150000\n\nSELECT department, COUNT(*) as emp_count, SUM(salary) as total_salary\nFROM employees\nGROUP BY department\n",
    solution: `SELECT department, COUNT(*) as emp_count, SUM(salary) as total_salary
FROM employees
GROUP BY department
HAVING SUM(salary) > 150000
ORDER BY total_salary DESC`,
    
    testCases: [
      {
        name: "Returns results",
        weight: 15,
        check: (result) => result && result.length > 0,
        feedback: "Query should return results"
      },
      {
        name: "Correct departments",
        weight: 30,
        check: (result) => result && result.length === 2,
        feedback: "Should find exactly 2 departments with total salary > 150000"
      },
      {
        name: "All above threshold",
        weight: 25,
        check: (result) => result && result.every(row => row[2] > 150000),
        feedback: "All departments should have total salary > 150000"
      },
      {
        name: "Properly sorted",
        weight: 30,
        check: (result) => {
          if (!result) return false;
          for (let i = 1; i < result.length; i++) {
            if (result[i][2] > result[i-1][2]) return false;
          }
          return true;
        },
        feedback: "Should be sorted by total salary descending"
      }
    ],
    
    badges: [
      {
        id: "sql_master",
        name: "SQL Master",
        description: "Complete all exercises",
        icon: "🏆"
      },
      {
        id: "aggregation_expert",
        name: "Aggregation Expert",
        description: "Master HAVING and complex aggregations",
        icon: "💎"
      }
    ]
  },
  
  {
    id: 7,
    title: "Multiple JOINs",
    category: "Advanced Queries",
    difficulty: "Expert",
    points: 45,
    prerequisites: [4],
    description: "Find all employees with their department budgets and the number of projects in their department.",
    shortDescription: "Master complex multi-table queries",
    learningObjectives: [
      "Chain multiple JOINs",
      "Combine JOINs with aggregation",
      "Use subqueries with JOINs"
    ],
    theory: `You can chain multiple JOINs to connect several tables:
    
    SELECT columns
    FROM table1 t1
    JOIN table2 t2 ON t1.key = t2.key
    JOIN table3 t3 ON t2.key = t3.key
    WHERE conditions;
    
    You can also combine JOINs with subqueries for complex analysis.`,
    
    hints: [
      { level: 1, text: "Start by joining employees with departments", penalty: 3 },
      { level: 2, text: "Use a subquery to count projects per department", penalty: 5 },
      { level: 3, text: "Combine the JOIN with a correlated subquery for project count", penalty: 7 }
    ],
    
    initialCode: "-- Find employees with department budget and project count\n-- Show: name, department, dept_budget, project_count\n\nSELECT \n  e.name, \n  e.department, \n  d.budget as dept_budget,\n  (SELECT COUNT(*) FROM projects p WHERE p.department_id = d.id) as project_count\nFROM employees e\nJOIN departments d ON ",
    solution: `SELECT 
  e.name, 
  e.department, 
  d.budget as dept_budget,
  (SELECT COUNT(*) FROM projects p WHERE p.department_id = d.id) as project_count
FROM employees e
JOIN departments d ON e.department = d.name
ORDER BY e.department, e.name`,
    
    testCases: [
      {
        name: "Returns all employees",
        weight: 25,
        check: (result) => result && result.length === 8,
        feedback: "Should return all 8 employees"
      },
      {
        name: "Has all columns",
        weight: 25,
        check: (result) => result && result[0] && result[0].length === 4,
        feedback: "Should have 4 columns: name, department, budget, project_count"
      },
      {
        name: "Correct budgets",
        weight: 25,
        check: (result) => {
          if (!result) return false;
          const engEmployees = result.filter(r => r[1] === 'Engineering');
          return engEmployees.every(r => r[2] === 500000);
        },
        feedback: "Department budgets should be correctly joined"
      },
      {
        name: "Correct project counts",
        weight: 25,
        check: (result) => {
          if (!result) return false;
          const engEmployees = result.filter(r => r[1] === 'Engineering');
          return engEmployees.every(r => r[3] === 2);
        },
        feedback: "Project counts should be correctly calculated"
      }
    ],
    
    badges: [
      {
        id: "join_wizard",
        name: "JOIN Wizard",
        description: "Master multiple JOINs in a single query",
        icon: "🧙‍♂️"
      }
    ]
  }
];

// Helper function to calculate partial credit
export function calculateScore(testResults) {
  const totalWeight = testResults.reduce((sum, test) => sum + test.weight, 0);
  const earnedWeight = testResults.reduce((sum, test) => sum + (test.passed ? test.weight : 0), 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}

// Helper function to generate detailed feedback
export function generateDetailedFeedback(exercise, testResults, userQuery, executionTime) {
  const score = calculateScore(testResults);
  const failedTests = testResults.filter(t => !t.passed);
  
  let feedback = {
    score,
    passed: score === 100,
    summary: '',
    details: [],
    suggestions: [],
    achievements: []
  };
  
  // Summary
  if (score === 100) {
    feedback.summary = `🎉 Perfect! You've mastered ${exercise.title}!`;
    
    // Check for bonus objectives
    if (exercise.bonusObjectives) {
      exercise.bonusObjectives.forEach(bonus => {
        if (bonus.check(executionTime)) {
          feedback.achievements.push({
            text: bonus.description,
            points: bonus.points
          });
        }
      });
    }
  } else if (score >= 70) {
    feedback.summary = `Good job! You're ${score}% correct. Let's fix the remaining issues.`;
  } else if (score >= 40) {
    feedback.summary = `You're on the right track (${score}% correct), but there are some issues to address.`;
  } else {
    feedback.summary = `Let's work through this step by step. Current score: ${score}%`;
  }
  
  // Detailed test results
  testResults.forEach(test => {
    feedback.details.push({
      name: test.name,
      passed: test.passed,
      feedback: test.feedback,
      weight: test.weight
    });
  });
  
  // Suggestions based on failed tests
  if (failedTests.length > 0) {
    // Analyze common issues
    const hasNoResults = failedTests.some(t => t.name.includes('Returns results'));
    const hasWrongCount = failedTests.some(t => t.name.includes('count') || t.name.includes('number'));
    const hasWrongFilter = failedTests.some(t => t.name.includes('filter') || t.name.includes('WHERE'));
    const hasWrongSort = failedTests.some(t => t.name.includes('sort') || t.name.includes('ORDER'));
    
    if (hasNoResults) {
      feedback.suggestions.push("Your query isn't returning any results. Check your syntax and table names.");
    }
    if (hasWrongCount) {
      feedback.suggestions.push("The number of results doesn't match. Review your WHERE conditions.");
    }
    if (hasWrongFilter) {
      feedback.suggestions.push("Your filtering conditions might be incorrect. Double-check the WHERE clause.");
    }
    if (hasWrongSort) {
      feedback.suggestions.push("The sorting isn't correct. Make sure to use ORDER BY with the right column and direction.");
    }
    
    // Add learning objective reminders
    if (score < 50) {
      feedback.suggestions.push(`Review these concepts: ${exercise.learningObjectives.join(', ')}`);
    }
  }
  
  return feedback;
}

// Export utility functions for exercise management
export const exerciseUtils = {
  getExerciseById: (id) => exercises.find(e => e.id === id),
  getExercisesByCategory: (category) => exercises.filter(e => e.category === category),
  getUnlockedExercises: (completedIds) => {
    return exercises.filter(exercise => {
      if (exercise.id === 1) return true; // First exercise always unlocked
      return exercise.prerequisites.every(prereq => completedIds.includes(prereq));
    });
  },
  getNextExercise: (currentId, completedIds) => {
    const unlocked = exerciseUtils.getUnlockedExercises(completedIds);
    const incomplete = unlocked.filter(e => !completedIds.includes(e.id));
    return incomplete.find(e => e.id > currentId) || incomplete[0];
  }
};