const fs = require("fs");
const path = require("path");

function normalizeHeaders() {
  console.log("Normalizing headers");

  const csvDir = path.join(__dirname, "..", "data", "rawCSV");
  const outputFile = path.join(__dirname, "..", "data", "uniqueHeaders.txt");
  const files = fs.readdirSync(csvDir).filter((file) => file.endsWith(".csv"));

  let headerSets = {};

  files.forEach((file) => {
    console.log(`Processing file: ${file}`);
    const filePath = path.join(csvDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const lines = fileContent.split("\n");
    const headers = lines[1].split(",").map((header) => header.trim());

    //console.log(`Headers: ${headers}`);
    let tempSet = {};

    headers.forEach((header) => {
      if (header === "") {
        return;
      }

      if (!tempSet[header]) {
        tempSet[header] = header;
      }
    });

    // Add a hash property to tempSet

    tempSet.hash = Object.values(tempSet).join("").split("").sort().join("");
    var hash = tempSet.hash;

    //console.log(`Temp Set: ${tempSet.hash}`);
    if (!headerSets[tempSet.hash]) {
      delete tempSet.hash;
      headerSets[hash] = { headers: tempSet, files: [file] };
    } else {
      delete tempSet.hash;
      headerSets[hash].files.push(file);
    }

    //console.log(`Processed file: ${file}`);
  });

  writeUniqueHeaders(headerSets, outputFile);
}

function writeUniqueHeaders(headerSets, outputFile) {
  let output = "";

  console.log("Header Sets Length: ", Object.keys(headerSets).length);
  console.log("Header Sets: ", headerSets);

  Object.values(headerSets).forEach((value, key) => {
    Object.values(value.headers).forEach((header) => {
      output += `${header},`;
    });
    output += `\nFiles: `;
    Object.values(value.files).forEach((file) => {
      output += `${file},`;
    });

    output += "\n";
  });

  fs.writeFileSync(outputFile, output);
  console.log(`Unique headers have been written to ${outputFile}`);
}

module.exports = {
  normalizeHeaders,
};
