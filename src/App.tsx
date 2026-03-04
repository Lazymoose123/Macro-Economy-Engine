/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { CommandBar } from './components/CommandBar';
import { AnalysisView } from './components/AnalysisView';
import { ChatMessage } from './types';
import { geminiService } from './services/geminiService';
import { motion } from 'motion/react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommand = async (input: string) => {
    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      let fullResponse = '';
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      const stream = geminiService.processCommandStream(input);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '### Error\nFailed to process intelligence request. Please check your connection or API configuration.',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => setMessages([]);
  const newSession = () => setMessages([]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg selection:bg-accent selection:text-bg">
      <Sidebar 
        history={messages} 
        onClear={clearHistory} 
        onNew={newSession} 
      />
      
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-line/10 flex items-center justify-between px-8 bg-bg/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-accent animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40">System Active</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="col-header">Terminal Node</span>
              <span className="font-mono text-[10px] opacity-40">MQ-772-PRO</span>
            </div>
          </div>
        </header>

        <AnalysisView messages={messages} isLoading={isLoading} scrollRef={scrollRef} />
        
        <CommandBar onCommand={handleCommand} isLoading={isLoading} />
        
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
          <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-ink" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

