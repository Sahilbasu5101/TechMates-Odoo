const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

router.post('/', tripController.createTrip);
router.post('/:id/dispatch', tripController.dispatchTrip);
router.post('/:id/complete', tripController.completeTrip);
router.post('/:id/cancel', tripController.cancelTrip);
router.get('/live', tripController.getLiveTrips);
router.post('/:id/emergency-reassign', tripController.emergencyReassign);

module.exports = router;
