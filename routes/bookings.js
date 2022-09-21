import express from 'express';
import Booking from '../db/models/Booking.js';
const router = express.Router();

// All bookings are stored as a reference to the original data in the "trips" collection
// not the data itself

// GET: All trips stored in bookings

router.get('/', async (req, res) => {
  let bookings;
  try {
    bookings = await Booking.find().populate('trip_id');
  } catch (err) {
    console.log(err);
    return res.json({ result: false, error: 'Failed to get bookings' });
  }
  bookings.length > 0
    ? res.json({ result: true, bookings: bookings.map(({ trip_id }) => trip_id) })
    : res.json({ result: false, error: 'No bookings' });
});

router.delete('/remove', async (req, res) => {
  let status;
  try {
    status = await Booking.deleteOne({ trip_id: req.query.trip_id });
  } catch (err) {
    console.log(err);
    return res.json({ result: false, error: 'Failed to delete booking' });
  }
  status.deletedCount > 0
    ? res.json({ result: true, message: 'Booking removed' })
    : res.json({ result: false, error: 'No bookings' });
});

export default router;
