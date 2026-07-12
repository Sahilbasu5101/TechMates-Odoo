const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/trip.routes');
const driverPortalRoutes = require('./routes/driverPortal.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/trips', tripRoutes);
app.use('/api/driver-portal', driverPortalRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/techmates_dispatch';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));
