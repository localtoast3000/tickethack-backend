import express from 'express';
import Trip from '../db/models/Trip.js';
import { format } from 'date-fns';
const router = express.Router();

router.get('/', async (req, res) => {
  const { departure, arrival, date } = req.query;
  if (departure && arrival && date) {
    let trips;
    try {
      trips = await Trip.find({
        departure: caseInsensitiveSearchString(departure),
        arrival: caseInsensitiveSearchString(arrival),
      });
    } catch {
      res.json({ result: false, error: 'Error with trip search' });
      return;
    }
    const foundDates = trips.filter((trip) => format(new Date(trip.date), 'dd/MM/yyyy') === date);
    foundDates.length > 0
      ? res.json({ result: true, trips: foundDates })
      : res.json({ result: false, error: 'No trips found for given date' });
  } else res.json({ result: false, error: 'Invalid search query' });
});

function caseInsensitiveSearchString(searchString) {
  return new RegExp(`^${searchString}$`, 'i');
}

export default router;
