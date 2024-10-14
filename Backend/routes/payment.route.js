import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { checkoutSuccess, createCheckoutSession } from '../controllers/payments.controller.js';



const router = express.Router();


router.post('/create-checkout-session', isAuthenticated, createCheckoutSession)
router.post('/checkout-success', isAuthenticated, checkoutSuccess)

export default router;  