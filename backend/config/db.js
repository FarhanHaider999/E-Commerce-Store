import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully Connected to MongoDB');
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    console.error('Detailed Error:', error);
    process.exit(1);
  }
};

export default connectDB;
