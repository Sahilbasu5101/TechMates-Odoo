const express = require("express");
const mongoose = require("mongoose");
const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

const router = express.Router();
// GET /api/maintenance?vehicle=<id>&status=OPEN|CLOSED
router.get("/", async (req, res, next) => {
  try {
    const { vehicle, status } = req.query;
    const filter = {};
    if (vehicle) {
      if (!mongoose.isValidObjectId(vehicle)) {
        return res.status(400).json({ error: "vehicle must be a valid vehicle id" });
      }
      filter.vehicle = vehicle;
    }
    if (status) {
      if (!["OPEN", "CLOSED"].includes(status)) {
        return res.status(400).json({ error: "status must be OPEN or CLOSED" });
      }
      filter.status = status;
    }
    const records = await Maintenance.find(filter)
      .sort({ date: -1 })
      .populate("vehicle", "name registrationNo status");
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// POST /api/maintenance — create OPEN record, auto-set vehicle to "In Shop"
router.post("/", async (req, res, next) => {
  try {
    const { vehicle: vehicleId, serviceType, description, cost, date } = req.body;

    if (!vehicleId || !mongoose.isValidObjectId(vehicleId)) {
      return res.status(400).json({ error: "A valid vehicle id is required" });
    }
    if (!serviceType || !String(serviceType).trim()) {
      return res.status(400).json({ error: "serviceType is required" });
    }
    if (typeof cost !== "number" || Number.isNaN(cost) || cost < 0) {
      return res.status(400).json({ error: "cost must be a non-negative number" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    if (vehicle.status === "On Trip") {
      return res.status(409).json({
        error: "Vehicle is on an active trip; complete or cancel the trip first",
      });
    }
    if (vehicle.status === "Retired") {
      return res.status(409).json({
        error: "Vehicle is retired and cannot be sent for maintenance",
      });
    }

    const record = await Maintenance.create({
      vehicle: vehicle._id,
      serviceType: String(serviceType).trim(),
      description,
      cost,
      date,
      status: "OPEN",
    });

    // Already "In Shop" (another OPEN record exists) -> record is allowed,
    // but don't double-toggle the vehicle status.
    if (vehicle.status !== "In Shop") {
      vehicle.status = "In Shop";
      try {
        await vehicle.save();
      } catch (err) {
        // Rollback: maintenance + vehicle must change together
        await Maintenance.findByIdAndDelete(record._id);
        throw err;
      }
    }

    res.status(201).json({ maintenance: record, vehicle });
  } catch (err) {
    next(err);
  }
});

// PUT /api/maintenance/:id/close — CLOSED + closedAt, restore vehicle to
// "Available" unless Retired; keep "In Shop" while other OPEN records exist.
router.put("/:id/close", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid maintenance record id" });
    }

    const record = await Maintenance.findById(id);
    if (!record) {
      return res.status(404).json({ error: "Maintenance record not found" });
    }
    if (record.status === "CLOSED") {
      return res.status(409).json({ error: "Maintenance record is already closed" });
    }

    const vehicle = await Vehicle.findById(record.vehicle);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle for this record no longer exists" });
    }

    record.status = "CLOSED";
    record.closedAt = new Date();
    await record.save();

    const otherOpen = await Maintenance.countDocuments({
      vehicle: record.vehicle,
      status: "OPEN",
      _id: { $ne: record._id },
    });

    if (otherOpen === 0 && vehicle.status !== "Retired") {
      vehicle.status = "Available";
      try {
        await vehicle.save();
      } catch (err) {
        // Rollback the close so the pair stays consistent
        record.status = "OPEN";
        record.closedAt = undefined;
        await record.save();
        throw err;
      }
    }

    res.json({ maintenance: record, vehicle });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
