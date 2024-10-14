import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { getCoupon, validateCoupon } from '../controllers/coupons.controller.js';

const router = express.Router();

router.get("/", isAuthenticated, getCoupon);
router.post("/validate", isAuthenticated, validateCoupon);

export default router;