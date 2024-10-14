const mongoose = require('mongoose'); // Importing mongoose

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (e) {
        console.log("Error while connecting to database.", e);
        process.exit(1);
    }
};

module.exports = connectDB; 
