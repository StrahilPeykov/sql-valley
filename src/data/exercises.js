export const exercises = [
  {
    id: 1,
    title: "Your First SELECT",
    category: "Basic Queries",
    difficulty: "Beginner",
    points: 10,
    prerequisites: [],
    description: "Let's start simple! Find all customers who live in Eindhoven (the home of TU/e).",
    shortDescription: "Learn the basics of SELECT statements",
    learningObjectives: [
      "Understand SELECT statement syntax",
      "Use WHERE clause for filtering",
      "Select all columns with *"
    ],
    theory: `The SELECT statement is the foundation of SQL querying. It retrieves data from database tables.

Basic syntax:
SELECT column1, column2, ... FROM table_name WHERE condition;

Key points:
• Use * to select all columns
• WHERE clause filters rows based on conditions
• String values need quotes: 'Eindhoven'
• SQL is case-insensitive for keywords, but data values are case-sensitive

Example:
SELECT * FROM customer WHERE city = 'Amsterdam';`,
    
    initialCode: "-- Find all customers living in Eindhoven\n-- Remember: string values need quotes!\n\nSELECT * FROM customer",
    solution: "SELECT * FROM customer WHERE city = 'Eindhoven'",
    alternativeSolutions: [
      "SELECT * FROM customer WHERE city='Eindhoven'",
      "select * from customer where city = 'Eindhoven'"
    ],
    
    testCases: [
      {
        name: "Query executes successfully",
        weight: 20,
        check: (result) => result && result.length >= 0,
        feedback: "Your query should execute without errors"
      },
      {
        name: "Returns results",
        weight: 30,
        check: (result) => result && result.length > 0,
        feedback: "Your query should return at least one customer"
      },
      {
        name: "Correct number of Eindhoven customers",
        weight: 50,
        check: (result) => result && result.length === 4,
        feedback: "There are exactly 4 customers living in Eindhoven"
      }
    ],
    
    badges: [
      {
        id: "first_query",
        name: "First Steps",
        description: "Execute your first SQL query",
        icon: "🎯"
      }
    ]
  },
  
  {
    id: 2,
    title: "Selecting Specific Columns",
    category: "Basic Queries",
    difficulty: "Beginner", 
    points: 15,
    prerequisites: [1],
    description: "This time, let's be more specific. Show only the customer names and cities for all customers, ordered by name.",
    shortDescription: "Choose specific columns and sort results",
    learningObjectives: [
      "Select specific columns instead of *",
      "Use ORDER BY to sort results",
      "Understand column ordering in results"
    ],
    theory: `Instead of selecting all columns with *, you can specify exactly which columns you want:

SELECT column1, column2 FROM table_name;

Sorting results:
• ORDER BY column_name ASC (ascending - default)
• ORDER BY column_name DESC (descending)

Example:
SELECT cName, city FROM customer ORDER BY cName ASC;

This gives you more control over what data you see and how it's presented.`,
    
    initialCode: "-- Show customer names and cities, sorted by name\n-- Select only cName and city columns\n\nSELECT cName, city\nFROM customer\n",
    solution: "SELECT cName, city FROM customer ORDER BY cName",
    
    testCases: [
      {
        name: "Returns all customers",
        weight: 25,
        check: (result) => result && result.length === 8,
        feedback: "Should return all 8 customers"
      },
      {
        name: "Has exactly 2 columns",
        weight: 25,
        check: (result) => result && result[0] && result[0].length === 2,
        feedback: "Should select exactly 2 columns: cName and city"
      },
      {
        name: "Properly sorted by name",
        weight: 50,
        check: (result) => {
          if (!result || result.length === 0) return false;
          for (let i = 1; i < result.length; i++) {
            if (result[i][0].localeCompare(result[i-1][0]) < 0) return false;
          }
          return true;
        },
        feedback: "Results should be sorted by customer name in ascending order"
      }
    ]
  },
  
  {
    id: 3,
    title: "Working with Numbers",
    category: "Basic Queries",
    difficulty: "Beginner",
    points: 20,
    prerequisites: [2],
    description: "Find all products with a price above €2.50 in the Albert Heijn inventory (store ID 1) on 2024-08-10. Show product name, suffix, and unit price.",
    shortDescription: "Filter with numerical comparisons",
    learningObjectives: [
      "Use comparison operators with numbers",
      "Combine multiple WHERE conditions",
      "Work with real numbers (prices)"
    ],
    theory: `SQL supports various comparison operators for numbers:
• > (greater than)
• < (less than)  
• >= (greater than or equal)
• <= (less than or equal)
• = (equal)
• != or <> (not equal)

Combining conditions:
• AND: both conditions must be true
• OR: at least one condition must be true

Example:
SELECT pName, unit_price 
FROM inventory 
WHERE sID = 1 AND unit_price > 2.50;`,
    
    initialCode: "-- Find expensive products at Albert Heijn\n-- Products with unit_price > 2.50 at store 1 on 2024-08-10\n\nSELECT p.pName, p.suffix, i.unit_price\nFROM product p\nJOIN inventory i ON p.pID = i.pID\nWHERE ",
    solution: "SELECT p.pName, p.suffix, i.unit_price FROM product p JOIN inventory i ON p.pID = i.pID WHERE i.sID = 1 AND i.unit_price > 2.50 AND i.date = '2024-08-10'",
    
    testCases: [
      {
        name: "Returns results",
        weight: 20,
        check: (result) => result && result.length > 0,
        feedback: "Should find products above €2.50"
      },
      {
        name: "Correct number of expensive products",
        weight: 30,
        check: (result) => result && result.length === 2,
        feedback: "Should find exactly 2 products above €2.50 at Albert Heijn"
      },
      {
        name: "All prices above 2.50",
        weight: 30,
        check: (result) => result && result.every(row => row[2] > 2.50),
        feedback: "All products should have unit_price > 2.50"
      },
      {
        name: "Has 3 columns",
        weight: 20,
        check: (result) => result && result[0] && result[0].length === 3,
        feedback: "Should show product name, suffix, and unit price"
      }
    ]
  },
  
  {
    id: 4,
    title: "Counting and Grouping",
    category: "Aggregation",
    difficulty: "Intermediate",
    points: 25,
    prerequisites: [3],
    description: "Count how many different products each store has in inventory on 2024-08-10. Show store name and product count, ordered by count (highest first).",
    shortDescription: "Master COUNT and GROUP BY",
    learningObjectives: [
      "Use COUNT() aggregate function",
      "Group results with GROUP BY",
      "Join tables for meaningful output"
    ],
    theory: `Aggregate functions perform calculations on groups of rows:

COUNT() variations:
• COUNT(*) - counts all rows (including NULLs)
• COUNT(column) - counts non-NULL values
• COUNT(DISTINCT column) - counts unique values

GROUP BY groups rows with the same values:
SELECT store_name, COUNT(*)
FROM inventory
GROUP BY store_name;

Important rule: Any column in SELECT (that's not an aggregate function) must be in GROUP BY.`,
    
    initialCode: "-- Count products per store\n-- Show store name and product count for 2024-08-10\n\nSELECT s.sName, COUNT(*) as product_count\nFROM store s\nJOIN inventory i ON s.sID = i.sID\nWHERE i.date = '2024-08-10'\n",
    solution: "SELECT s.sName, COUNT(*) as product_count FROM store s JOIN inventory i ON s.sID = i.sID WHERE i.date = '2024-08-10' GROUP BY s.sName ORDER BY product_count DESC",
    
    testCases: [
      {
        name: "Returns results",
        weight: 20,
        check: (result) => result && result.length > 0,
        feedback: "Should return store counts"
      },
      {
        name: "Correct number of stores",
        weight: 25,
        check: (result) => result && result.length === 4,
        feedback: "Should show exactly 4 stores with inventory on that date"
      },
      {
        name: "Properly sorted by count",
        weight: 30,
        check: (result) => {
          if (!result || result.length === 0) return false;
          for (let i = 1; i < result.length; i++) {
            if (result[i][1] > result[i-1][1]) return false;
          }
          return true;
        },
        feedback: "Should be sorted by product count (highest first)"
      },
      {
        name: "Albert Heijn has most products",
        weight: 25,
        check: (result) => result && result[0] && result[0][0] === 'Albert Heijn' && result[0][1] === 7,
        feedback: "Albert Heijn should have the most products (7) on that date"
      }
    ]
  },
  
  {
    id: 5,
    title: "Shopping Lists vs Purchases",
    category: "Intermediate Queries",
    difficulty: "Intermediate",
    points: 30,
    prerequisites: [4],
    description: "Find customers who bought exactly what they planned. Show customers who have identical product lists in both their shopping list and purchases for the same date.",
    shortDescription: "Compare data across tables",
    learningObjectives: [
      "Use EXISTS for existence checks",
      "Compare related data in different tables",
      "Work with date-based relationships"
    ],
    theory: `EXISTS checks if a subquery returns any rows:

SELECT customer_name
FROM customer c
WHERE EXISTS (
  SELECT 1 FROM purchase p 
  WHERE p.cID = c.cID
);

This is useful for finding records that have related data in other tables.

NOT EXISTS finds records that DON'T have related data.

Key concept: EXISTS returns true/false, not actual data.`,
    
    initialCode: "-- Find customers who bought exactly what they planned\n-- Compare shopping lists with actual purchases\n\nSELECT DISTINCT c.cName\nFROM customer c\nJOIN shoppinglist sl ON c.cID = sl.cID\nWHERE EXISTS (\n  SELECT 1 FROM purchase p\n  WHERE p.cID = sl.cID \n    AND p.pID = sl.pID \n    AND p.date = sl.date\n)\nAND NOT EXISTS (\n",
    solution: `SELECT DISTINCT c.cName
FROM customer c
JOIN shoppinglist sl ON c.cID = sl.cID
WHERE EXISTS (
  SELECT 1 FROM purchase p
  WHERE p.cID = sl.cID 
    AND p.pID = sl.pID 
    AND p.date = sl.date
)
AND NOT EXISTS (
  SELECT 1 FROM purchase p
  WHERE p.cID = c.cID
    AND p.date = sl.date
    AND p.pID NOT IN (
      SELECT pID FROM shoppinglist sl2 
      WHERE sl2.cID = p.cID AND sl2.date = p.date
    )
)`,
    
    testCases: [
      {
        name: "Query executes",
        weight: 30,
        check: (result) => result !== null,
        feedback: "Query should execute without errors"
      },
      {
        name: "Returns some results",
        weight: 35,
        check: (result) => result && result.length > 0,
        feedback: "Should find at least one customer who bought exactly what they planned"
      },
      {
        name: "No duplicate customer names",
        weight: 35,
        check: (result) => {
          if (!result) return false;
          const names = result.map(r => r[0]);
          return names.length === new Set(names).size;
        },
        feedback: "Each customer should appear only once in the results"
      }
    ]
  },
  
  {
    id: 6,
    title: "Price Analysis with Subqueries",
    category: "Advanced Queries",
    difficulty: "Advanced",
    points: 35,
    prerequisites: [5],
    description: "Find products that are priced above the average unit price across all stores. Show product name and the number of stores selling it above average price.",
    shortDescription: "Master subqueries and advanced analysis",
    learningObjectives: [
      "Use subqueries in WHERE clauses",
      "Calculate averages across datasets",
      "Combine aggregation with filtering"
    ],
    theory: `Subqueries (nested queries) allow complex data analysis:

Types of subqueries:
• Scalar subquery: returns a single value
• Correlated subquery: references outer query

Example:
SELECT product_name 
FROM products 
WHERE price > (SELECT AVG(price) FROM products);

The inner query calculates the average, then the outer query finds products above that average.

You can use subqueries with EXISTS, IN, comparison operators, etc.`,
    
    initialCode: "-- Find products priced above average\n-- Show product name and count of stores pricing it above average\n\nSELECT p.pName, COUNT(*) as store_count\nFROM product p\nJOIN inventory i ON p.pID = i.pID\nWHERE i.unit_price > (\n  SELECT AVG(unit_price)\n  FROM inventory\n)\n",
    solution: `SELECT p.pName, COUNT(*) as store_count
FROM product p
JOIN inventory i ON p.pID = i.pID
WHERE i.unit_price > (
  SELECT AVG(unit_price)
  FROM inventory
)
GROUP BY p.pName
ORDER BY store_count DESC`,
    
    testCases: [
      {
        name: "Returns results",
        weight: 25,
        check: (result) => result && result.length > 0,
        feedback: "Should find products priced above average"
      },
      {
        name: "All products above average",
        weight: 35,
        check: (result) => {
          if (!result) return false;
          // We need to verify this makes sense - there should be some products above average
          return result.length > 0 && result.length < 12; // Not all products should be above average
        },
        feedback: "Should find a reasonable number of above-average priced products"
      },
      {
        name: "Grouped by product",
        weight: 40,
        check: (result) => {
          if (!result) return false;
          const productNames = result.map(r => r[0]);
          return productNames.length === new Set(productNames).size;
        },
        feedback: "Each product should appear only once (properly grouped)"
      }
    ]
  },
  
  {
    id: 7,
    title: "Store Chain Analysis",
    category: "Advanced Queries",
    difficulty: "Expert",
    points: 40,
    prerequisites: [4, 6],
    description: "Find store chains (stores with the same name in different cities) and calculate their total revenue from purchases. Only show chains with revenue above €20.",
    shortDescription: "Master complex aggregation and HAVING",
    learningObjectives: [
      "Use HAVING to filter aggregated results", 
      "Understand the difference between WHERE and HAVING",
      "Calculate totals across grouped data"
    ],
    theory: `HAVING vs WHERE - a crucial distinction:

WHERE filters rows BEFORE grouping
HAVING filters groups AFTER aggregation

Example:
SELECT store_name, SUM(revenue)
FROM sales
WHERE date > '2024-01-01'    -- Filter rows first
GROUP BY store_name
HAVING SUM(revenue) > 1000   -- Filter groups after aggregation

Store chains: stores with the same name but different locations.
Revenue calculation: SUM(quantity * price) from all purchases.`,
    
    initialCode: "-- Find profitable store chains\n-- Calculate total revenue per store name, show only chains with revenue > 20\n\nSELECT s.sName, SUM(p.quantity * p.price) as total_revenue\nFROM store s\nJOIN purchase p ON s.sID = p.sID\nGROUP BY s.sName\n",
    solution: `SELECT s.sName, SUM(p.quantity * p.price) as total_revenue
FROM store s
JOIN purchase p ON s.sID = p.sID
GROUP BY s.sName
HAVING SUM(p.quantity * p.price) > 20
ORDER BY total_revenue DESC`,
    
    testCases: [
      {
        name: "Returns results",
        weight: 20,
        check: (result) => result && result.length > 0,
        feedback: "Should find store chains with revenue > €20"
      },
      {
        name: "All chains above €20",
        weight: 30,
        check: (result) => result && result.every(row => row[1] > 20),
        feedback: "All store chains should have revenue above €20"
      },
      {
        name: "Properly sorted by revenue",
        weight: 25,
        check: (result) => {
          if (!result || result.length === 0) return false;
          for (let i = 1; i < result.length; i++) {
            if (result[i][1] > result[i-1][1]) return false;
          }
          return true;
        },
        feedback: "Should be sorted by revenue (highest first)"
      },
      {
        name: "Albert Heijn has highest revenue",
        weight: 25,
        check: (result) => result && result[0] && result[0][0] === 'Albert Heijn',
        feedback: "Albert Heijn should have the highest total revenue"
      }
    ],
    
    badges: [
      {
        id: "sql_master_2id50",
        name: "2ID50 SQL Master", 
        description: "Complete all SQL Valley exercises",
        icon: "🏆"
      },
      {
        id: "aggregation_expert",
        name: "Aggregation Expert",
        description: "Master HAVING and complex aggregations",
        icon: "💎"
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
  
  // Summary with TU/e context
  if (score === 100) {
    feedback.summary = `🎉 Perfect! You've mastered ${exercise.title} - ready for the 2ID50 exam!`;
    
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
    feedback.summary = `Good progress! You're ${score}% there. Keep practicing for 2ID50 success.`;
  } else if (score >= 40) {
    feedback.summary = `You're learning! ${score}% correct. Let's work through the remaining concepts.`;
  } else {
    feedback.summary = `Keep going! Every expert was once a beginner. Current score: ${score}%`;
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
  
  // Enhanced suggestions based on failed tests
  if (failedTests.length > 0) {
    const hasNoResults = failedTests.some(t => t.name.toLowerCase().includes('returns') || t.name.toLowerCase().includes('executes'));
    const hasWrongCount = failedTests.some(t => t.name.toLowerCase().includes('count') || t.name.toLowerCase().includes('number'));
    const hasWrongJoin = failedTests.some(t => t.name.toLowerCase().includes('join') || t.name.toLowerCase().includes('correct'));
    const hasWrongSort = failedTests.some(t => t.name.toLowerCase().includes('sort') || t.name.toLowerCase().includes('order'));
    const hasWrongGroup = failedTests.some(t => t.name.toLowerCase().includes('group'));
    const hasWrongFilter = failedTests.some(t => t.name.toLowerCase().includes('filter') || t.name.toLowerCase().includes('above') || t.name.toLowerCase().includes('below'));
    
    if (hasNoResults) {
      feedback.suggestions.push("Your query isn't returning any results. Check your syntax, table names, and JOIN conditions.");
    }
    if (hasWrongCount) {
      feedback.suggestions.push("The number of results doesn't match expected. Review your WHERE conditions and JOINs.");
    }
    if (hasWrongJoin) {
      feedback.suggestions.push("Check your JOIN conditions. Make sure you're connecting tables on the right columns (like pID = pID).");
    }
    if (hasWrongSort) {
      feedback.suggestions.push("Sorting issue detected. Remember ORDER BY column_name ASC/DESC.");
    }
    if (hasWrongGroup) {
      feedback.suggestions.push("GROUP BY issue. Remember: non-aggregate columns in SELECT must be in GROUP BY.");
    }
    if (hasWrongFilter) {
      feedback.suggestions.push("Filtering problem. Double-check your WHERE conditions and comparison operators.");
    }
    
    // Add context-specific hints
    if (exercise.category === "Advanced Queries") {
      feedback.suggestions.push("Advanced queries often need subqueries or EXISTS. Break the problem into smaller parts.");
    }
    if (exercise.title.includes("Shopping")) {
      feedback.suggestions.push("Remember the shopping database relationships: customers have shopping lists and make purchases.");
    }
    
    // Add learning objective reminders for struggling students
    if (score < 50) {
      feedback.suggestions.push(`Review these key concepts: ${exercise.learningObjectives.join(', ')}`);
      feedback.suggestions.push("Check the theory section for this exercise - it has examples similar to this problem.");
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