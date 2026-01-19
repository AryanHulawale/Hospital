import express from 'express';
import { login,register,fetchMe } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.get('/me', fetchMe)

export default router;