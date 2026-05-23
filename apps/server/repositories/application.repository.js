const Application = require('../models/application.model');

const createApplication = (applicationData) =>
  Application.create(applicationData);

const findApplicationsByDeveloper = (developerId) =>
  Application.find({ developer: developerId }).sort({ createdAt: -1 });

const findApplicationByName = (name) => Application.findOne({ name });

const findApplicationByNameAndDeveloper = (name, developerId) =>
  Application.findOne({ name, developer: developerId });

const deleteApplicationByNameAndDeveloper = (name, developerId) =>
  Application.findOneAndDelete({ name, developer: developerId });

module.exports = {
  createApplication,
  findApplicationsByDeveloper,
  findApplicationByName,
  findApplicationByNameAndDeveloper,
  deleteApplicationByNameAndDeveloper,
};
