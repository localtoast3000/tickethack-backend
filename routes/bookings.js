import express from 'express';
import SavedTrip from '../db/models/Item.js';
import Trip from '../db/models/Trip.js';
import Booking from '../db/models/Booking.js';
import { validateTripIdInReqBody } from '../lib/helpers.js';
const router = express.Router();

router.post('/addtrip', async (req, res) => {
  if (validateTripIdInReqBody(req.body)) {
    const { trip_id } = req.body;
    let foundTrip;
    try {
      foundTrip = await Item.findOne({ trip_id });
    } catch (err) {
      console.log(err);
      res.json({ result: false, error: 'Error with trip comparison' });
      return;
    }
    if (foundTrip) return res.json({ result: false, error: 'Trip already saved' });
    let result;
    try {
      if (!(await Trip.findById(trip_id))) return req.json({ result: false, error: 'Trip does not exsist' });
      result = await Item({ trip_id, payed: false }).save();
    } catch (err) {
      console.log(err);
      res.json({ result: false, error: 'Failed to store trip' });
      return;
    }
    if (result) res.json({ result: true, message: 'Trip saved' });
  } else res.json({ result: false, error: 'Invalid trip ID' });
});

router.get('/trips', async (req, res) => {
  let trips;
  try {
    trips = await Item.find().populate('trip_id');
  } catch (err) {
    console.log(err);
    return res.json({ result: false, error: 'Failed to get trips' });
  }
  trips.length > 0
    ? res.json({ result: true, trips: trips.map(({ trip_id }) => trip_id) })
    : res.json({ result: false, error: 'Failed to get trips' });
});

router.put('/paytrip', async (req, res) => {
  if (validateTripIdInReqBody(req.body)) {
    let status;
    try {
      status = await Item.updateOne({ trip_id: req.body.trip_id }, { payed: true });
      console.log(status);
    } catch (err) {
      console.log(err);
      return res.json({ result: false, error: 'Failed to update pay status' });
    }
    if (status.modifiedCount > 0) return res.json({ result: true, message: 'Trip payed' });
    if (status.matchedCount > 0) return res.json({ result: false, error: 'Trip already payed' });
    else res.json({ result: false, error: 'Trip not found' });
  } else res.json({ result: false, error: 'Invalid trip ID' });
});

router.delete('/removetrip', async (req, res) => {
  if (validateTripIdInReqBody(req.query.trip_id)) {
    let status;
    try {
      status = await Item.deleteOne({ trip_id: req.query.trip_id });
    } catch (err) {
      console.log(err);
      return res.json({ result: false, error: 'Failed to delete trip' });
    }
    status.deletedCount > 0
      ? res.json({ result: true, message: 'Trip deleted' })
      : res.json({ result: false, error: 'Trip not found' });
  } else res.json({ result: false, error: 'Invalid trip ID' });
});

export default router;
