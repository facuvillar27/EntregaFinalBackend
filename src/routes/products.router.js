import express from "express"
import { getAllProducts, getProductById, createProduct, modifyProduct, deleteProduct } from "../controller/products.controller.js"
import { authorization, passportCall } from "../utils.js"

const router = express.Router()

//get all products
router.get("/", authorization("user", "premium"), getAllProducts)

//get product by id
router.get("/:pid", authorization("user", "premium"), getProductById)

//create a new product
router.post("/", passportCall("jwt", {session: false}), createProduct)

//update a product
router.put("/:pid", modifyProduct)

//delete a product
router.delete("/:pid", deleteProduct)

export default router