import mongoose from 'mongoose';

export default mongoose.model(
  'years',
  mongoose.Schema({
    year: String,
  })
);
