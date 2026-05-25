# Customer Success AI Simulator

This project simulates a Customer Success AI agent that uses a tiered approach to handle various customer-related tasks. It leverages different AI models based on task complexity to optimize for cost and performance.

## Included Submissions

**Submission-A** and **Submission-C** are included under their respective names inside the root directory of this repository.

## Setup and Run

Install dependencies:
` ` `bash
npm install
` ` `

Run the simulation:
` ` `bash
node index.js
` ` `

This will run the simulation and generate a `usage_log.json` file with detailed token counts and costs.

## Architecture & Cost

The system is designed with a two-tiered architecture to manage costs effectively while ensuring high-quality outputs for critical tasks.

* **Tier 1 (High-Volume, Lower-Cost):** For frequent, less complex tasks like daily account reviews, handling inbound support tickets, and preparing for customer check-ins, we use Claude 3.5 Sonnet. This model provides a great balance of performance and cost-efficiency, making it ideal for high-volume operations.

* **Tier 2 (Low-Volume, High-Complexity):** For tasks that require deep reasoning and a high degree of accuracy, such as quality assurance reviews and planning strategic interventions for at-risk customer segments, we use the more powerful Claude 3 Opus. While more expensive, its use is reserved for low-volume, high-impact scenarios where quality is paramount.

This tiered approach ensures that we can stay under our $50,000/year budget. The `usage_log.json` file, generated after each simulation run, provides a detailed breakdown of token usage and associated costs for each task type. This allows us to monitor our spending closely and validate that our architectural choices are keeping us within our financial constraints.
