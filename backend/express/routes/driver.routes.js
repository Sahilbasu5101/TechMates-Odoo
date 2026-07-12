const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');

router.get('/', driverController.getAllDrivers);
router.post('/', driverController.addDriver);

module.exports = router;
