import express from 'express'
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", isAuthenticated, getCartProducts);
router.post("/", isAuthenticated, addToCart);
router.delete("/", isAuthenticated, removeAllFromCart);
router.put("/:id", isAuthenticated, updateQuantity);

export default router;  