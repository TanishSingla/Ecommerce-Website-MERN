const express = require('express');
const { isAuthenticated } = require('../middleware/auth.middleware.js');
const { signup, login, logout, refreshToken, getProfile } = require('../controllers/auth.controller.js');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);
router.get("/profile", isAuthenticated, getProfile);

module.exports = router; // Change export statement to CommonJS syntax
