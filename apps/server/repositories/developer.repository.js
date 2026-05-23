const Developer = require("../models/developer.model");

const createDeveloper = (developerData) => Developer.create(developerData);

const findDeveloperByEmail = (email, options = {}) => {
  const query = Developer.findOne({ email });
  if (options.includeSecrets) {
    query.select("+password +apiKey");
  }
  return query;
};

const findDeveloperById = (id, options = {}) => {
  const query = Developer.findById(id);
  if (options.includeApiKey) {
    query.select("+apiKey");
  }
  return query;
};

const findDeveloperByApiKey = (apiKey) => Developer.findOne({ apiKey }).select("+apiKey");

module.exports = {
  createDeveloper,
  findDeveloperByEmail,
  findDeveloperById,
  findDeveloperByApiKey,
};
