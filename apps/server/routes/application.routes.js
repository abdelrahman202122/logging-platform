const express = require('express');
const {
  createApplication,
  deleteApplication,
  getAllApplications,
  getApplicationByName,
} = require('../controllers/application.controller');
const { getLogs, postLog } = require('../controllers/log.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(protect, getAllApplications)
  .post(protect, createApplication);
router
  .route('/:name')
  .get(protect, getApplicationByName)
  .delete(protect, deleteApplication);
router.route('/:name/logs').get(protect, getLogs).post(postLog);

module.exports = router;
