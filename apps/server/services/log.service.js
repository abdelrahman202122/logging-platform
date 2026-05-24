const {
  findDeveloperByApiKey,
} = require('../repositories/developer.repository');
const {
  findApplicationByNameAndDeveloper,
} = require('../repositories/application.repository');
const {
  getLogSummaryByApplication,
  findLogsByApplication,
  incrementOrCreateLog,
} = require('../repositories/log.repository');
const { ApiError } = require('../utils/apiError');

const getApplicationLogs = async (
  applicationName,
  developerId,
  queryOptions,
) => {
  const application = await findApplicationByNameAndDeveloper(
    applicationName,
    developerId,
  );
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  return findLogsByApplication(application._id, queryOptions);
};

const getApplicationLogsSummary = async (applicationName, developerId) => {
  const application = await findApplicationByNameAndDeveloper(
    applicationName,
    developerId,
  );
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  return getLogSummaryByApplication(application._id);
};

const saveApplicationLog = async (applicationName, apiKey, payload) => {
  if (!apiKey) {
    throw new ApiError(401, 'API key is required');
  }

  const developer = await findDeveloperByApiKey(apiKey);
  if (!developer) {
    throw new ApiError(401, 'Invalid API key');
  }

  const application = await findApplicationByNameAndDeveloper(
    applicationName,
    developer._id,
  );
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  return incrementOrCreateLog(application._id, {
    message: payload.message,
    level: String(payload.level).toUpperCase(),
  });
};

module.exports = {
  getApplicationLogs,
  getApplicationLogsSummary,
  saveApplicationLog,
};
