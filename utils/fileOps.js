const fs = require('fs/promises');

async function readJson(p) {
  const txt = await fs.readFile(p, 'utf-8');
  return JSON.parse(txt);
}
async function writeJson(p, data) {
  await fs.writeFile(p, JSON.stringify(data, null, 2));
}
module.exports = { readJson, writeJson };
