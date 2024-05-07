import ProductsDaoMemory from "../memory/products.js";
import ProductsDaoMongo from "../mongo/products.js";
import PERSISTANCE from "../../config/config.js";

const productsDao = PERSISTANCE === "MONGO" ? new ProductsDaoMongo() : new ProductsDaoMemory()
export default productsDao