const express = require('express');
const { addToCart, getCartProducts, removeAllFromCart, updateQuantity } = require('../controllers/cart.controller.js');
const { isAuthenticated } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get("/", isAuthenticated, getCartProducts);
router.post("/", isAuthenticated, addToCart); 
router.delete("/", isAuthenticated, removeAllFromCart);
router.put("/:id", isAuthenticated, updateQuantity);

module.exports = router; // Change export statement to CommonJS syntax
