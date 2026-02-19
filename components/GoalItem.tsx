
import React, { useState } from 'react';
import { Goal } from '../types';
import { Trash2, ChevronDown, ChevronUp, CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface GoalItemProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal, onDelete, onToggle, onUpdateNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [tempNotes, setTempNotes] = useState(goal.notes);

  const handleSaveNotes = () => {
    onUpdateNotes(goal.id, tempNotes);
    setIsEditingNotes(false);
  };

  if (isConfirmingDelete) {
    return (
      <div className="bg-rose-50 rounded-2xl border border-rose-200 mb-3 p-4 flex flex-col gap-3 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm">Delete "{goal.title}"?</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onDelete(goal.id)}
            className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-sm font-bold shadow-sm"
          >
            Delete
          </button>
          <button 
            onClick={() => setIsConfirmingDelete(false)}
            className="flex-1 bg-white text-slate-600 py-2 rounded-lg text-sm font-bold border border-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-3 overflow-hidden transition-all duration-200">
      <div className="p-4 flex items-center justify-between gap-3">
        <button 
          onClick={() => onToggle(goal.id)}
          className="flex-shrink-0 text-slate-300 hover:text-indigo-600 transition-colors"
        >
          {goal.isCompleted ? (
            <CheckCircle className="w-7 h-7 text-emerald-500 fill-emerald-50" />
          ) : (
            <Circle className="w-7 h-7" />
          )}
        </button>
        
        <div 
          className="flex-grow cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className={`font-semibold text-slate-800 transition-all ${goal.isCompleted ? 'line-through text-slate-400 opacity-60' : ''}`}>
            {goal.title}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirmingDelete(true);
            }}
            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
            aria-label="Delete goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-5 pt-0 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes</span>
              {!isEditingNotes ? (
                <button 
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs text-indigo-600 font-bold"
                >
                  Edit
                </button>
              ) : (
                <button 
                  onClick={handleSaveNotes}
                  className="text-xs text-emerald-600 font-bold"
                >
                  Save
                </button>
              )}
            </div>
            
            {isEditingNotes ? (
              <textarea
                autoFocus
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] shadow-inner"
                placeholder="What are the details?"
              />
            ) : (
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed px-1">
                {goal.notes || <span className="italic text-slate-400">Add some details about this goal.</span>}
              </p>
            )}
            <div className="mt-5 text-[10px] font-medium text-slate-300 flex justify-end gap-2 items-center">
              <span>Added {new Date(goal.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
