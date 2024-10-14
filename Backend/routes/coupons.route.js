const express = require('express');
const { isAuthenticated } = require('../middleware/auth.middleware.js');
const { getCoupon, validateCoupon } = require('../controllers/coupons.controller.js');

const router = express.Router();

router.get("/", isAuthenticated, getCoupon);
router.post("/validate", isAuthenticated, validateCoupon);

module.exports = router; // Change export statement to CommonJS syntax
