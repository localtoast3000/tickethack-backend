import express from 'express';
import Booking from '../db/models/Booking.js';
const router = express.Router();

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
    : res.json({ result: false, error: 'Failed to get bookings' });
});

export default router;
