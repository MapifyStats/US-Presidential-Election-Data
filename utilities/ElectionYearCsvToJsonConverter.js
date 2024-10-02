const fs = require("fs");
const path = require("path");

function convertCsvToJson(csvFilePath, outputJsonPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(csvFilePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const electionYear = parseInt(path.basename(csvFilePath, ".csv"));
      const rows = data.split("\n");
      const headers = rows[0].split(",").map((header) => header.trim());
      const secondHeaders = rows[0].split(",").map((header) => header.trim());
      const candidateFields = headers
        .slice(1, -1)
        .filter((header) => header !== "");

      const results = [];

      for (let i = 2; i < rows.length; i++) {
        const row = rows[i].split(",");
        if (row[0] === "State" || row.length <= 1) continue;

        const state = {
          name: row[0],
          totalVotes: parseInt(row[row.length - 1].replace(/,/g, "")),
          candidates: [],
        };

        let fieldIndex = 1;
        for (const field of candidateFields) {
          if (row[fieldIndex]) {
            const [candidate, party] = field.split(":");
            state.candidates.push({
              candidate: candidate,
              party: party || "Other",
              votes: parseInt(row[fieldIndex].replace(/,/g, "")),
              percentage: parseFloat(row[fieldIndex + 1]),
              electoralVotes: parseInt(row[fieldIndex + 2]) || 0,
            });
          }
          fieldIndex += 3;
        }

        results.push(state);
      }

      const electionYearResult = {
        electionYear: electionYear,
        states: results,
      };

      fs.writeFile(
        outputJsonPath,
        JSON.stringify(electionYearResult, null, 2),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(electionYearResult);
          }
        }
      );
    });
  });
}

module.exports = {
  convertCsvToJson,
};
