import CartsDao from "../dao/classes/cart.dao.js";
import CartsRepository from "./repositories/carts.repository.js";
import OrderDao from "../dao/classes/order.dao.js";
import OrderRepository from "./repositories/order.repository.js";
import ProductsDao from "../dao/classes/product.dao.js";
import ProductsRepository from "./repositories/products.repository.js";
import UsersDao from "../dao/classes/user.dao.js";
import UsersRepository from "./repositories/users.repository.js";

export const cartService = new CartsRepository(new CartsDao());
export const orderService = new OrderRepository(new OrderDao());
export const productService = new ProductsRepository(new ProductsDao());
export const userService = new UsersRepository(new UsersDao());
