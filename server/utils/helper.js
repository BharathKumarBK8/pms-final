const path = require("path");
const fs = require("fs").promises;

const dataDir = path.join(__dirname, "../data");

// Generic helper: read JSON file
async function readJson(fileName) {
  const filePath = path.join(dataDir, fileName);
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

// Generic helper: write JSON file
async function writeJson(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readJson, writeJson };
