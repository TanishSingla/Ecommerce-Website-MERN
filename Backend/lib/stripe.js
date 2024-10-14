const Stripe = require('stripe'); // Importing Stripe
const dotenv = require('dotenv'); // Importing dotenv

dotenv.config(); // Loading environment variables

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Creating a Stripe client

module.exports = { stripe }; // Exporting the Stripe client
