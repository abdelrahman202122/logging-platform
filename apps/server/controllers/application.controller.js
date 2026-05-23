const {
  addDeveloperApplication,
  getDeveloperApplicationByName,
  getDeveloperApplications,
  removeDeveloperApplication,
} = require('../services/application.service');
const {
  validateApplicationPayload,
} = require('../validators/application.validator');

const getAllApplications = async (req, res) => {
  const applications = await getDeveloperApplications(req.developer._id);
  res.status(200).json({ success: true, data: applications });
};

const getApplicationByName = async (req, res) => {
  const application = await getDeveloperApplicationByName(
    req.params.name,
    req.developer._id,
  );
  res.status(200).json({ success: true, data: application });
};

const createApplication = async (req, res) => {
  validateApplicationPayload(req.body);
  const application = await addDeveloperApplication(
    req.body,
    req.developer._id,
  );
  res.status(201).json({ success: true, data: application });
};

const deleteApplication = async (req, res) => {
  const application = await removeDeveloperApplication(
    req.params.name,
    req.developer._id,
  );
  res.status(200).json({
    success: true,
    message: 'Application deleted successfully',
    data: application,
  });
};

module.exports = {
  getAllApplications,
  getApplicationByName,
  createApplication,
  deleteApplication,
};
