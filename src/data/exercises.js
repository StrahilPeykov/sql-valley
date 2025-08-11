export const exercises = [
  {
    id: 1,
    title: "SELECT Basics",
    category: "Fundamentals",
    difficulty: "Beginner",
    points: 10,
    prerequisites: [],
    description: "Let's start with a simple SELECT query. Retrieve all employees from the Engineering department.",
    theory: `The SELECT statement is used to query data from a database. The WHERE clause filters records based on specified conditions.
    
    Syntax: SELECT column1, column2 FROM table WHERE condition;
    
    Use * to select all columns.`,
    hint: "Use SELECT * FROM employees WHERE department = '...'",
    initialCode: "-- Write your SQL query here\n-- Retrieve all employees from Engineering department\n\nSELECT * FROM employees",
    solution: "SELECT * FROM employees WHERE department = 'Engineering'",
    expectedRows: 3,
    checkFunction: (result) => {
      if (!result || result.length === 0) {
        return { 
          success: false, 
          message: "No results returned. Make sure to use the WHERE clause to filter by department.",
          hints: ["Check your WHERE condition", "Department names are case-sensitive"]
        };
      }
      if (result.length !== 3) {
        return { 
          success: false, 
          message: `Expected 3 rows, but got ${result.length}. Are you filtering by the correct department?`,
          hints: [`You found ${result.length} employees, but there are 3 in Engineering`]
        };
      }
      const allEngineering = result.every(row => row[2] === 'Engineering');
      if (!allEngineering) {
        return { 
          success: false, 
          message: "Not all returned employees are from the Engineering department.",
          hints: ["Check if your WHERE clause is correct"]
        };
      }
      return { 
        success: true, 
        message: "Perfect! You found all Engineering employees! 🎉",
        bonusInfo: "You successfully used the WHERE clause to filter data."
      };
    }
  },
  {
    id: 2,
    title: "Filtering with Conditions",
    category: "Fundamentals",
    difficulty: "Beginner",
    points: 15,
    prerequisites: [1],
    description: "Find all employees with a salary greater than 80000. Order them by salary descending.",
    theory: `You can use comparison operators in WHERE clauses:
    - Greater than: >
    - Less than: <
    - Equal to: =
    - Not equal to: != or <>
    
    ORDER BY sorts the results. Use DESC for descending order.`,
    hint: "Use WHERE salary > ... and ORDER BY salary DESC",
    initialCode: "-- Find high-earning employees\n-- Filter by salary > 80000\n-- Sort by salary (highest first)\n\nSELECT * FROM employees",
    solution: "SELECT * FROM employees WHERE salary > 80000 ORDER BY salary DESC",
    expectedRows: 4,
    checkFunction: (result) => {
      if (!result || result.length === 0) {
        return { 
          success: false, 
          message: "No results returned. Check your WHERE condition for salary.",
          hints: ["Use the > operator for 'greater than'"]
        };
      }
      if (result.length !== 4) {
        return { 
          success: false, 
          message: `Expected 4 employees, but got ${result.length}.`,
          hints: ["Count employees with salary > 80000"]
        };
      }
      
      // Check if all salaries > 80000
      const allHighSalary = result.every(row => row[3] > 80000);
      if (!allHighSalary) {
        return { 
          success: false, 
          message: "Some employees have salary ≤ 80000.",
          hints: ["Check your WHERE condition"]
        };
      }
      
      // Check ordering
      let prevSalary = Infinity;
      for (let row of result) {
        if (row[3] > prevSalary) {
          return { 
            success: false, 
            message: "Results are not properly ordered by salary descending.",
            hints: ["Add ORDER BY salary DESC"]
          };
        }
        prevSalary = row[3];
      }
      
      return { 
        success: true, 
        message: "Excellent! You've mastered filtering and sorting! 🚀",
        bonusInfo: "You found 4 high earners, properly sorted."
      };
    }
  },
  {
    id: 3,
    title: "Aggregate Functions",
    category: "Aggregation",
    difficulty: "Intermediate",
    points: 20,
    prerequisites: [1],
    description: "Calculate the average salary for each department. Order the results by average salary descending.",
    theory: `Aggregate functions perform calculations on sets of rows:
    - COUNT(): Count rows
    - SUM(): Sum values
    - AVG(): Average values
    - MAX()/MIN(): Find maximum/minimum
    
    GROUP BY groups rows that have the same values in specified columns.`,
    hint: "Use GROUP BY department with AVG(salary) function, then ORDER BY",
    initialCode: "-- Calculate average salary by department\n-- Group by department\n-- Order by average salary (highest first)\n\nSELECT department, AVG(salary) as avg_salary\nFROM employees",
    solution: "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department ORDER BY avg_salary DESC",
    expectedRows: 4,
    checkFunction: (result) => {
      if (!result || result.length === 0) {
        return { 
          success: false, 
          message: "No results returned. Did you forget GROUP BY?",
          hints: ["GROUP BY is required when using aggregate functions with other columns"]
        };
      }
      if (result.length !== 4) {
        return { 
          success: false, 
          message: `Expected 4 departments, got ${result.length}.`,
          hints: ["Each department should appear once"]
        };
      }
      
      // Check if ordered correctly
      let prevAvg = Infinity;
      for (let row of result) {
        if (row[1] > prevAvg) {
          return { 
            success: false, 
            message: "Results are not ordered by average salary descending.",
            hints: ["Use ORDER BY avg_salary DESC"]
          };
        }
        prevAvg = row[1];
      }
      
      // Verify it's actually averages (rough check)
      const firstDept = result[0][0];
      const expectedAvg = firstDept === 'Engineering' ? 90000 : 
                         firstDept === 'Sales' ? 76000 :
                         firstDept === 'HR' ? 70000 : 70000;
      
      if (Math.abs(result[0][1] - expectedAvg) > 1000) {
        return { 
          success: false, 
          message: "The averages don't look correct. Check your AVG() calculation.",
          hints: ["Make sure you're using AVG(salary)"]
        };
      }
      
      return { 
        success: true, 
        message: "Outstanding! You've mastered aggregate functions! 🏆",
        bonusInfo: "GROUP BY and aggregates are essential for data analysis."
      };
    }
  },
  {
    id: 4,
    title: "JOIN Operations",
    category: "Joins",
    difficulty: "Advanced",
    points: 30,
    prerequisites: [2, 3],
    description: "Find all active projects along with their department names and locations. Include the project budget in the results.",
    theory: `JOIN combines rows from two or more tables based on related columns.
    
    Types of JOINs:
    - INNER JOIN: Returns records with matching values in both tables
    - LEFT JOIN: Returns all records from left table
    - RIGHT JOIN: Returns all records from right table
    
    Syntax: SELECT columns FROM table1 JOIN table2 ON table1.column = table2.column`,
    hint: "JOIN projects with departments table ON department_id, filter by status = 'Active'",
    initialCode: "-- Join projects with departments\n-- Show: project name, department name, location, budget\n-- Only show active projects\n\nSELECT p.name, d.name, d.location, p.budget\nFROM projects p",
    solution: "SELECT p.name as project_name, d.name as dept_name, d.location, p.budget FROM projects p JOIN departments d ON p.department_id = d.id WHERE p.status = 'Active'",
    expectedRows: 2,
    checkFunction: (result) => {
      if (!result || result.length === 0) {
        return { 
          success: false, 
          message: "No results returned. Check your JOIN and WHERE clause!",
          hints: ["Use JOIN ... ON p.department_id = d.id", "Filter with WHERE status = 'Active'"]
        };
      }
      if (result.length !== 2) {
        return { 
          success: false, 
          message: `Expected 2 active projects, got ${result.length}.`,
          hints: ["Only 'Active' status projects should be included"]
        };
      }
      
      // Check if we have the right columns (4 columns expected)
      if (result[0].length !== 4) {
        return { 
          success: false, 
          message: "Expected 4 columns in the result (project name, dept name, location, budget).",
          hints: ["Select the correct columns from both tables"]
        };
      }
      
      return { 
        success: true, 
        message: "Brilliant! You've conquered JOINs! 🎯 You're ready for complex queries!",
        bonusInfo: "JOINs are crucial for combining data from multiple tables."
      };
    }
  },
  {
    id: 5,
    title: "Subqueries",
    category: "Advanced",
    difficulty: "Advanced",
    points: 35,
    prerequisites: [4],
    description: "Find all employees who earn more than the average salary of their department.",
    theory: `A subquery is a query nested inside another query. It can be used in:
    - WHERE clause
    - FROM clause  
    - SELECT clause
    
    Correlated subqueries reference columns from the outer query.`,
    hint: "Use a correlated subquery to compare each employee's salary with their department's average",
    initialCode: "-- Find employees earning above their department average\n-- Use a subquery to calculate department averages\n\nSELECT name, department, salary\nFROM employees e1\nWHERE salary > (",
    solution: `SELECT name, department, salary 
FROM employees e1 
WHERE salary > (
  SELECT AVG(salary) 
  FROM employees e2 
  WHERE e2.department = e1.department
)`,
    expectedRows: 3,
    checkFunction: (result) => {
      if (!result || result.length === 0) {
        return { 
          success: false, 
          message: "No results returned. Check your subquery logic.",
          hints: ["The subquery should calculate AVG for each department"]
        };
      }
      if (result.length !== 3) {
        return { 
          success: false, 
          message: `Expected 3 employees, got ${result.length}.`,
          hints: ["3 employees earn above their department average"]
        };
      }
      
      return { 
        success: true, 
        message: "Incredible! You've mastered subqueries! 🌟 You're now a SQL expert!",
        bonusInfo: "Correlated subqueries are powerful for row-by-row comparisons."
      };
    }
  },
  {
    id: 6,
    title: "Complex Aggregation",
    category: "Advanced",
    difficulty: "Expert",
    points: 40,
    prerequisites: [3, 4],
    description: "Find departments where the total salary budget exceeds 150000. Show department name, employee count, and total salary.",
    theory: `HAVING clause filters groups after GROUP BY (WHERE filters rows before grouping).
    
    You can combine multiple aggregate functions in one query.`,
    hint: "Use GROUP BY with HAVING SUM(salary) > 150000",
    initialCode: "-- Find departments with high salary budgets\n-- Show: department, employee count, total salary\n-- Only departments with total > 150000\n\nSELECT department, COUNT(*) as emp_count",
    solution: `SELECT department, COUNT(*) as emp_count, SUM(salary) as total_salary
FROM employees
GROUP BY department
HAVING SUM(salary) > 150000
ORDER BY total_salary DESC`,
    expectedRows: 2,
    checkFunction: (result) => {
      if (!result || result.length === 0) {
        return { 
          success: false, 
          message: "No results returned. Check your HAVING clause.",
          hints: ["HAVING filters after GROUP BY", "Use SUM(salary) > 150000"]
        };
      }
      if (result.length !== 2) {
        return { 
          success: false, 
          message: `Expected 2 departments, got ${result.length}.`,
          hints: ["Only 2 departments have total salary > 150000"]
        };
      }
      
      // Check if all totals > 150000
      for (let row of result) {
        if (row[2] <= 150000) {
          return { 
            success: false, 
            message: "Some departments have total salary ≤ 150000.",
            hints: ["Check your HAVING condition"]
          };
        }
      }
      
      return { 
        success: true, 
        message: "Phenomenal! You've achieved SQL mastery! 🏅 You're ready for any database challenge!",
        bonusInfo: "HAVING is essential for filtering aggregated data."
      };
    }
  }
];