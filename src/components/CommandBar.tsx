/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Terminal, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandBarProps {
  onCommand: (command: string) => void;
  isLoading: boolean;
}

export const CommandBar: React.FC<CommandBarProps> = ({ onCommand, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "bg-ink text-bg rounded-none border border-line shadow-2xl transition-all duration-300",
          isLoading ? "opacity-90 scale-95" : "opacity-100 scale-100"
        )}
      >
        <div className="flex items-center p-4 gap-4">
          <Terminal size={18} className="text-accent shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command (/research, /compare, /stress-test)..."
            className="bg-transparent border-none outline-none flex-1 font-mono text-sm placeholder:text-bg/30"
            disabled={isLoading}
            autoFocus
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-1 hover:text-accent disabled:opacity-30 transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
        </div>
        <div className="px-4 pb-2 flex gap-4 overflow-x-auto">
          {['/research AAPL', '/compare BTC vs GOLD', '/stress-test SPY'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => setInput(cmd)}
              className="text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              {cmd}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
