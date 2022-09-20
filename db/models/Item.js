import mongoose from 'mongoose';

export default mongoose.model(
  'item',
  mongoose.Schema({
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'trips' },
    payed: Boolean,
  }),
  'cart'
);
