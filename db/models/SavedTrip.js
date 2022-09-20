import mongoose from 'mongoose';

export default mongoose.model(
  'cart',
  mongoose.Schema({
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'trips' },
  }),
  'cart'
);
