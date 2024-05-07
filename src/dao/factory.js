import config from "../config/config.js"
import mongoose from "mongoose"

let Products
switch (config.persistence) {
    case "MONGO":
        const connection = await mongoose.connect(config.DB_URL)
        const {default: ProductsMongo} = await import("./mongo/products.js")
        Products = ProductsMongo
        break
    case "MEMORY":
        const {default: ProductsMemory} = await import("./memory/products.js")
        Products = ProductsMemory
        break
    default:
        throw new Error("Invalid persistence")
}

export default Products