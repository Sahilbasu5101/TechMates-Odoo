const express = require('express');
const router = express.Router();
const driverPortalController = require('../controllers/driverPortal.controller');

router.post('/status', driverPortalController.updateStatus);
router.post('/complaint', driverPortalController.raiseComplaint);

module.exports = router;
