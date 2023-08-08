import mongoose from 'mongoose';
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri!);
    console.log('Connected to Database');
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;