
import React from 'react';
import { Target } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
        <Target className="w-10 h-10 text-indigo-300" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700">No goals yet</h3>
      <p className="text-slate-400 text-sm mt-2 max-w-[240px]">
        Focus on what matters. Add your first life goal using the button below.
      </p>
    </div>
  );
};
