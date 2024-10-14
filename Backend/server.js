import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import couponsRoutes from './routes/coupons.route.js'
import paymentsRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();


const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));


app.use(express.json({
    limit: '10mb'
}));

app.get("/", (req, res) => {
    res.json({
        message: "working"
    })
})

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/analytics", analyticsRoutes);


app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
    connectDB();
})



