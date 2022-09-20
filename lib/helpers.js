import { isDate } from 'date-fns';

export function caseInsensitiveSearchString(searchString) {
  return new RegExp(`^${searchString}$`, 'i');
}

export function validateSearchTripReqQuery({ departure, arrival, date }) {
  const dateRegexp = /^([0-9]|[0-2][0-9]|(3)[0-1])(\/)(([0-9]|(0)[0-9])|((1)[0-2]))(\/)\d{4}$/g;
  if (!departure || !arrival || !date) return false;
  if (departure.length < 2 || arrival.length < 2) return false;
  if (!dateRegexp.test(date)) return false;
  return true;
}

export function validateTripIdInReqBody({ trip_id }) {
  return String(trip_id).length === 24;
}

export function validateAddTripReqBody({ departure, arrival, date, price }) {
  if (!departure || !arrival || !date || !price) return false;
  if (departure.length < 2 || arrival.length < 2) return false;
  if (!isDate(new Date(date))) return false;
  if (Number.isNaN(Number(price))) return false;
  return true;
}
