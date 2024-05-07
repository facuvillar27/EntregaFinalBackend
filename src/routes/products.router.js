import express from "express"
import { getAllProducts, getProductById, createProduct, modifyProduct, deleteProduct } from "../controller/products.controller.js"
import { verifyToken, authToken, authorization } from "../utils.js"

const router = express.Router()

//get all products
router.get("/", verifyToken, authorization("user", "premium"), getAllProducts)

//get product by id
router.get("/:pid", authorization("user", "premium"), getProductById)

//create a new product
router.post("/", authToken, authorization("premium"), createProduct)

//update a product
router.put("/:pid", modifyProduct)

//delete a product
router.delete("/:pid", deleteProduct)

export default router