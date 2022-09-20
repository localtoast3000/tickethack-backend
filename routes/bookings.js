import express from 'express';
import SavedTrip from '../db/models/Item.js';
import Trip from '../db/models/Trip.js';
import Booking from '../db/models/Booking.js';
import { validateTripIdInReqBody } from '../lib/helpers.js';
const router = express.Router();

router.get('/', async (req, res) => {});

router.get('/trips', async (req, res) => {
  let trips;
  try {
    trips = await SavedTrip.find().populate('trip_id');
  } catch (err) {
    console.log(err);
    return res.json({ result: false, error: 'Failed to get trips' });
  }
  trips.length > 0
    ? res.json({ result: true, trips: trips.map(({ trip_id }) => trip_id) })
    : res.json({ result: false, error: 'Failed to get trips' });
});

router.delete('/removetrip', async (req, res) => {
  let status;
  try {
    status = await SavedTrip.deleteOne({ trip_id: req.query.trip_id });
  } catch (err) {
    console.log(err);
    return res.json({ result: false, error: 'Failed to delete trip' });
  }
  status.deletedCount > 0
    ? res.json({ result: true, message: 'Trip deleted' })
    : res.json({ result: false, error: 'Trip not found' });
});

export default router;
