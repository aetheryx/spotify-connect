const { GenericRequest } = require('@sc/http');

module.exports = (uri) => new GenericRequest('POST', uri);
