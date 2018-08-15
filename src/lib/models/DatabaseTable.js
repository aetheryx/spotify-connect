module.exports = class DatabaseTable {
  constructor (tableName, db) {
    this.table = db.collection(tableName);
  }

  insert (item) {
    return this.table.insertOne(item);
  }

  remove (query) {
    if (typeof query === 'string') {
      query = { id: query };
    }

    return this.table.removeOne(query);
  }

  update (query, data) {
    return this.table.update(query, {
      $set: data
    });
  }

  find (query) {
    return this.table.findOne(query);
  }

  get (id) {
    return this.find({ id });
  }

  async set (data) {
    const existingEntry = await this.get({ id: data.id });
    return existingEntry
      ? this.table.update({ id: data.id }, data)
      : this.table.insert(data);
  }
};
