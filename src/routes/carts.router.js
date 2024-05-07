import express from "express"
import { getPurchase } from "../controller/orders.controller.js"
import { getAll, getById, populatedCart, createCart, manageCartProducts, removeProductFromCart, emptyCart } from "../controller/cart.controller.js"
import errorHandler from "../middleware/errors/index.js"

const router = express.Router()

router.get("/", getAll)

router.get("/:cid", getById)

router.get("/populated/:cid", populatedCart)

router.post("/", createCart)

router.post("/:cid/product/:pid", manageCartProducts)

router.delete("/:cid/product/:pid", removeProductFromCart)

router.delete("/:cid", emptyCart)

router.post("/cid/purchase", getPurchase)
    
router.use(errorHandler)

export default router