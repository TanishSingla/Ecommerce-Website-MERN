import express from 'express';
import { createProduct, deleteProduct, getAllProduct, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeatureproducts } from '../controllers/product.controller.js';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware.js';


const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllProduct);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.patch("/:id", isAuthenticated, isAdmin, toggleFeatureproducts);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;