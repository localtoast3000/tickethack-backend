import express from 'express';
import Item from '../db/models/Item.js';
import Trip from '../db/models/Trip.js';
import Booking from '../db/models/Booking.js';
import { validateTripIdInReqBody } from '../lib/helpers.js';
const router = express.Router();

// All items are stored as a reference to the original data in the "trips" collection
// not the data itself

// POST: Adds a new "Item" (trip) to the "cart" collection
// Takes the "id" of the trip to be stored in "cart"

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

// GET: All items stored in "cart"

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

// POST: Updates the "payed" status to "true" of the items in the "cart"
// Sends all payed items to the "bookings" collection
// then removes all items from the "cart" which are now stored in "bookings"

router.post('/paytrips', async (req, res) => {
  let status;
  try {
    status = await Item.updateMany({}, { payed: true });
    console.log(status);
  } catch (err) {
    console.log(err);
    return res.json({ result: false, error: 'Failed to update pay status' });
  }
  const payedItems = await Item.find();
  if (status.modifiedCount === payedItems.length || status.matchedCount === payedItems.length) {
    try {
      for (let { trip_id, payed } of payedItems) {
        let foundTrip;
        try {
          foundTrip = await Booking.findOne({ trip_id });
        } catch (err) {
          console.log(err);
          res.json({ result: false, error: 'Error with trip comparison' });
          return;
        }
        if (foundTrip) return res.json({ result: false, error: 'Trip already stored in bookings' });
        await new Booking({ trip_id, payed }).save();
      }
      await Item.deleteMany({});
    } catch (err) {
      console.log(err);
      res.json({ result: false, error: 'Failed to transfer all payed trips to bookings' });
    }
    res.json({ result: true, message: 'All payed trips transfered to bookings' });
  } else res.json({ result: false, error: 'Trips not found' });
});

// DELETE: Removes an "item" from "cart"

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
