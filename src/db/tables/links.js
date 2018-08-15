const { DatabaseTable } = require('@sc/models');

module.exports = class LinkTable extends DatabaseTable {
  constructor (db) {
    super('links', db);
  }
};
