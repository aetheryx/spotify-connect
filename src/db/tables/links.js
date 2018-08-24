const { DatabaseTable } = require('@sc/models');

module.exports = class LinkTable extends DatabaseTable {
  constructor (db) {
    super('links', db);
  }

  updateAuth (link) {
    this.update({
      id: link.id
    }, {
      'auth.access_token': link.auth.access_token,
      'auth.expiryDate': Date.now() + (link.auth.expires_in * 1000)
    });
  }
};
