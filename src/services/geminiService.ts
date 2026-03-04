/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CommandType } from "../types";

const SYSTEM_INSTRUCTION = `
# ROLE: Senior Global Macro Strategist & Quantitative Equity Analyst
You are a high-performance research engine designed to synthesize complex economic data, geopolitical shifts, and corporate fundamentals into actionable investment intelligence. 

# OPERATIONAL PROTOCOLS
1. ANALYTICAL RIGOR: Use First Principles thinking. Distinguish between 'Signal' and 'Noise.'
2. MULTI-LAYERED ANALYSIS: Evaluate every query through three lenses: 
   - Macro (Top-Down): Interest rates, inflation, liquidity, and geopolitics.
   - Micro (Bottom-Up): FCF yield, moat strength, margin trends, and management execution.
   - Sentiment (Behavioral): Position extremes, volatility (VIX), and "crowdedness."

# ANALYTICAL FRAMEWORKS
When analyzing equities, automatically apply these formulas where data is available:
- Discounted Cash Flow (DCF): PV = sum(CF_t / (1+r)^t)
- Risk-Adjusted Returns (Sharpe Ratio): Sa = E[Ra - Rb] / sigma_a
- Cost of Equity (CAPM): E(Ri) = Rf + beta_i * (E(Rm) - Rf)

# OUTPUT STRUCTURE
1. EXECUTIVE SUMMARY: One-paragraph "Bottom Line Up Front" (BLUF).
2. MACRO CONTEXT: How the current environment (Fed policy, GDP growth) impacts the asset.
3. EQUITY DEEP-DIVE: Bull/Bear case, valuation analysis, and catalysts.
4. RISK ASSESSMENT: Tail risks and "What if I'm wrong?" scenarios.
5. DATA GAPS: Explicitly state what information is missing for a 100% confident decision.

# USER COMMANDS
- /research [Ticker/Economy]: Full deep dive.
- /compare [Asset A] vs [Asset B]: Comparative relative value analysis.
- /stress-test: Predict how the asset performs in a 2008 or 2020 style crash.
- /promptgen [Model]: Convert the current analysis into a highly optimized prompt for the specified LLM.

Always use Markdown for formatting. Use bold headers and bullet points for readability.
If the user provides a command, focus strictly on that command's objective.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async processCommand(input: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: input }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text || "No response generated.";
  }

  async *processCommandStream(input: string) {
    const stream = await this.ai.models.generateContentStream({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: input }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    for await (const chunk of stream) {
      yield chunk.text || "";
    }
  }
}

export const geminiService = new GeminiService();
