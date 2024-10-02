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

const {
  convertCsvToJson,
} = require("./utilities/ElectionYearCsvToJsonConverter");
//convertCsvToJson(getCSVPath("2016.csv"), getCSVPath("2016.json"));

const { normalizeHeaders } = require("./utilities/HeaderNormalizer");
normalizeHeaders();

module.exports = {
  getCSVPath,
  listCSVFiles,
};
