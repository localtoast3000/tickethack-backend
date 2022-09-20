import express from 'express';
import Trip from '../db/models/Trip.js';
import { format } from 'date-fns';
import { caseInsensitiveSearchString, validateSearchTripReqQuery } from '../lib/helpers.js';
const router = express.Router();

// GET: All trips matching the search query
//
// Accepts querys:
//    departure : String city name
//    arrival   : String city name
//    date      : DateString format 'dd/MM/yyyy'

router.get('/', async (req, res) => {
  if (validateSearchTripReqQuery(req.query)) {
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
      : res.json({ result: false, error: 'No trips available on these dates' });
  } else res.json({ result: false, error: 'Invalid search query' });
});

export default router;
