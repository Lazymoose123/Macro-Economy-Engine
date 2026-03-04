/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { History, Plus, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { format } from 'date-fns';
import { MarketOverview } from './MarketOverview';

interface SidebarProps {
  history: ChatMessage[];
  onClear: () => void;
  onNew: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onClear, onNew }) => {
  const queries = history.filter(m => m.role === 'user');

  return (
    <div className="w-64 border-r border-line/10 h-screen flex flex-col bg-bg/50 backdrop-blur-md hidden lg:flex">
      <div className="p-6 border-b border-line/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={16} className="opacity-40" />
          <span className="col-header">Session History</span>
        </div>
        <button 
          onClick={onNew}
          className="p-1 hover:text-accent transition-colors"
          title="New Session"
        >
          <Plus size={16} />
        </button>
      </div>

      <MarketOverview />

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {queries.map((q, i) => (
          <div 
            key={i}
            className="p-3 hover:bg-ink hover:text-bg transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-mono text-[10px] opacity-40 group-hover:opacity-60">
                {format(q.timestamp, 'MMM d, HH:mm')}
              </span>
            </div>
            <p className="text-xs font-medium truncate">{q.content}</p>
          </div>
        ))}
        
        {queries.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2 py-20">
            <History size={32} />
            <span className="text-[10px] uppercase tracking-widest">Empty</span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-line/10">
        <button 
          onClick={onClear}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-red-500 transition-all w-full"
        >
          <Trash2 size={12} />
          Clear History
        </button>
      </div>
    </div>
  );
};
