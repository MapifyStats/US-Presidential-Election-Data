const fs = require("fs");
const path = require("path");

function getCSVPath(filename) {
  return path.join(__dirname, "data/rawCSV", filename);
}

function listCSVFiles() {
  const dataDir = path.join(__dirname, "data/rawCSV");
  console.log(dataDir);
  return fs.readdirSync(dataDir).filter((file) => file.endsWith(".csv"));
}

const { normalizeHeaders } = require("./utilities/HeaderNormalizer");
const {
  convertElectionYearCsvToJson,
} = require("./utilities/ElectionYearCsvToJsonConverter");

// Normalize headers for all CSV files
normalizeHeaders();

// Convert normalized CSV files to JSON
// ... (existing code to convert CSV to JSON)

module.exports = {
  getCSVPath,
  listCSVFiles,
};
