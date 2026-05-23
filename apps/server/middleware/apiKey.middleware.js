const getApiKey = (req) =>
  req.headers['x-api-key'] || req.headers.authorization?.replace('ApiKey ', '');

module.exports = { getApiKey };
