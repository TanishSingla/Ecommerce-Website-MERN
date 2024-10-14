import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { signup, login, logout, refreshToken, getProfile } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);
router.get("/profile", isAuthenticated, getProfile);

export default router;