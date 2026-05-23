const {
  createApplication,
  deleteApplicationByNameAndDeveloper,
  findApplicationByName,
  findApplicationByNameAndDeveloper,
  findApplicationsByDeveloper,
} = require("../repositories/application.repository");
const { deleteLogsByApplication } = require("../repositories/log.repository");
const { ApiError } = require("../utils/apiError");

const getDeveloperApplications = (developerId) => findApplicationsByDeveloper(developerId);

const getDeveloperApplicationByName = async (name, developerId) => {
  const application = await findApplicationByNameAndDeveloper(name, developerId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return application;
};

const addDeveloperApplication = async (payload, developerId) => {
  const existingApplication = await findApplicationByName(payload.name);
  if (existingApplication) {
    throw new ApiError(409, "Application name is already taken");
  }

  return createApplication({ name: payload.name, developer: developerId });
};

const removeDeveloperApplication = async (name, developerId) => {
  const application = await deleteApplicationByNameAndDeveloper(name, developerId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  await deleteLogsByApplication(application._id);
  return application;
};

module.exports = {
  getDeveloperApplications,
  getDeveloperApplicationByName,
  addDeveloperApplication,
  removeDeveloperApplication,
};
