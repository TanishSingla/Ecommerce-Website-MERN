const express = require('express');
const { isAuthenticated } = require('../middleware/auth.middleware.js');
const { checkoutSuccess, createCheckoutSession } = require('../controllers/payments.controller.js');

const router = express.Router();

router.post('/create-checkout-session', isAuthenticated, createCheckoutSession);
router.post('/checkout-success', isAuthenticated, checkoutSuccess);

module.exports = router; // Change export statement to CommonJS syntax
