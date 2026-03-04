/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CommandType {
  RESEARCH = 'research',
  COMPARE = 'compare',
  STRESS_TEST = 'stress-test',
  PROMPTGEN = 'promptgen',
}

export interface AnalysisResult {
  executiveSummary: string;
  macroContext: string;
  equityDeepDive: string;
  riskAssessment: string;
  dataGaps: string;
  charts?: any[]; // Placeholder for chart data
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  command?: CommandType;
  result?: AnalysisResult;
}
