import mongoose from 'mongoose';

const url = process.env.MONGODB_URI

mongoose.connect(url)

export default mongoose