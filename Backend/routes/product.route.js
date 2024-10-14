const express = require('express');
const {
    createProduct,
    deleteProduct,
    getAllProduct,
    getFeaturedProducts,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeatureproducts
} = require('../controllers/product.controller.js');
const { isAdmin, isAuthenticated } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllProduct);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.patch("/:id", isAuthenticated, isAdmin, toggleFeatureproducts);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

module.exports = router; // Change export statement to CommonJS syntax
