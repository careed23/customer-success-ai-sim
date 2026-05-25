
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pricing = {
  "Claude 3.5 Sonnet": {
    input: 3.00 / 1000000,
    output: 15.00 / 1000000,
  },
  "Claude 3 Opus": {
    input: 15.00 / 1000000,
    output: 75.00 / 1000000,
  },
};

const globalState = {
  totalCalls: 0,
  totalInputTokens: 0,
  totalOutputTokens: 0,
  totalCost: 0,
  stages: {},
};

async function parseCSV(filePath) {
  const data = await fs.promises.readFile(filePath, "utf8");
  const rows = data.trim().split(/\r?\n/);
  if (rows.length === 0) {
    return [];
  }
  const headers = rows[0].split(",").map(h => h.trim());
  const jsonData = [];
  if (rows.length <= 1 && rows[0].trim() === "") {
    return [];
  }
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.trim() === "") continue;
    const values = [];
    let current = '';
    let inQuote = false;
    for (const char of row) {
      if (char === '"' && !inQuote) {
        inQuote = true;
      } else if (char === '"' && inQuote) {
        inQuote = false;
      } else if (char === ',' && !inQuote) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length === headers.length) {
      const entry = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = values[j];
      }
      jsonData.push(entry);
    }
  }
  return jsonData;
}

async function simulateLLMCall(stageName, model, inputTokens, outputTokens, promptText = "") {

  const modelPricing = pricing[model];
  if (!modelPricing) {
    throw new Error(`Pricing for model ${model} not found.`);
  }

  const cost = (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output);

  if (!globalState.stages[stageName]) {
    globalState.stages[stageName] = {
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0,
    };
  }

  const stage = globalState.stages[stageName];
  stage.calls++;
  stage.inputTokens += inputTokens;
  stage.outputTokens += outputTokens;
  stage.cost += cost;

  globalState.totalCalls++;
  globalState.totalInputTokens += inputTokens;
  globalState.totalOutputTokens += outputTokens;
  globalState.totalCost += cost;

  return {
    healthScore: Math.floor(Math.random() * 100) + 1,
    riskFlag: Math.random() < 0.2,
    reasoning: "This is a mock response based on the simulated LLM call.",
  };
}

async function dailyAccountReview(account, usage) {
  const promptText = `Reviewing account ${account.account_id} with usage data.`;
  return await simulateLLMCall("Daily Review", "Claude 3.5 Sonnet", 2500, 150, promptText);
}

async function handleInboundIssue(ticket) {
    const promptText = `Handling ticket ${ticket.ticket_id}.`;
    return await simulateLLMCall("Inbound Issue", "Claude 3.5 Sonnet", 4000, 300, promptText);
}

async function prepareCheckIn(checkin, callNotes) {
    const promptText = `Preparing for check-in ${checkin.checkin_id} with call notes.`;
    return await simulateLLMCall("Prepare Check-in", "Claude 3.5 Sonnet", 15000, 1200, promptText);
}

async function reviewQuality(output, standards) {
    const promptText = `Reviewing output ${output.output_id} against standards.`;
    return await simulateLLMCall("Review Quality", "Claude 3 Opus", 5000, 400, promptText);
}

async function planIntervention(segmentData) {
    const promptText = "Planning intervention for a declining segment.";
    return await simulateLLMCall("Plan Intervention", "Claude 3 Opus", 50000, 2000, promptText);
}


async function runSimulation() {
    try {
        // Load all necessary data
        const accounts = await parseCSV(path.join(__dirname, "data", "accounts.csv"));
        const usageData = await parseCSV(path.join(__dirname, "data", "usage_events.csv"));
        const supportTickets = await parseCSV(path.join(__dirname, "data", "support_tickets.csv"));
        const scheduledCheckins = await parseCSV(path.join(__dirname, "data", "scheduled_checkins.csv"));
        const callNotes = await parseCSV(path.join(__dirname, "data", "call_notes.csv"));
        const juniorOutputs = await parseCSV(path.join(__dirname, "data", "junior_outputs.csv"));
        const qualityStandards = await parseCSV(path.join(__dirname, "data", "quality_standards.csv"));

        if (!accounts.length || !usageData.length || !supportTickets.length || !scheduledCheckins.length || !callNotes.length || !juniorOutputs.length || !qualityStandards.length) {
            console.error("Error: One or more data files are empty or failed to parse.");
            return;
        }

        // 5 Daily Reviews
        for (let i = 0; i < 5; i++) {
            await dailyAccountReview(accounts[i % accounts.length], usageData);
        }

        // 2 Inbound Issues
        for (let i = 0; i < 2; i++) {
            await handleInboundIssue(supportTickets[i % supportTickets.length]);
        }

        // 2 Check-ins
        for (let i = 0; i < 2; i++) {
            await prepareCheckIn(scheduledCheckins[i % scheduledCheckins.length], callNotes);
        }

        // 2 Quality Reviews
        for (let i = 0; i < 2; i++) {
            await reviewQuality(juniorOutputs[i % juniorOutputs.length], qualityStandards);
        }

        // 1 Intervention
        const decliningSegment = {
            segment_id: "decline-001",
            segment_name: "Declining User Engagement",
            criteria: "user_logins < 5 in last 30 days",
            user_count: 150,
        };
        await planIntervention(decliningSegment);

        // Write the final aggregated costs to usage_log.json
        fs.writeFileSync("usage_log.json", JSON.stringify(globalState, null, 2));
        console.log("Simulation complete. usage_log.json created.");
    } catch (error) {
        console.error("Error during simulation:", error);
    }
}

runSimulation();
