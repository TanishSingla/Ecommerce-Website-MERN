import mongoose from 'mongoose';

export const connectDB = async () => {

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected ${connection.connection.host}`);
    } catch (e) {
        console.log("Error while connection to database.", e);
        process.exit(1);
    }
}