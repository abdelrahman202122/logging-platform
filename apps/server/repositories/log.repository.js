const Log = require('../models/log.model');

const findLogsByApplication = async (applicationId, queryOptions) => {
  const { filters, sort, page, limit } = queryOptions;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    Log.find({ application: applicationId, ...filters })
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Log.countDocuments({ application: applicationId, ...filters }),
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const incrementOrCreateLog = (applicationId, logData) =>
  Log.findOneAndUpdate(
    {
      application: applicationId,
      message: logData.message,
      level: logData.level,
    },
    {
      $inc: { count: 1 },
      $setOnInsert: {
        application: applicationId,
        message: logData.message,
        level: logData.level,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

const deleteLogsByApplication = (applicationId) =>
  Log.deleteMany({ application: applicationId });

module.exports = {
  findLogsByApplication,
  incrementOrCreateLog,
  deleteLogsByApplication,
};
