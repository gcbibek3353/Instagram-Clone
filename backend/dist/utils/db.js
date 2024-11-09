import mongoose from "mongoose";
const DB_URL = process.env.DB_URL;
if (!DB_URL) {
    throw new Error('DB_URL is not defined in environment variables');
}
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('MongoDB connected');
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
export default connectDB;
