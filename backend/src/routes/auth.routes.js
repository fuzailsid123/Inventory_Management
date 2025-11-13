import express from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser, updateAccountDetails, changeCurrentPassword } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { validate } from '../middleware/validator.js';
import { verifyJWT } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', authLimiter, loginValidator, validate, loginUser);
router.get('/me', verifyJWT, getCurrentUser);
router.patch("/update", verifyJWT, updateAccountDetails);
router.post("/logout", verifyJWT, logoutUser);
router.put("/change-password", verifyJWT, changeCurrentPassword);

export default router;



