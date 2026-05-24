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

const getLogSummaryByApplication = async (applicationId) => {
  const matchApplication = { application: applicationId };

  const [levelCounts, dailyCounts, totals, latestLog, topLog] =
    await Promise.all([
      Log.aggregate([
        { $match: matchApplication },
        {
          $group: {
            _id: '$level',
            count: { $sum: '$count' },
            uniqueLogs: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Log.aggregate([
        { $match: matchApplication },
        {
          $group: {
            _id: {
              day: {
                $dateToString: {
                  date: '$updatedAt',
                  format: '%Y-%m-%d',
                  timezone: 'UTC',
                },
              },
              level: '$level',
            },
            count: { $sum: '$count' },
          },
        },
        { $sort: { '_id.day': 1 } },
      ]),
      Log.aggregate([
        { $match: matchApplication },
        {
          $group: {
            _id: null,
            totalEvents: { $sum: '$count' },
            uniqueLogs: { $sum: 1 },
          },
        },
      ]),
      Log.findOne(matchApplication).sort({ updatedAt: -1 }),
      Log.findOne(matchApplication).sort({ count: -1, updatedAt: -1 }),
    ]);

  return {
    levelCounts,
    dailyCounts: dailyCounts.map((entry) => ({
      day: entry._id.day,
      level: entry._id.level,
      count: entry.count,
    })),
    totals: totals[0] || { totalEvents: 0, uniqueLogs: 0 },
    latestLog,
    topLog,
  };
};

module.exports = {
  findLogsByApplication,
  getLogSummaryByApplication,
  incrementOrCreateLog,
  deleteLogsByApplication,
};
