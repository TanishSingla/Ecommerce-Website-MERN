const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route.js');
const productRoutes = require('./routes/product.route.js');
const cartRoutes = require('./routes/cart.route.js');
const couponsRoutes = require('./routes/coupons.route.js');
const paymentsRoutes = require('./routes/payment.route.js');
const analyticsRoutes = require('./routes/analytics.route.js');
const connectDB = require('./lib/db.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Log incoming requests
app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin); // Log the incoming origin
    next();
});

// CORS configuration
// app.use(
//     cors({
//         origin: "*", // Temporarily allow all origins for debugging
//         methods: "GET,POST,PUT,DELETE",
//         credentials: true,
//     })
// );
app.use(cors());

// Middleware for JSON parsing
app.use(express.json({ limit: '10mb' }));

// Basic health check route
app.get("/", (req, res) => {
    res.json({ message: "Server is working fine" });
});

// Middleware for cookies
app.use(cookieParser());

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Start server and connect to the database
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
    connectDB();
});
