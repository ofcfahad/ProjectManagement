import mongoose from 'mongoose';
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    const db = await mongoose.connect(mongoUri!);
    console.log(`connected to ${db.connection.name} db`);
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;