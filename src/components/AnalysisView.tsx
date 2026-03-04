/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { Clock, TrendingUp, AlertTriangle, Database, FileText, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

interface AnalysisViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ messages, isLoading, scrollRef }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-40 pt-8 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-6"
            >
              {msg.role === 'user' ? (
                <div className="flex items-center gap-3 border-l-2 border-accent pl-4 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">User Query</span>
                  <span className="font-mono text-sm font-medium">{msg.content}</span>
                </div>
              ) : (
                <div className="bg-white/50 backdrop-blur-sm border border-line/10 p-8 shadow-sm relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <TrendingUp size={120} />
                  </div>
                  
                  <div className="flex items-center justify-between mb-8 border-b border-line/10 pb-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-accent" />
                      <h2 className="font-serif italic text-xl">Intelligence Report</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="opacity-0 group-hover:opacity-40 hover:opacity-100 transition-all p-1"
                        title="Copy Report"
                      >
                        {copiedIdx === idx ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                      <div className="flex items-center gap-2 font-mono text-[10px] opacity-40">
                        <Clock size={12} />
                        {format(msg.timestamp, 'HH:mm:ss')}
                      </div>
                    </div>
                  </div>

                  <div className="markdown-body">
                    <Markdown>{msg.content}</Markdown>
                  </div>

                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-line/10 pt-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-accent">
                        <AlertTriangle size={14} />
                        <span className="col-header">Risk Profile</span>
                      </div>
                      <p className="text-xs opacity-70 leading-relaxed">
                        Analysis based on current market volatility and geopolitical risk premiums. 
                        Tail risks identified in the report should be monitored for delta shifts.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-accent">
                        <Database size={14} />
                        <span className="col-header">Data Integrity</span>
                      </div>
                      <p className="text-xs opacity-70 leading-relaxed">
                        Synthesized from real-time macro indicators and corporate filings. 
                        Confidence interval: High (85-90%).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/30 backdrop-blur-sm border border-line/5 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="col-header">Processing Intelligence...</span>
            </div>
            <div className="space-y-3 font-mono text-[10px] opacity-40">
              <p className="animate-pulse"> {'>'} INITIALIZING GLOBAL MACRO ADAPTER...</p>
              <p className="animate-pulse delay-75"> {'>'} FETCHING REAL-TIME LIQUIDITY DATA...</p>
              <p className="animate-pulse delay-150"> {'>'} SYNTHESIZING GEOPOLITICAL RISK VECTORS...</p>
              <p className="animate-pulse delay-300"> {'>'} CALCULATING DCF SENSITIVITY MATRICES...</p>
            </div>
          </motion.div>
        )}

        {messages.length === 0 && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <h1 className="font-serif italic text-6xl tracking-tighter">MacroQuant</h1>
            <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-40">
              Intelligence for the Modern Strategist
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-2xl">
              {[
                { label: 'Macro', desc: 'Interest rates, inflation & liquidity' },
                { label: 'Micro', desc: 'FCF yield & corporate moats' },
                { label: 'Sentiment', desc: 'Positioning & volatility' }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="h-px bg-line/20 w-full" />
                  <span className="col-header block">{item.label}</span>
                  <p className="text-[11px] opacity-60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
