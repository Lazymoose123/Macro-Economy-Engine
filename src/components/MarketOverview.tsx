/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MOCK_DATA = [
  { symbol: 'SPX', price: '5,024.31', change: '+0.45%', status: 'up' },
  { symbol: 'NDX', price: '18,120.50', change: '+0.82%', status: 'up' },
  { symbol: 'DXY', price: '103.82', change: '-0.12%', status: 'down' },
  { symbol: 'US10Y', price: '4.25%', change: '0.00%', status: 'neutral' },
  { symbol: 'BTC', price: '64,210', change: '+2.41%', status: 'up' },
];

export const MarketOverview: React.FC = () => {
  return (
    <div className="px-6 py-4 border-b border-line/10">
      <div className="flex items-center justify-between mb-4">
        <span className="col-header">Market Pulse</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[9px] font-mono uppercase opacity-40">Live</span>
        </div>
      </div>
      <div className="space-y-3">
        {MOCK_DATA.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between group cursor-default">
            <span className="font-mono text-[11px] font-medium group-hover:text-accent transition-colors">
              {item.symbol}
            </span>
            <div className="flex items-center gap-3">
              <span className="data-value text-[11px]">{item.price}</span>
              <div className={`flex items-center gap-0.5 text-[10px] font-mono ${
                item.status === 'up' ? 'text-green-600' : 
                item.status === 'down' ? 'text-red-600' : 'opacity-40'
              }`}>
                {item.status === 'up' && <TrendingUp size={10} />}
                {item.status === 'down' && <TrendingDown size={10} />}
                {item.status === 'neutral' && <Minus size={10} />}
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
