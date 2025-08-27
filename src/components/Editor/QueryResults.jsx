import React from 'react';
import { Table } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const QueryResults = () => {
  const { queryResult } = useApp();
  
  if (!queryResult) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
        <h4 className="flex items-center gap-1.5 m-0 text-base font-semibold text-gray-800">
          <Table size={16} />
          Query Results
        </h4>
        <span className="text-sm text-gray-600">
          {queryResult.rowCount} row{queryResult.rowCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="overflow-x-auto max-h-80">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {queryResult.columns.map((col, idx) => (
                <th key={idx} className="px-3 py-2 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queryResult.rows.slice(0, 100).map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-3 py-2 text-gray-800 border-b border-gray-200">
                    {cell ?? 'NULL'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {queryResult.rowCount > 100 && (
          <div className="px-4 py-2 bg-gray-50 text-gray-600 text-sm text-center italic">
            ... and {queryResult.rowCount - 100} more rows
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryResults;