const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

function normalizeHeaders() {
  const uniqueHeadersPath = path.join(
    __dirname,
    "..",
    "data",
    "uniqueHeaders.txt"
  );
  const rawCsvFolder = path.join(__dirname, "..", "data", "rawCsv");
  const normalizedCsvFolder = path.join(
    __dirname,
    "..",
    "data",
    "normalizedCsv"
  );

  // Ensure the normalizedCsv folder exists
  if (!fs.existsSync(normalizedCsvFolder)) {
    fs.mkdirSync(normalizedCsvFolder);
  }

  // Read and parse the uniqueHeaders.txt file
  const uniqueHeadersContent = fs.readFileSync(uniqueHeadersPath, "utf-8");
  const headerSets = uniqueHeadersContent.split("\n\n");

  // Determine the most common header set
  const mostCommonHeaders = getMostCommonHeaders(headerSets);

  // Process each CSV file in the rawCsv folder
  fs.readdirSync(rawCsvFolder).forEach((file) => {
    if (path.extname(file).toLowerCase() === ".csv") {
      normalizeCSVFile(
        path.join(rawCsvFolder, file),
        path.join(normalizedCsvFolder, file),
        mostCommonHeaders
      );
    }
  });
}

function getMostCommonHeaders(headerSets) {
  const headerCounts = {};
  let maxCount = 0;
  let mostCommonHeaders = [];

  headerSets.forEach((set) => {
    const headers = set.split("\n")[0].split(",");
    const key = headers.join(",");
    headerCounts[key] = (headerCounts[key] || 0) + 1;

    if (headerCounts[key] > maxCount) {
      maxCount = headerCounts[key];
      mostCommonHeaders = headers;
    }
  });

  return mostCommonHeaders;
}

function normalizeCSVFile(inputPath, outputPath, normalizedHeaders) {
  const rows = [];
  fs.createReadStream(inputPath)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", () => {
      const csvStringifier = createCsvStringifier({
        header: normalizedHeaders.map((header) => ({
          id: header,
          title: header,
        })),
      });

      const normalizedRows = rows.map((row) => {
        const normalizedRow = {};
        normalizedHeaders.forEach((header) => {
          const matchingKey = Object.keys(row).find(
            (key) => key.toLowerCase() === header.toLowerCase()
          );
          normalizedRow[header] = matchingKey ? row[matchingKey] : "";
        });
        return normalizedRow;
      });

      const csvContent =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(normalizedRows);
      fs.writeFileSync(outputPath, csvContent);
      console.log(
        `Normalized ${path.basename(inputPath)} -> ${path.basename(outputPath)}`
      );
    });
}

module.exports = { normalizeHeaders };
