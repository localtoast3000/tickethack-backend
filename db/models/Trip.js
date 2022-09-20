import mongoose from 'mongoose';

export default mongoose.model(
  'trips',
  mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    price: Number,
  })
);
