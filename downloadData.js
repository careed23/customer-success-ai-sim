import fs from 'fs';
import path from 'path';

const BASE_ID = "1vLsevGIbt1ExHe8jD2pSkzJ9K66XzJ7JPmEisb1vgis";
const SHEET_NAMES = [
  "Pricing Reference",
  "Cadence Reference",
  "Token Math Template",
  "Scenario Analysis",
  "Candidate Assumptions"
];

const downloadSheet = async (sheetName) => {
  try {
    const fileName = sheetName.toLowerCase().replace(/ /g, "_") + ".csv";
    const filePath = path.join('data', fileName);
    const url = `https://docs.google.com/spreadsheets/d/${BASE_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    fs.writeFileSync(filePath, data);
    console.log(`Successfully downloaded and saved ${sheetName} to ${filePath}`);
  } catch (error) {
    console.error(`Could not download sheet ${sheetName}:`, error);
  }
};

const downloadAllSheets = async () => {
  for (const sheetName of SHEET_NAMES) {
    await downloadSheet(sheetName);
  }
};

downloadAllSheets();
