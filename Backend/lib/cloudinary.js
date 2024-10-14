const cloudinary = require("cloudinary").v2; // Importing Cloudinary
const dotenv = require("dotenv"); // Importing dotenv

dotenv.config(); // Load environment variables

// Configuring Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary; // Change export statement to CommonJS syntax
