
import React, { useState } from 'react';
import { Goal } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GoalItem } from './components/GoalItem';
import { EmptyState } from './components/EmptyState';
import { Plus, X } from 'lucide-react';

const App: React.FC = () => {
  const [goals, setGoals] = useLocalStorage<Goal[]>('zen-goals', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const addGoal = () => {
    if (!newTitle.trim()) return;
    
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const goal: Goal = {
      id,
      title: newTitle.trim(),
      notes: newNotes.trim(),
      createdAt: Date.now(),
      isCompleted: false,
    };

    setGoals([goal, ...goals]);
    setNewTitle('');
    setNewNotes('');
    setIsAdding(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, isCompleted: !g.isCompleted } : g
    ));
  };

  const updateNotes = (id: string, notes: string) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, notes } : g
    ));
  };

  const completedCount = goals.filter(g => g.isCompleted).length;
  const progress = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col bg-slate-50">
      {/* Header - added padding-top for safe areas */}
      <header className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md px-6 pt-12 pb-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Progress</h1>
            <p className="text-slate-500 text-sm font-medium">Life milestones</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-600">{Math.round(progress)}%</span>
            <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Done</div>
          </div>
        </div>
        
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Goal List */}
      <main className="flex-grow px-4 pb-32 pt-2">
        {goals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col">
            {goals.map(goal => (
              <GoalItem 
                key={goal.id} 
                goal={goal} 
                onDelete={deleteGoal} 
                onToggle={toggleGoal}
                onUpdateNotes={updateNotes}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-1/2 translate-x-1/2 z-20">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-16 h-16 rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center transition-all active:scale-90"
          aria-label="Add new goal"
        >
          <Plus className="w-9 h-9" />
        </button>
      </div>

      {/* Add Goal Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0">
          <div 
            className="bg-white w-full max-w-md rounded-t-[2.5rem] shadow-2xl p-8 pb-12 animate-in slide-in-from-bottom-full duration-300"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">New Goal</h2>
              <button 
                onClick={() => setIsAdding(false)}
                className="p-2 text-slate-400 bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">The Goal</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="What is your focus?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Notes</label>
                <textarea
                  placeholder="Additional details..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all min-h-[140px] resize-none"
                />
              </div>

              <button
                onClick={addGoal}
                disabled={!newTitle.trim()}
                className="w-full bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 text-lg"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
