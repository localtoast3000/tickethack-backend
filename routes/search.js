import express from 'express';
import Trip from '../db/models/Trip.js';
import { format } from 'date-fns';
const router = express.Router();

router.get('/', async (req, res) => {
  if (validateQuerys(req.query)) {
    const { departure, arrival, date } = req.query;
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

function validateQuerys({ departure, arrival, date }) {
  const dateRegexp = /^([0-9]|[0-2][0-9]|(3)[0-1])(\/)(([0-9]|(0)[0-9])|((1)[0-2]))(\/)\d{4}$/g;
  if (!departure && !arrival && !date) return false;
  if (departure.length < 2 || arrival.length < 2) return false;
  if (!dateRegexp.test(date)) return false;
  return true;
}

export default router;
