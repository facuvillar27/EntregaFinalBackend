import express from "express"
import { getPurchase } from "../controller/orders.controller.js"
import { getAll, getById, populatedCart, createCart, manageCartProducts, removeProductFromCart, emptyCart } from "../controller/cart.controller.js"
import { passportCall} from '../utils.js';
import errorHandler from "../middleware/errors/index.js"

const router = express.Router()

router.get("/", getAll)

router.get("/:cid", getById)

router.get("/populated/:cid", populatedCart)

router.post("/", createCart)

router.post("/product/:pid", passportCall("jwt", {session: false}), manageCartProducts)

router.delete("/:cid/product/:pid", removeProductFromCart)

router.put("/emptyCart/:cid", passportCall("jwt", {session: false}), emptyCart)

router.post("/:cid/purchase", passportCall("jwt", {session: false}), getPurchase)
    
router.use(errorHandler)

export default router