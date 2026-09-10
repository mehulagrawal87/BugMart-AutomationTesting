const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'store.json');
const INITIAL_DATA_PATH = path.join(__dirname, 'initialData.json');

function initDb() {
  if (!fs.existsSync(STORE_PATH)) {
    const initialData = fs.readFileSync(INITIAL_DATA_PATH, 'utf8');
    fs.writeFileSync(STORE_PATH, initialData, 'utf8');
  }
}

function getDb() {
  initDb();
  const content = fs.readFileSync(STORE_PATH, 'utf8');
  return JSON.parse(content);
}

function saveDb(data) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function resetDb() {
  const initialData = fs.readFileSync(INITIAL_DATA_PATH, 'utf8');
  fs.writeFileSync(STORE_PATH, initialData, 'utf8');
  return JSON.parse(initialData);
}

module.exports = {
  getDb,
  saveDb,
  resetDb
};
