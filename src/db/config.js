const path = require('path');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

module.exports = function () {
  return sqlite.open({
    driver: sqlite3.Database,
    filename: path.resolve(__dirname, 'database.sqlite')
  });
};
