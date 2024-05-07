import Products from "../dao/dbManagers/products.js"
import Carts from "../dao/dbManagers/carts.js"

import ProductsRepository from "./products.repository.js"
import CartsRepository from "./carts.repository.js"

const productsDao = new Products()
const cartsDao = new Carts()

const productsRepository = new ProductsRepository(productsDao)
const cartsRepository = new CartsRepository(cartsDao)

export { productsRepository, cartsRepository }