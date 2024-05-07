import { Router } from "express";
import { createOrder, getOrderById, getOrders, resolveOrder } from "../controller/orders.controller.js";
import passport from "passport";
import { passportCall } from "../utils.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", passportCall("jwt"), createOrder);
router.put("/:id", resolveOrder);

export default router;