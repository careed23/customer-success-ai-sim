# Assessment Goal
Build a runnable Node.js workflow simulation for an AI B2B SaaS Customer Success system. It must process synthetic data, simulate LLM decisions, and strictly track token costs. 

# Constraints & Token Budget
- The system must operate under a strict $50,000/year token budget.
- We are using a tiered model approach. Use these exact pricing metrics for the simulation tracker:
  - Tier 1 (High Volume): Claude 3.5 Sonnet -> $3.00 / 1M Input Tokens | $15.00 / 1M Output Tokens
  - Tier 2 (High Reasoning): Claude 3 Opus -> $15.00 / 1M Input Tokens | $75.00 / 1M Output Tokens

# Operating Scope & Workflow Stages required:
1. Daily account review & prioritization (Tier 1 model)
2. Inbound issue handling/routing (Tier 1 model)
3. Customer check-in support (Pre/Post call) (Tier 1 model)
4. Output quality review (Tier 2 model)
5. Targeted intervention planning (Tier 2 model)

# Technical Requirements
- Do not build production software. Build a simulation that reads local CSV data.
- MUST include a wrapper function around all mock LLM calls that calculates input/output tokens (assume 1 token = 4 characters of string length for the simulation) and logs the exact cost per run.
- MUST output a final `usage_log.json` showing token counts and costs by workflow stage.