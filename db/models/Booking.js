import mongoose from 'mongoose';

export default mongoose.model(
  'booking',
  mongoose.Schema({
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'trips' },
    payed: Boolean,
  })
);
