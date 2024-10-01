const fs = require('fs');
const path = require('path');

function getCSVPath(filename) {
  return path.join(__dirname, 'data', filename);
}

function listCSVFiles() {
  const dataDir = path.join(__dirname, 'data');
  return fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));
}

module.exports = {
  getCSVPath,
  listCSVFiles
};