const { MongoClient } = require('mongodb');
const { log } = require('@sc/utils');

const tables = require(`${__dirname}/tables`);

module.exports = async function createDB () {
  const db = await MongoClient
    .connect('mongodb://localhost:27017', {
      useNewUrlParser: true
    })
    .then(c => c.db('SpotifyConnect'))
    .catch(e => {
      if (e.message.includes('ECONNREFUSED')) {
        log.error('Failed to connect to MongoDB:', e.message);
        process.exit(1);
      }
    });

  for (const table in tables) {
    const Table = tables[table];
    tables[table] = new Table(db);
  }

  return tables;
};
