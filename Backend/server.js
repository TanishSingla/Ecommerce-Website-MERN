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
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(express.json({
    limit: '10mb'
}));

app.get("/", (req, res) => {
    res.json({
        message: "working"
    });
});

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/analytics", analyticsRoutes);


app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
    connectDB();
});
