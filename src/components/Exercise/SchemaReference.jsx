import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp } from 'lucide-react';

const SchemaReference = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const tables = [
    {
      name: 'customer',
      columns: [
        'cID (INTEGER) - PK',
        'cName (TEXT)',
        'street (TEXT)',
        'city (TEXT)'
      ]
    },
    {
      name: 'store',
      columns: [
        'sID (INTEGER) - PK',
        'sName (TEXT)',
        'street (TEXT)',
        'city (TEXT)'
      ]
    },
    {
      name: 'product',
      columns: [
        'pID (INTEGER) - PK',
        'pName (TEXT)',
        'suffix (TEXT)'
      ]
    },
    {
      name: 'shoppinglist',
      columns: [
        'cID (INTEGER) - FK',
        'pID (INTEGER) - FK',
        'quantity (INTEGER)',
        'date (DATE)'
      ]
    },
    {
      name: 'purchase',
      columns: [
        'tID (INTEGER) - PK',
        'cID (INTEGER) - FK',
        'sID (INTEGER) - FK',
        'pID (INTEGER) - FK',
        'date (DATE)',
        'quantity (INTEGER)',
        'price (REAL)'
      ]
    },
    {
      name: 'inventory',
      columns: [
        'sID (INTEGER) - FK',
        'pID (INTEGER) - FK',
        'date (DATE)',
        'quantity (INTEGER)',
        'unit_price (REAL)'
      ]
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 bg-white border border-gray-200 rounded-lg flex justify-between items-center cursor-pointer transition-all duration-200 text-sm font-medium text-gray-600 hover:border-tue-red hover:text-tue-red"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <Database size={16} />
          <h3 className="m-0 text-sm font-medium">Database Schema</h3>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg -mt-px bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {tables.map((table) => (
              <div key={table.name} className="bg-white rounded p-3 border border-gray-200">
                <h4 className="m-0 mb-2 text-tue-red text-sm font-semibold">
                  {table.name}
                </h4>
                <ul className="list-none p-0 m-0">
                  {table.columns.map((column, idx) => (
                    <li key={idx} className="text-gray-700 text-xs py-1 font-mono border-b border-gray-100 last:border-b-0">
                      {column}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaReference;