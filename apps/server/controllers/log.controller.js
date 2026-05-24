const {
  getApplicationLogs,
  getApplicationLogsSummary,
  saveApplicationLog,
} = require('../services/log.service');
const { getApiKey } = require('../middleware/apiKey.middleware');
const {
  parseLogQuery,
  validateLogPayload,
} = require('../validators/log.validator');

const getLogs = async (req, res) => {
  const queryOptions = parseLogQuery(req.query);
  const data = await getApplicationLogs(
    req.params.name,
    req.developer._id,
    queryOptions,
  );
  res.status(200).json({ success: true, data });
};

const getLogsSummary = async (req, res) => {
  const data = await getApplicationLogsSummary(
    req.params.name,
    req.developer._id,
  );
  res.status(200).json({ success: true, data });
};

const postLog = async (req, res) => {
  validateLogPayload(req.body);
  const log = await saveApplicationLog(
    req.params.name,
    getApiKey(req),
    req.body,
  );
  res.status(201).json({ success: true, data: log });
};

module.exports = { getLogs, getLogsSummary, postLog };
