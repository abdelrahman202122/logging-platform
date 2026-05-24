const { LOG_LEVELS } = require('../constants/logLevels');
const { ApiError } = require('../utils/apiError');

const validateLogPayload = (payload = {}) => {
  const { message, level } = payload;

  if (!message || !level) {
    throw new ApiError(400, 'Message and level are required');
  }

  if (!LOG_LEVELS.includes(String(level).toUpperCase())) {
    throw new ApiError(400, `Level must be one of: ${LOG_LEVELS.join(', ')}`);
  }
};

const parseLogQuery = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(query.limit, 10) || 10, 1),
    100,
  );
  const filters = {};

  if (query.level) {
    const level = String(query.level).toUpperCase();
    if (!LOG_LEVELS.includes(level)) {
      throw new ApiError(400, `Level must be one of: ${LOG_LEVELS.join(', ')}`);
    }
    filters.level = level;
  }

  if (query.search) {
    filters.message = { $regex: query.search, $options: 'i' };
  }

  if (query.from || query.to) {
    filters.createdAt = {};
    if (query.from) {
      filters.createdAt.$gte = new Date(query.from);
    }
    if (query.to) {
      filters.createdAt.$lte = new Date(query.to);
    }
  }

  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const allowedSortFields = [
    'createdAt',
    'updatedAt',
    'level',
    'count',
    'message',
  ];

  if (!allowedSortFields.includes(sortBy)) {
    throw new ApiError(
      400,
      `sortBy must be one of: ${allowedSortFields.join(', ')}`,
    );
  }

  return {
    filters,
    page,
    limit,
    sort: { [sortBy]: sortOrder },
  };
};

module.exports = { validateLogPayload, parseLogQuery };
