import { Router } from 'express';
import userCart from '../controller/userCart.controller.js';

const router = Router();

router.post("/", userCart)

export default router;