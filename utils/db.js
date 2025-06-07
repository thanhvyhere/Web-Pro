import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();
class MongoConnection {
  constructor() {
    if (!MongoConnection.instance) {
      MongoConnection.instance = this;
      this._connect();
    }
    return MongoConnection.instance;
  }

  async _connect() {
    if (this.connection) return this.connection;

    try {
      this.connection = await mongoose.connect(
        process.env.MONGO_URI,
        {
        }
      );
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
    }

    return this.connection;
  }
}

new MongoConnection();

export { mongoose };
