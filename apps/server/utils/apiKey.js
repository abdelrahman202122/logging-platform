const crypto = require('crypto');

const generateApiKey = () => crypto.randomBytes(32).toString('hex');

module.exports = { generateApiKey };
