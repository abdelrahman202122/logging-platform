const asyncHandler = require('express-async-handler');
const {
  addDeveloperApplication,
  getDeveloperApplicationByName,
  getDeveloperApplications,
  removeDeveloperApplication,
} = require('../services/application.service');
const {
  validateApplicationPayload,
} = require('../validators/application.validator');

const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await getDeveloperApplications(req.developer._id);
  res.status(200).json({ success: true, data: applications });
});

const getApplicationByName = asyncHandler(async (req, res) => {
  const application = await getDeveloperApplicationByName(
    req.params.name,
    req.developer._id,
  );
  res.status(200).json({ success: true, data: application });
});

const createApplication = asyncHandler(async (req, res) => {
  validateApplicationPayload(req.body);
  const application = await addDeveloperApplication(
    req.body,
    req.developer._id,
  );
  res.status(201).json({ success: true, data: application });
});

const deleteApplication = asyncHandler(async (req, res) => {
  const application = await removeDeveloperApplication(
    req.params.name,
    req.developer._id,
  );
  res.status(200).json({
    success: true,
    message: 'Application deleted successfully',
    data: application,
  });
});

module.exports = {
  getAllApplications,
  getApplicationByName,
  createApplication,
  deleteApplication,
};
